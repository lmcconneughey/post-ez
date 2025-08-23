import { ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import Post from '../../../../../components/post';
import Comments from '../../../../../components/comments';
import { prisma } from '../../../../../db/prisma';
import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';

interface StatusPageProps {
    params: {
        username: string;
        postid: string; // match folder name
    };
}

export default async function StatusPage({
    params: { username, postid },
}: StatusPageProps) {
    const { userId } = await auth();
    if (!userId) return null;

    console.log('Status:', username, postid);

    const post = await prisma.post.findFirst({
        where: {
            id: postid,
            user: { userName: username },
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
                orderBy: { createdAt: 'desc' },
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
                userName={post.user.userName}
            />
        </div>
    );
}
