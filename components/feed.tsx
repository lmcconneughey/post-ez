import { auth } from '@clerk/nextjs/server';
import { prisma } from '../db/prisma';
import Post from './post';
import InfiniteFeed from './infiniteFeed';
import { POSTS_PER_PAGE } from '../lib/constants';

const Feed = async ({ userProfileId }: { userProfileId?: string }) => {
    const { userId } = await auth();

    if (!userId) {
        console.log('Feed: No userId found (user not authenticated).');
        return null;
    }

    const whereCondition = userProfileId
        ? { parentPostId: null, userId: userProfileId }
        : {
              parentPostId: null,
              userId: {
                  in: [
                      userId,
                      ...(
                          await prisma.follow.findMany({
                              where: {
                                  followerId: userId,
                              },
                              select: {
                                  followingId: true,
                              },
                          })
                      ).map(
                          (follow: { followingId: string }) =>
                              follow.followingId,
                      ),
                  ],
              },
          };

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
                    _count: {
                        select: {
                            Like: true,
                            reposts: true,
                            comments: true,
                        },
                    },
                    Like: {
                        where: { userId },
                        select: { id: true },
                    },
                    reposts: {
                        where: { userId },
                        select: { id: true },
                    },
                    SavedPost: {
                        where: { userId },
                        select: { id: true },
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
                where: { userId },
                select: { id: true },
            },
            reposts: {
                where: { userId },
                select: { id: true },
            },
            SavedPost: {
                where: { userId },
                select: { id: true },
            },
        },
        take: POSTS_PER_PAGE,
        orderBy: { createdAt: 'desc' },
    });
    const initialHasMore = posts.length === POSTS_PER_PAGE;

    return (
        // getting duplictae posts in feed. lets try to fix!!!
        // initPost = first page of posts to be rendered on the server
        // but reused on the client without duplicate fetches!
        <InfiniteFeed
            userProfileId={userProfileId}
            initialPosts={posts}
            initialHasMore={initialHasMore}
        />
    );
};

export default Feed;
