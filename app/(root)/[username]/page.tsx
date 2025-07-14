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
import { prisma } from '../../../db/prisma';
import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { format } from 'timeago.js';
import FollowButton from '../../../components/follow-button';

const UserPage = async ({
    params,
}: {
    params: Promise<{ username: string }>;
}) => {
    const { userId } = await auth();
    const user = await prisma.user.findUnique({
        where: {
            userName: (await params).username,
        },
        include: {
            _count: {
                select: {
                    followers: true,
                    following: true,
                },
            },
            following: {
                where: {
                    followerId: userId || undefined,
                },
            },
        },
    });
    if (!user) return notFound();

    return (
        <div className=''>
            {/* profile title */}
            <div className='flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#000000 84]'>
                <Link href='/'>
                    <ArrowLeftIcon size={24} />
                </Link>
                <h1 className='font-bold text-lg'>{user.displayName}</h1>
            </div>
            {/* info */}
            <div className=''>
                <div className='relative w-full'>
                    {/* cover */}
                    <div className='w-full aspct-[3/1] relative'>
                        <ImageComponent
                            path={
                                user.cover || 'posts/mountains-5819652_640.jpg'
                            }
                            alt='test iamge'
                            w={600}
                            h={200}
                            tr={true}
                        />
                    </div>

                    {/* avatar */}
                    <div className='w-1/6 aspect-square rounded-full overflow-hidden border-4 border-black bg-gray-300 absolute left-4 -translate-y-1/2'>
                        <ImageComponent
                            path={
                                user.img ||
                                'posts/blank-profile-picture-973460_640.png'
                            }
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
                    {userId && (
                        <FollowButton
                            userId={user.id}
                            isFollowed={!!user.following.length}
                        />
                    )}
                </div>
                {/* user info */}
                <div className='p-4 flex flex-col gap-2'>
                    <div className=''>
                        <h1 className='font-bold text-2xl'>
                            {user.displayName}
                        </h1>
                        <span className='text-textGray text-sm'>
                            @{user.userName}
                        </span>
                    </div>
                    {user.bio && <p className=''>{user.bio}</p>}
                    {/* job, loc, date */}
                    <div className='flex gap-4 text-textGray text-[15px]'>
                        {user.location && (
                            <div className='flex items-center gap-2 '>
                                <MapPin size={20} />
                                <span>{user.location}</span>
                            </div>
                        )}
                        <div className='flex items-center gap-2 '>
                            <Calendar size={20} />
                            <span>Joined {format(user.createdAt)}</span>
                        </div>
                    </div>
                    <div className='flex gap-4'>
                        <div className='flex items-center gap-2'>
                            <span className='font-bold'>
                                {user._count.followers}
                            </span>
                            <span className='text-textGray text-[15px]'>
                                Followers
                            </span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <span className='font-bold'>
                                {user._count.following}
                            </span>
                            <span className='text-textGray text-[15px]'>
                                Followings
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* feed */}
            <Feed userProfileId={user.id} />
        </div>
    );
};

export default UserPage;
