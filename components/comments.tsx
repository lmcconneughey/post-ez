import ImageComponent from './image';
import Post from './post';
import { Post as PrismaPost } from '@prisma/client';

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
    username,
}: {
    comments: CommentWithDetails[];
    postId: string;
    username: string;
}) => {
    return (
        <div className=''>
            <form className='flex items-center justify-between gap-4 p-4'>
                <div className='relative w-10 h-10 rounded-full overflow-hidden'>
                    <ImageComponent
                        path='posts/man-4333898_640.jpg'
                        alt='test avatar'
                        w={100}
                        h={100}
                        tr={true}
                    />
                </div>
                <input
                    type='text'
                    className='flex-1 bg-transparent outline-none p-2 text-xl'
                    placeholder='Post your reply'
                />
                <button className='py-2 px-4 text-black bg-white rounded-full font-bold'>
                    Reply
                </button>
            </form>
            {comments.map((comment) => (
                <div key={comment.id}>
                    <Post post={comment} type='comment' />
                </div>
            ))}
        </div>
    );
};

export default Comments;
