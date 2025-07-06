import { auth } from '@clerk/nextjs/server';
import { prisma } from '../../../db/prisma';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userProfileId = searchParams.get('user');
    const page = searchParams.get('cursor');
    const LIMIT = 3;

    const { userId } = await auth();

    if (!userId) {
        console.log('Feed: No userId found (user not authenticated).');
        return null;
    }
    /**const whereCondition =
    userProfileId !== 'undefined' //doesn’t catch null, "null", or missing params
        ? { parentPostId: null, userId: userProfileId as string }
        : {
            parentPostId: null,
            userId: {
                in: [...],
            },
        }; */

    const isProfileFeed = userProfileId && userProfileId !== 'undefined';
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

    const posts = await prisma.post.findMany({
        where: whereCondition,
        take: LIMIT,
        skip: (Number(page) - 1) * LIMIT,
    });

    const totalPosts = await prisma.post.count({
        where: whereCondition,
    });

    const hasMore = Number(page) * LIMIT < totalPosts;
    return Response.json({ posts, hasMore });
}
