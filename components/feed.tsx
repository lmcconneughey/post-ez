import { auth } from '@clerk/nextjs/server';
import { prisma } from '../db/prisma';
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
            user: true,
            repost: {
                include: {
                    user: true,
                    _count: {
                        select: {
                            Like: true,
                            reposts: true,
                            comments: true,
                        },
                    },
                    Like: true,
                    reposts: true,
                    SavedPost: true,
                },
            },
            _count: {
                select: {
                    Like: true,
                    reposts: true,
                    comments: true,
                },
            },
            Like: true,
            reposts: true,
            SavedPost: true,
        },
        take: POSTS_PER_PAGE,
        orderBy: { createdAt: 'desc' },
    });
    const initialHasMore = posts.length === POSTS_PER_PAGE;

    return (
        <div className=''>
            <InfiniteFeed
                userProfileId={userProfileId}
                initialPosts={posts}
                initialHasMore={initialHasMore}
                userId={userId}
            />
        </div>
    );
};

export default Feed;
