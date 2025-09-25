'use client';

import { MessageSquare, MoreHorizontal } from 'lucide-react';

import { useState } from 'react';
import ComposeMessage from './compose-message';
import ImageComponent from './image';
import { format } from 'timeago.js';
import Link from 'next/link';
type MessagesListProps = {
    conversations: {
        id: string;
        createdAt: Date;
        messages: { body: string | null }[];
        participants: {
            user: {
                id: string;
                userName: string;
                displayName: string | null;
                img: string | null;
            };
        }[];
    }[];
};

const Messages = ({ conversations }: MessagesListProps) => {
    const [modal, setModal] = useState(false);

    const handleModalOpen = () => {
        setModal(true);
    };
    const handleModalClose = () => {
        setModal(false);
    };

    return (
        <div className='flex'>
            <div className='sm:min-w-[600px]  flex flex-col gap-4 lg:min-w-[400px] border-r h-screen border-borderGray'>
                <div className='flex gap-4 m-4 justify-between flex-wrap'>
                    <div className=''>
                        <h1 className='text-xl font-bold text-textGraylight flex-wrap'>
                            Messages
                        </h1>
                    </div>
                    <div className='flex gap-4 items-center'>
                        <MoreHorizontal width={20} height={20} />
                        <MessageSquare width={20} height={20} />
                    </div>
                </div>
                {conversations ? (
                    <div className='flex flex-col w-full'>
                        {conversations.map((c) => (
                            <Link
                                href={`/messages/${c.id}`}
                                key={c.id}
                                className='flex gap-4 items-center bg-borderGray border-r-2 border-iconBlue '
                            >
                                <div className='gap-4 mt-2 ml-2 mb-2'>
                                    <ImageComponent
                                        path={
                                            c.participants[0]?.user?.img ||
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
                                        <p className='font-bold '>
                                            {c.participants[0]?.user
                                                .displayName ??
                                                c.participants[0]?.user
                                                    .userName}
                                        </p>
                                        <p className='text-sm text-textGray'>
                                            @{c.participants[0]?.user?.userName}
                                        </p>
                                        <p className='text-sm text-textGray'>
                                            {format(c.createdAt)}
                                        </p>
                                    </div>
                                    <p className='text-sm text-textGray'>
                                        {c.messages[0]?.body ??
                                            'No messages yet'}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className=' flex flex-col gap-4 items-center'>
                        <div className='w-[300px]'>
                            <h1 className='text-4xl mt-8 font-bold'>
                                Welcome to your inbox!
                            </h1>
                            <p className='text-sm mt-2 text-textGray'>
                                Drop a line, share posts and more with private
                                conversations between you and others on EZ.{' '}
                            </p>
                            <button className='py-3.5 px-10 mt-8 mr-auto bg-iconBlue text-white font-bold rounded-full items-start'>
                                write a message
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className='hidden lg:flex m-auto gap-4 items-center'>
                <div className='w-[400px]'>
                    <h1 className='text-4xl mt-8 font-bold'>
                        Select a message
                    </h1>
                    <p className='text-sm mt-2 text-textGray'>
                        Choose from your existing conversations, start a new
                        one, or just keep swimming.{' '}
                    </p>
                    <button
                        onClick={handleModalOpen}
                        className='inline-block py-3.5 px-10 mt-8 mr-auto bg-iconBlue text-white font-bold rounded-full'
                    >
                        Write a Message
                    </button>
                </div>
            </div>
            {modal && <ComposeMessage onClose={handleModalClose} />}
        </div>
    );
};

export default Messages;
