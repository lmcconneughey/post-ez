import { auth } from '@clerk/nextjs/server';
import { prisma } from '../../../db/prisma';
import { NextResponse } from 'next/server';
import { POSTS_PER_PAGE } from '../../../lib/constants';

export async function GET(request: Request) {
    const { userId: currentAuthUserId } = await auth();
    const searchParams = new URL(request.url).searchParams;
    console.log('post search parm: ' + searchParams);

    const take = parseInt(
        searchParams.get('take') || POSTS_PER_PAGE.toString(),
        10,
    ); // interpret the string as a decimal (base-10) number
    const skip = parseInt(searchParams.get('skip') || '0', 10);

    const userProfileId = searchParams.get('userProfileId');
    const currentUserIdFromClient = searchParams.get('currentUserId');

    if (!currentAuthUserId && !currentUserIdFromClient && !userProfileId) {
        console.log('No user found (user not authenticated).');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        let userIdsToFetch: string[] = [];

        if (userProfileId) {
            userIdsToFetch = [userProfileId];
        } else if (currentUserIdFromClient) {
            userIdsToFetch.push(currentUserIdFromClient);
            // fetch Id of users the current user follows
            const followedUsers = await prisma.follow.findMany({
                where: {
                    followerId: currentUserIdFromClient,
                },
                select: {
                    followingId: true,
                },
            });
            const followingIds = followedUsers.map(
                (follow) => follow.followingId,
            );
            userIdsToFetch.push(...followingIds);
            // make sure ids are unique
            userIdsToFetch = Array.from(new Set(userIdsToFetch));
        } else {
            // if we get here, you messed up
            return NextResponse.json([]);
        }

        const posts = await prisma.post.findMany({
            where: {
                parentPostId: null, // top level post
                userId: {
                    in: userIdsToFetch,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: take,
            skip: skip,
            include: {
                user: {
                    select: {
                        id: true,
                        userName: true,
                        displayName: true,
                        img: true,
                    },
                },
                repost: {
                    // if repost include
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                userName: true,
                                img: true,
                            },
                        },
                        _count: {
                            select: {
                                Like: true,
                                reposts: true,
                                comments: true,
                            },
                        },
                        Like: {
                            where: {
                                userId: currentAuthUserId ?? undefined,
                            },
                            select: {
                                id: true, // if the id exists, user already liked post
                            },
                        },
                        reposts: {
                            where: {
                                userId: currentAuthUserId ?? undefined,
                            },
                            select: {
                                id: true, // if the id exists, user already liked post
                            },
                        },
                        SavedPost: {
                            where: {
                                userId: currentAuthUserId ?? undefined,
                            },
                            select: {
                                id: true, // if the id exists, user already liked post
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        Like: true,
                        reposts: true,
                        comments: true,
                    },
                },
                Like: {
                    // check if current user liked post
                    where: {
                        userId: currentAuthUserId ?? undefined,
                    },
                    select: {
                        id: true,
                    },
                },
                reposts: {
                    where: {
                        userId: currentAuthUserId ?? undefined,
                    },
                    select: {
                        id: true, // if the id exists, user already liked post
                    },
                },
                SavedPost: {
                    where: {
                        userId: currentAuthUserId ?? undefined,
                    },
                    select: {
                        id: true, // if the id exists, user already liked post
                    },
                },
            },
        });

        const nextPosts = await prisma.post.count({
            where: {
                parentPostId: null,
                userId: {
                    in: userIdsToFetch,
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: take + 1,
            skip: skip + take,
        });

        const hasMore = nextPosts > take;

        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds before infinite scroll update

        return NextResponse.json({ posts, hasMore });
    } catch (error) {
        console.error('Error fetching posts: ', error);
        return NextResponse.json(
            { error: ' Failed to fetch posts' },
            {
                status: 500,
            },
        );
    }
}
