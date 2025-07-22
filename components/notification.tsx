'use client';

import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { connectSocket } from '../lib/socket';

type NotificationType = {
    id: string;
    sendUsername: string;
    type: 'Like' | 'comment' | 'reposts' | 'follow';
    link: string;
};

const Notification = () => {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const socket = connectSocket();

        socket.on('getNotification', (data: NotificationType) => {
            setNotifications((prev) => [...prev, data]);
        });
        return () => {
            socket.off('getNotification', (data: NotificationType) => {
                setNotifications((prev) => [...prev, data]);
            });
        };
    }, []);
    return (
        <div className='relative'>
            <div
                className='p-2 rounded-full hover:bg-[#181818] flex items-center gap-4 cursor-pointer'
                onClick={() => setOpen((prev) => !prev)}
            >
                <Bell size={24} />
                <span className='hidden 2xl:inline'>Notifications</span>
            </div>
            {open && (
                <div className='absolute -right-full p-4 rounded-lg bg-white text-black flex flex-col gap-4 w-max'>
                    <h1 className='text-xl text-textGray'>Notifications</h1>
                    {notifications.map((n) => (
                        <div className='cursor-pointer' key={n.id}>
                            <b>{n.sendUsername}</b>{' '}
                            {n.type === 'Like'
                                ? 'liked your post'
                                : n.type === 'reposts'
                                  ? 're-posted your post'
                                  : n.type === 'comment'
                                    ? 'replied to your post'
                                    : 'followed you'}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notification;
