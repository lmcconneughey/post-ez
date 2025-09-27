'use client';

import MessageBubble from './message-bubble';
import ImageComponent from './image';
import { ImageIcon, SendHorizonal } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useState, useOptimistic, useEffect, useRef } from 'react';
import { sendMessageAction } from '../lib/actions/interactions-actions';
import { connectSocket } from '../lib/socket';
import { Socket } from 'socket.io-client';

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
// optimistic state action Type
type MessageAction =
    | { type: 'add'; payload: MessageType; tempId: string }
    | { type: 'replace'; payload: MessageType; tempId: string }
    | { type: 'receive'; payload: MessageType };

const MessageThread = ({ conversation }: MessageProp) => {
    const [message, setMessage] = useState('');
    const { user } = useUser();
    const [optimisticMessages, dispatch] = useOptimistic(
        conversation.messages,

        (state, action: MessageAction) => {
            if (action.type === 'add') {
                return [...state, action.payload];
            }
            if (action.type === 'replace') {
                return state.map((msg) =>
                    msg.id === action.tempId ? action.payload : msg,
                );
            }
            if (action.type === 'receive') {
                if (!state.some((msg) => msg.id === action.payload.id)) {
                    return [...state, action.payload];
                }
                return state;
            }
            return state;
        },
    );
    const [socket, setSocket] = useState<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to the bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const s = connectSocket();
        setSocket(s);

        s.on('receiveMessage', (msg: MessageType) => {
            dispatch({ type: 'receive', payload: msg });
        });

        s.emit('joinConversation', conversation.id);

        return () => {
            s.off('receiveMessage');
            s.disconnect();
        };
    }, [conversation.id, dispatch]);

    useEffect(() => {
        scrollToBottom();
    }, [optimisticMessages]);

    if (!user) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const messageBody = message.trim();
        if (!messageBody) return;

        const tempId = 'temp-id-' + Date.now();
        const tempMessage: MessageType = {
            id: tempId,
            senderId: user.id,
            body: messageBody,
            createdAt: new Date(),
        };

        dispatch({ type: 'add', payload: tempMessage, tempId: tempId });
        setMessage(''); // Clear input

        try {
            const saved = await sendMessageAction(conversation.id, messageBody);

            if (saved && socket) {
                console.log(
                    'Client: Successfully saved and broadcasting:',
                    saved.id,
                );
                dispatch({ type: 'replace', payload: saved, tempId: tempId });

                socket.emit('sendMessage', {
                    conversationId: conversation.id,
                    message: saved,
                });
            }
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
                {/* Scroll ref element*/}
                <div ref={messagesEndRef} />
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
