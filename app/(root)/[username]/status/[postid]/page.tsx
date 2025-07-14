import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import Post from '../../../../../components/post';
import Comments from '../../../../../components/comments';
import { prisma } from '../../../../../db/prisma';
import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';

const StatusPage = async ({
    params,
}: {
    params: Promise<{ username: string; postId: string }>;
}) => {
    const { userId } = await auth();

    if (!userId) return;

    const postId = (await params).postId;

    const post = await prisma.post.findFirst({
        where: {
            id: postId,
        },
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
                where: {
                    userId, // userId : current userId
                },
                select: {
                    id: true, // if the id exists, user already liked post
                },
            },
            reposts: {
                where: {
                    userId, // userId : current userId
                },
                select: {
                    id: true, // if the id exists, user already liked post
                },
            },
            SavedPost: {
                where: {
                    userId, // userId : current userId
                },
                select: {
                    id: true, // if the id exists, user already liked post
                },
            },
            comments: {
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
                        where: {
                            userId, // userId : current userId
                        },
                        select: {
                            id: true, // if the id exists, user already liked post
                        },
                    },
                    reposts: {
                        where: {
                            userId, // userId : current userId
                        },
                        select: {
                            id: true, // if the id exists, user already liked post
                        },
                    },
                    SavedPost: {
                        where: {
                            userId, // userId : current userId
                        },
                        select: {
                            id: true, // if the id exists, user already liked post
                        },
                    },
                },
            },
        },
    });

    if (!post) return notFound();
    return (
        <div className=''>
            <div className='flex items-center gap-8 sticky top-0 backdrop-blur-md p-4 z-10 bg-[#000000 84]'>
                <Link href='/'>
                    <ArrowLeftIcon size={24} />
                </Link>
                <h1 className='font-bold text-lg'>Post</h1>
            </div>
            <Post type='status' post={post} />
            <Comments
                comments={post.comments}
                postId={post.id}
                username={post.user.userName}
            />
        </div>
    );
};

export default StatusPage;
