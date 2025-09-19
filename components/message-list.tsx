'use client';

import { format } from 'timeago.js';
import ImageComponent from './image';

type CurrentUserDataType = {
    userName: string;
    displayName: string | null;
    img: string | null;
    bio: string | null;
    createdAt: Date;
    followers: {
        id: string;
        createdAt: Date;
        followerId: string;
        followingId: string;
    }[];
} | null;
type Conversation = {
    id: string;
    createdAt: Date;
    participants: { userId: string }[];
    messages: { id: string; body: string | null }[];
};

interface MessageListProps {
    currentUserData: CurrentUserDataType;
    currentUserConversations: Conversation;
}

const MessageList = ({
    currentUserData,
    currentUserConversations,
}: MessageListProps) => {
    const lastMessage = currentUserConversations?.messages?.at(-1);

    return (
        <div className='flex flex-col w-full'>
            <div className='flex gap-4 items-center bg-borderGray border-r-2 border-iconBlue '>
                <div className='gap-4 mt-2 ml-2 mb-2'>
                    <ImageComponent
                        path={
                            currentUserData?.img ||
                            'posts/blank-profile-picture-973460_640.png'
                        }
                        alt='avatar image'
                        w={50}
                        h={50}
                        className='rounded-full'
                    />
                </div>
                <div className='flex-col'>
                    <div className='flex gap-2'>
                        <p className='font-bold'>
                            {currentUserData?.displayName || 'User'}
                        </p>
                        <p className='text-sm text-textGray'>
                            @{currentUserData?.userName}
                        </p>
                        <p className='text-sm text-textGray'>
                            {format(currentUserConversations?.createdAt)}
                        </p>
                    </div>
                    <div className='text-sm text-textGray'>
                        {lastMessage?.body
                            ? lastMessage.body.slice(0, 40) // add placeholder for photo/video
                            : 'No messages yet'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageList;
