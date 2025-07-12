import { auth } from '@clerk/nextjs/server';
import { prisma } from '../../../db/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userProfileId = searchParams.get('user');
    const page = Number(searchParams.get('cursor') || '1'); // fallback
    const LIMIT = 3;

    const { userId } = await auth();

    if (!userId) {
        console.log('Feed: No userId found (user not authenticated).');
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
        });
    }

    const isProfileFeed =
        userProfileId &&
        userProfileId !== 'undefined' &&
        userProfileId !== 'null';
    const whereCondition = isProfileFeed
        ? { parentPostId: null, userId: userProfileId }
        : {
              parentPostId: null,
              userId: {
                  in: [
                      userId,
                      ...(
                          await prisma.follow.findMany({
                              where: { followerId: userId },
                              select: { followingId: true },
                          })
                      ).map((f) => f.followingId),
                  ],
              },
          };
    try {
        const posts = await prisma.post.findMany({
            where: whereCondition,
            include: {
                user: {
                    select: {
                        displayName: true,
                        userName: true,
                        img: true,
                    },
                },
                repost: {
                    include: {
                        user: {
                            select: {
                                displayName: true,
                                userName: true,
                                img: true,
                            },
                        },
                    },
                },
            },
            take: LIMIT,
            skip: (Number(page) - 1) * LIMIT,
        });

        const totalPosts = await prisma.post.count({
            where: whereCondition,
        });

        const hasMore = Number(page) * LIMIT < totalPosts;

        await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds before infinite scroll update

        return Response.json({ posts, hasMore });
    } catch (error) {
        console.error('Error fetching posts: ', error);
        return new Response(
            JSON.stringify({ error: ' Failed to fetch posts' }),
            {
                status: 500,
            },
        );
    }
}
