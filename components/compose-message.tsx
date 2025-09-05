'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ComposeMessage = () => {
    const router = useRouter();
    return (
        <form className='fixed w-screen h-screen top-0 left-0 z-50 bg-[#293139a6] flex justify-center'>
            <div className='py-4 px-8 rounded-xl bg-black w-[600px] h-max mt-12'>
                <div className='flex items-center justify-between flex-wrap gap-4'>
                    <div className='flex gap-4 items-center flex-wrap'>
                        <div className='cursor-pointer text-white'>
                            <X />
                        </div>
                        <h2 className='text-lg font-bold text-white'>
                            New Message
                        </h2>
                    </div>
                    <button
                        type='submit'
                        className='rounded-full bg-white text-black py-2 px-4 font-bold flex'
                        disabled={''}
                    >
                        Next
                    </button>
                </div>

                {/* text fields */}
                <div className='flex flex-col p-2 mt-24 border rounded-sm border-textGray'>
                    <p className='text-textGray'>name</p>
                    <input
                        type='text'
                        name='search'
                        placeholder='Search peaple'
                        className='bg-transparent outline-none text-xl text-white'
                    />
                </div>
            </div>
        </form>
    );
};

export default ComposeMessage;
