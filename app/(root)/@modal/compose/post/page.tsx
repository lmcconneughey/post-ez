'use client';

import { useRouter } from 'next/navigation';
import ImageComponent from '../../../../../components/image';
import {
    BarChart2,
    CalendarClock,
    ImageIcon,
    MapPin,
    Smile,
} from 'lucide-react';

const PostModal = () => {
    const router = useRouter();

    const closeModel = () => {
        router.back();
    };
    return (
        <div className='absolute w-screen h-screen top-0 left-0 z-20 bg-[#293139a6] flex justify-center'>
            {/* top section */}
            <div className='py-4 px-8 rounded-xl bg-black w-[600px] h-max mt-12'>
                {/* top */}
                <div className='flex items center justify-between'>
                    <div onClick={closeModel} className='cursor-pointer'>
                        x
                    </div>
                    <div className='text-iconBlue font-bold'>draft</div>
                </div>
                {/* container */}
                <div className='py-8 flex gap-4'>
                    <div className='relative w-10 h-10 rounded-full overflow-hidden'>
                        <ImageComponent
                            path='posts/profile.jpeg'
                            alt='test profile image'
                            w={100}
                            h={100}
                            tr={true}
                        />
                    </div>
                    <input
                        className='flex-1 bg-transparent outline-none text-lg'
                        type='text'
                        placeholder='What is happening'
                    />
                </div>
                {/* bottom */}
                <div className='flex items-center justify-between gap-4 flex-wrap border-t border-borderGray pt-4'>
                    <div className='flex flex-wrap gap-4'>
                        <ImageIcon
                            width={20} // Directly set width to 20px
                            height={20} // Directly set height to 20px
                            className='cursor-pointer text-blue-400 hover:text-blue-300' // Tailwind classes for styling
                            role='icon'
                            aria-label='image icon'
                        />
                        <ImageComponent
                            path='/icons/gif.svg'
                            alt='icon'
                            w={20}
                            h={20}
                            className='cursor-pointer'
                            tr={true}
                        />
                        <BarChart2
                            width={20}
                            height={20}
                            className='cursor-pointer text-blue-400 hover:text-blue-300'
                        />
                        <Smile
                            width={20}
                            height={20}
                            className='cursor-pointer text-blue-400 hover:text-blue-300'
                        />
                        <CalendarClock
                            width={20}
                            height={20}
                            className='cursor-pointer text-blue-400 hover:text-blue-300'
                        />
                        <MapPin
                            width={20}
                            height={20}
                            className='cursor-pointer text-blue-400 hover:text-blue-300'
                        />
                    </div>
                    <button className='rounded-full bg-white text-black py-2 px-4 font-bold'>
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostModal;
