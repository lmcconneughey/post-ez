'use client';

import { useUser } from '@clerk/nextjs';
import ImageComponent from './image';
import Post from './post';
import { Post as PrismaPost } from '@prisma/client';
import { useActionState } from 'react';
import { addComment } from '../lib/actions/interactions-actions';

type CommentWithDetails = PrismaPost & {
    user: {
        displayName: string | null;
        userName: string;
        img: string | null;
    };
    _count: {
        Like: number;
        reposts: number;
        comments: number;
    };
    Like: { id: string }[];
    reposts: { id: string }[];
    SavedPost: { id: string }[];
};

const Comments = ({
    comments,
    postId,
    userName,
}: {
    comments: CommentWithDetails[];
    postId: string;
    userName: string;
}) => {
    const { isLoaded, isSignedIn, user } = useUser();

    const [state, formAction, isPending] = useActionState(addComment, {
        success: false,
        error: false,
    });

    return (
        <div className=''>
            {user && (
                <form
                    action={formAction}
                    className='flex items-center justify-between gap-4 p-4'
                >
                    <div className='relative w-10 h-10 rounded-full overflow-hidden'>
                        <ImageComponent
                            path={user?.imageUrl}
                            alt='test avatar'
                            w={100}
                            h={100}
                            tr={true}
                        />
                    </div>
                    <input
                        type='string'
                        name='postId'
                        hidden
                        readOnly
                        value={postId}
                    />
                    <input
                        type='string'
                        name='username'
                        hidden
                        readOnly
                        value={userName}
                    />
                    <input
                        type='text'
                        name='desc'
                        className='flex-1 bg-transparent outline-none p-2 text-xl'
                        placeholder='Post your reply'
                    />
                    <button
                        disabled={isPending}
                        className='py-2 px-4 text-black bg-white rounded-full font-bold disabled:cursor-not-allowed disabled:bg-slate-200'
                    >
                        {isPending ? 'Replying...' : 'Reply'}
                    </button>
                </form>
            )}
            {state.error && (
                <span className='text-red-300 p-4'>Something went wrong!</span>
            )}
            {comments.map((comment) => (
                <div key={comment.id}>
                    <Post post={comment} type='comment' />
                </div>
            ))}
        </div>
    );
};

export default Comments;
