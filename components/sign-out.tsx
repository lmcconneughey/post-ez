'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { useState, useRef, useEffect } from 'react';
import ImageComponent from './image';

type UserData = {
    img: string | null;
    userName: string;
    displayName: string | null;
};

export const SignOutButton = ({ userData }: { userData: UserData }) => {
    const [open, setOpen] = useState(false);
    const { signOut } = useClerk();
    const { user } = useUser();
    const popupRef = useRef<HTMLDivElement>(null); // Ref for the popup
    const triggerRef = useRef<HTMLDivElement>(null); // Ref for the main div/ clickable trigger

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(e.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    return (
        <div
            ref={triggerRef}
            onClick={() => setOpen(!open)}
            className='flex items-center justify-between px-4 gap-4 py-2 w-full rounded-full hover:bg-gray-100/10 transition-colors'
        >
            <div className='flex items-center gap-2'>
                <div className='w-10 h-10 relative rounded-full overflow-hidden'>
                    <ImageComponent
                        path={
                            userData.img ||
                            'posts/blank-profile-picture-973460_640.png'
                        }
                        alt='profile-pic'
                        w={100}
                        h={100}
                    />
                </div>
                <div className='hidden 2xl:flex flex-col'>
                    <span className='font-semibold'>
                        {userData.displayName || 'current user for now'}
                    </span>
                    <span className='text-sm text-textGray'>
                        @{userData.userName}
                    </span>
                </div>
            </div>
            {open && (
                <div
                    ref={popupRef}
                    onClick={(e) => e.stopPropagation()}
                    className='absolute bottom-24 left-5 p-4 rounded-lg bg-black text-white flex items-center justify-center gap-4 w-max outline-1 outline-borderGray cursor-pointer'
                >
                    <button
                        onClick={() => signOut()}
                        className='cursor-pointer'
                    >
                        Log Out @{user?.username}
                    </button>
                </div>
            )}
            <div className='hidden 2xl:block cursor-pointer font-bold'>...</div>
        </div>
    );
};
