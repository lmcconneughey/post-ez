import Link from 'next/link';
import ImageComponent from '../../../components/image';
import {
    ArrowLeftIcon,
    Calendar,
    CircleEllipsis,
    MailIcon,
    MapPin,
    Search,
} from 'lucide-react';
import Feed from '../../../components/feed';

const UserPage = () => {
    return (
        <div className=''>
            {/* profile title */}
            <div className='flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#000000 84]'>
                <Link href='/'>
                    <ArrowLeftIcon size={24} />
                </Link>
                <h1 className='font-bold text-lg'>Lawrence McConneughey</h1>
            </div>
            {/* info */}
            <div className=''>
                <div className='relative w-full'>
                    {/* cover */}
                    <div className='w-full aspct-[3/1] relative'>
                        <ImageComponent
                            path='posts/mountains-5819652_640.jpg'
                            alt='test iamge'
                            w={600}
                            h={200}
                            tr={true}
                        />
                    </div>

                    {/* avatar */}
                    <div className='w-1/6 aspect-square rounded-full overflow-hidden border-4 border-black bg-gray-300 absolute left-4 -translate-y-1/2'>
                        <ImageComponent
                            path='posts/man-4333898_640.jpg'
                            alt='avatar test iamge'
                            w={100}
                            h={100}
                            tr={true}
                        />
                    </div>
                </div>
                <div className='flex w-full items-center justify-end gap-2 p-2'>
                    <div className='w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer '>
                        <CircleEllipsis size={20} />
                    </div>
                    <div className='w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer '>
                        <Search size={20} />
                    </div>
                    <div className='w-9 h-9 flex items-center justify-center rounded-full border-[1px] border-gray-500 cursor-pointer '>
                        <MailIcon size={20} />
                    </div>
                    <button className='py-2 px-4 bg-white text-black font-bold rounded-full '>
                        Follow
                    </button>
                </div>
                {/* user info */}
                <div className='p-4 flex flex-col gap-2'>
                    <div className=''>
                        <h1 className='font-bold text-2xl'>John D</h1>
                        <span className='text-textGray text-sm'>@JohnD</span>
                    </div>
                    <p className=''>John D travel jazz bassist</p>
                    {/* job, loc, date */}
                    <div className='flex gap-4 text-textGray text-[15px]'>
                        <div className='flex items-center gap-2 '>
                            <MapPin size={20} />
                            <span>USA</span>
                        </div>
                        <div className='flex items-center gap-2 '>
                            <Calendar size={20} />
                            <span>Joined at date</span>
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <div className='flex items-center gap-2'>
                            <span className='font-bold'>100</span>
                            <span className='text-textGray text-[15px]'>
                                Followers
                            </span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='font-bold'>100</span>
                            <span className='text-textGray text-[15px]'>
                                Followings
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* feed */}
            <Feed />
        </div>
    );
};

export default UserPage;
