import { auth } from '@clerk/nextjs/server';
import { prisma } from '../db/prisma';
import Post from './post';
import { Post as PrismaPostType } from '@prisma/client';

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

    const posts = await prisma.post.findMany({ where: whereCondition });
    console.log(posts);

    return (
        <div className=''>
            {posts.map((post: PrismaPostType) => (
                <div key={post.id}>
                    <Post />
                </div>
            ))}
        </div>
    );
};

export default Feed;
