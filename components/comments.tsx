'use client';

import { useUser } from '@clerk/nextjs';
import ImageComponent from './image';
import Post from './post';
import { Post as PrismaPost } from '@prisma/client';
import { useActionState, useEffect } from 'react';
import { addCommentAction } from '../lib/actions/interactions-actions';
import { connectSocket } from '../lib/socket';

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
    const { user } = useUser();

    const [state, formAction, isPending] = useActionState(addCommentAction, {
        success: false,
        error: false,
    });
    useEffect(() => {
        if (state.success) {
            const socket = connectSocket();
            socket.emit('sendNotification', {
                receiverUsername: userName,
                data: {
                    senderUsername: user?.username,
                    type: 'comment',
                    link: `/${userName}/status/${postId}`,
                },
            });
        }
    }, [state.success, userName, user?.username, postId]);
    console.log(
        'comment useEffect dep info: ',
        state.success,
        userName,
        user?.username,
        postId,
    );

    return (
        <div className=''>
            {user && (
                <form
                    action={formAction}
                    className='flex items-center justify-between gap-4 p-4'
                >
                    <div className='relative w-10 h-10 rounded-full overflow-hidden -z-10'>
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
