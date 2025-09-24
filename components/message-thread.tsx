'use client';

import MessageBubble from './message-bubble';
import ImageComponent from './image';
import { ImageIcon, SendHorizonal } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useState, useOptimistic } from 'react';
import { sendMessageAction } from '../lib/actions/interactions-actions';

type Conversation = {
    id: string;
    createdAt: Date;
    participants: { userId: string }[];
    messages: { id: string; senderId: string; body: string | null }[];
};

interface MessageProp {
    conversation: Conversation;
}

const MessageThread = ({ conversation }: MessageProp) => {
    const [message, setMessage] = useState('');
    const { user } = useUser();
    //console.log('From message Thread: ', user?.id);
    if (!user) return;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // message will be sent to action => db
        await sendMessageAction(conversation.id, message);
    };

    return (
        <form className=' ' action={handleSubmit}>
            {conversation?.messages?.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                >
                    <MessageBubble
                        message={msg.body}
                        isOwn={msg.senderId === user.id}
                    />
                </div>
            ))}
            <div className='bg-inputGray  py-2 px-4 flex items-center w-full justify-between gap-4 rounded-full'>
                <div className='flex items-center gap-4 '>
                    <ImageIcon
                        width={20}
                        height={20}
                        className='cursor-pointer text-blue-400 hover:text-blue-300' // Tailwind classes for styling
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
                        name='message'
                        type='text'
                        placeholder='Start a new message'
                        className='bg-transparent text-white outline-none placeholder:text-textGray'
                    />
                </div>
                <button type='submit'>
                    <SendHorizonal
                        width={20} // Directly set width to 20px
                        height={20} // Directly set height to 20px
                        className='cursor-pointer text-blue-400 hover:text-blue-300' // Tailwind classes for styling
                        role='icon'
                        aria-label='image icon'
                    />
                </button>
            </div>
        </form>
    );
};

export default MessageThread;
