import Link from 'next/link';
import ImageComponent from './image';
import { prisma } from '../db/prisma';
import { auth } from '@clerk/nextjs/server';
import FollowButton from './follow-button';

const Recommendations = async () => {
    // authenticated user
    const { userId } = await auth();

    if (!userId) return;

    const followingId = await prisma.follow.findMany({
        where: {
            followerId: userId,
        },
        select: {
            followingId: true,
        },
    });

    const followedUserIds = followingId.map((x) => x.followingId); // user Ids we're following
    // Recommend users that the current user is not already following,
    // but who are followed by the people the user is already following aka
    // friend of friends
    const friendRecommendations = await prisma.user.findMany({
        where: {
            id: {
                not: userId,
                notIn: followedUserIds,
            },
            following: {
                some: {
                    followerId: {
                        in: followedUserIds,
                    },
                },
            },
        },
        take: 3,
        select: {
            id: true,
            displayName: true,
            userName: true,
            img: true,
        },
    });

    const followStatuses = await prisma.follow
        .findMany({
            where: {
                followerId: userId,
                followingId: {
                    in: friendRecommendations.map((rec) => rec.id),
                },
            },
            select: {
                followingId: true,
            },
        })
        .then((statuses) => statuses.map((s) => s.followingId));

    return (
        <div className='p-4 rounded-2xl border-[1px] border-borderGray flex flex-col gap-4'>
            {friendRecommendations.map((profile) => (
                <div
                    className='flex items-center justify-between cursor-pointer'
                    key={profile.id}
                >
                    <Link href={`/${profile.userName}`}>
                        <div className='flex items-center gap-2'>
                            <div className='relative rounded-full overflow-hidden w-10 h-10'>
                                <ImageComponent
                                    path={
                                        profile.img ||
                                        'posts/blank-profile-picture-973460_640.png'
                                    }
                                    alt={profile.userName || 'profile pic'}
                                    w={100}
                                    h={100}
                                    tr={true}
                                />
                            </div>
                            <div className=''>
                                <h1 className='text-md font-bold'>
                                    {profile.displayName || profile.userName}
                                </h1>
                                <span className='text-textGray text-sm'>
                                    @{profile.userName}
                                </span>
                            </div>
                        </div>
                    </Link>
                    {/* button */}

                    <FollowButton
                        userId={profile.id}
                        isFollowed={followStatuses.includes(profile.id)}
                    />
                </div>
            ))}

            <Link className='text-iconBlue' href='/'>
                Show More
            </Link>
        </div>
    );
};

export default Recommendations;
