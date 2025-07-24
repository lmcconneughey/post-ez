'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { useState } from 'react';
import ImageComponent from './image';

export const SignOutButton = () => {
    const [open, setOpen] = useState(false);
    const { signOut } = useClerk();
    const { user } = useUser();

    return (
        <div
            onClick={() => setOpen((prev) => !prev)}
            className='flex items-center justify-between px-4 py-1 w-full rounded-full hover:bg-gray-100/10 transition-colors'
        >
            <div className='flex items-center gap-2'>
                <div className='w-10 h-10 relative rounded-full overflow-hidden'>
                    <ImageComponent
                        path='/general/profile.jpeg'
                        alt='profile-pic'
                        w={100}
                        h={100}
                    />
                </div>
                <div className='hidden 2xl:flex flex-col'>
                    <span className='font-semibold'>LarryDev</span>
                    <span className='text-sm text-textGray'>@LarryDev</span>
                </div>
            </div>
            <div className='reletive'></div>
            {open && (
                <div
                    onClick={() => signOut({ redirectUrl: '/' })}
                    className='absolute bottom-22 left-5 p-4 rounded-lg bg-black text-white flex items-center justify-center gap-4 w-max outline-1 outline-borderGray cursor-pointer'
                >
                    <button className='cursor-pointer'>
                        Log Out @{user?.username}
                    </button>
                </div>
            )}
            <div className='hidden 2xl:block cursor-pointer font-bold'>...</div>
        </div>
    );
};
