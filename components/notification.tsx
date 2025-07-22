'use client';

import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { connectSocket } from '../lib/socket';
import { useRouter } from 'next/navigation';

type NotificationType = {
    id: string;
    senderUsername: string;
    type: 'Like' | 'comment' | 'reposts' | 'follow';
    link: string;
};

const Notification = () => {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const socket = connectSocket();

        const handleGetNotification = (data: NotificationType) => {
            setNotifications((prev) => [...prev, data]);
        };

        socket.on('getNotification', handleGetNotification);

        return () => {
            socket.off('getNotification', handleGetNotification);
        };
    }, []);
    const reset = () => {
        setNotifications([]);
        setOpen(false);
    };
    const handleClick = (notification: NotificationType) => {
        const filteredList = notifications.filter(
            (n) => n.id !== notification.id,
        );
        setNotifications(filteredList);
        setOpen(false);
        router.push(notification.link);
    };
    return (
        <div className='relative'>
            <div
                className='p-2 rounded-full hover:bg-[#181818] flex items-center gap-4 cursor-pointer'
                onClick={() => setOpen((prev) => !prev)}
            >
                <div className='relative'>
                    <Bell size={24} />
                    {notifications.length > 0 && (
                        <div className='absolute -top-4 -right-4 w-6 h-6 bg-iconBlue p-2 rounded-full flex items-center justify-center text-sm'>
                            {notifications.length}
                        </div>
                    )}
                </div>
                <span className='hidden 2xl:inline'>Notifications</span>
            </div>
            {open && (
                <div className='absolute -right-full p-4 rounded-lg bg-white text-black flex flex-col gap-4 w-max'>
                    <h1 className='text-xl text-textGray'>Notifications</h1>
                    {notifications.map((n) => (
                        <div
                            className='cursor-pointer'
                            key={n.id}
                            onClick={() => handleClick(n)}
                        >
                            <b>{n.senderUsername}</b>{' '}
                            {n.type === 'Like'
                                ? 'liked your post'
                                : n.type === 'reposts'
                                  ? 're-posted your post'
                                  : n.type === 'comment'
                                    ? 'replied to your post'
                                    : 'followed you'}
                        </div>
                    ))}
                    <button
                        className='bg-black text-white p-2 text-sm rounded-lg'
                        onClick={reset}
                    >
                        Mark as read
                    </button>
                </div>
            )}
        </div>
    );
};

export default Notification;
