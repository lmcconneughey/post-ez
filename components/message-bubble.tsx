import React from 'react';
import { format } from 'timeago.js';

interface MessageBubbleProps {
    message: string | null;
    isOwn: boolean;
    createdAt: Date;
}

const MessageBubble = ({ message, isOwn, createdAt }: MessageBubbleProps) => {
    return (
        <div className='flex flex-col'>
            <div
                className={`px-4 py-2 m-2 rounded-lg max-w-xs ${
                    isOwn ? 'bg-iconBlue text-white' : 'bg-gray-700 text-white'
                }`}
            >
                {message}
            </div>
            <p className='text-textGray text-xs'>
                {format(createdAt)} {isOwn && 'from you'}
            </p>
        </div>
    );
};

export default MessageBubble;
