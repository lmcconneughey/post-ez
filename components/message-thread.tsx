'use client';

import MessageBubble from './message-bubble';
import ImageComponent from './image';
import { ImageIcon, SendHorizonal } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useState, useOptimistic } from 'react';
import { sendMessageAction } from '../lib/actions/interactions-actions';

type MessageType = {
    id: string;
    senderId: string;
    body: string | null;
    createdAt: Date;
};

type Conversation = {
    id: string;
    createdAt: Date;
    participants: { userId: string }[];
    messages: MessageType[];
};

interface MessageProp {
    conversation: Conversation;
}

const MessageThread = ({ conversation }: MessageProp) => {
    const [message, setMessage] = useState('');
    const { user } = useUser();
    const [optimisticMessages, addOptimisticMessage] = useOptimistic(
        conversation.messages,
        (state, newMessage: MessageType) => [...state, newMessage],
    );

    if (!user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const messageBody = message.trim();
        if (!messageBody) return;

        addOptimisticMessage({
            id: 'temp-id-' + Date.now(), // temp id
            senderId: user.id,
            body: messageBody,
            createdAt: new Date(),
        });

        setMessage('');

        try {
            await sendMessageAction(conversation.id, messageBody);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <form
            className='flex flex-col h-full w-full p-2'
            onSubmit={handleSubmit}
        >
            <div className='flex-grow overflow-y-auto flex flex-col gap-4'>
                {optimisticMessages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                    >
                        <MessageBubble
                            message={msg.body}
                            createdAt={msg.createdAt}
                            isOwn={msg.senderId === user.id}
                        />
                    </div>
                ))}
            </div>

            <div className='bg-inputGray py-2 px-4 flex items-center w-full justify-between gap-4 rounded-full border-t border-borderGray'>
                <div className='flex items-center gap-4 flex-grow'>
                    <ImageIcon
                        width={20}
                        height={20}
                        className='cursor-pointer text-blue-400 hover:text-blue-300'
                        role='icon'
                        aria-label='image icon'
                    />
                    <ImageComponent
                        path='/icons/gif.svg'
                        alt='icon'
                        w={22}
                        h={22}
                        className='cursor-pointer'
                        tr={true}
                    />
                    <input
                        onChange={(e) => setMessage(e.target.value)}
                        id='message'
                        value={message}
                        name='message'
                        type='text'
                        placeholder='Start a new message'
                        className='bg-transparent text-white outline-none placeholder:text-textGray w-full'
                    />
                </div>
                <button type='submit' disabled={!message.trim()}>
                    <SendHorizonal
                        width={20}
                        height={20}
                        className='cursor-pointer text-blue-400 hover:text-blue-300'
                        role='button'
                        aria-label='image icon'
                    />
                </button>
            </div>
        </form>
    );
};

export default MessageThread;
