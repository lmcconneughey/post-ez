import Link from 'next/link';
//import { imagekit } from '../utils';
import ImageComponent from './image';
import PostInfo from './post-info';
import PostInteractions from './post-interactions';
import { Post as PrismaPost } from '@prisma/client';
import { format } from 'timeago.js';

//import Video from './video';
type PostDetails = PrismaPost & {
    user: {
        displayName: string | null;
        userName: string;
        img: string | null;
    };
    rePost?: PrismaPost & {
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
        Like: {
            id: string;
        }[];
        reposts: {
            id: string;
        }[];
        SavedPost: {
            id: string;
        }[];
    };
    _count: {
        Like: number;
        reposts: number;
        comments: number;
    };
    Like: {
        id: string;
    }[];
    reposts: {
        id: string;
    }[];
    SavedPost: {
        id: string;
    }[];
};

const Post = ({
    type,
    post,
}: {
    type?: 'status' | 'comment';
    post: PostDetails;
}) => {
    const origionalPost = post.rePost || post;
    return (
        <div className='p-4 border y-[1px] border-borderGray'>
            {/* post type */}
            {post.repostId && (
                <div className='flex items-center gap-2 text-sm text-textGray mb-2 font-bold'>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='18'
                        height='18'
                        viewBox='0 0 24 24'
                    >
                        <path
                            fill='#71767b'
                            d='M4.75 3.79l4.603 4.3-1.706 1.82L6 8.38v7.37c0 .97.784 1.75 1.75 1.75H13V20H7.75c-2.347 0-4.25-1.9-4.25-4.25V8.38L1.853 9.91.147 8.09l4.603-4.3zm11.5 2.71H11V4h5.25c2.347 0 4.25 1.9 4.25 4.25v7.37l1.647-1.53 1.706 1.82-4.603 4.3-4.603-4.3 1.706-1.82L18 15.62V8.25c0-.97-.784-1.75-1.75-1.75z'
                        />
                    </svg>
                    {<span>{post.user.displayName} reposted</span>}
                </div>
            )}
            {/* post content */}
            {/* <div className='flex gap-4'> */}
            <div className={`flex gap-4 ${type === 'status' && 'flex-col'}`}>
                {/* avatar */}

                <div
                    className={`${type === 'status' && 'hidden'} relative w-10 h-10 rounded-full overflow-x-hidden`}
                >
                    <ImageComponent
                        path={
                            origionalPost.user.img ||
                            'posts/Portriat_Photography_Composition_Tips_FgwkiG9uc.jpg'
                        }
                        alt=''
                        w={100}
                        h={100}
                        tr={true}
                    />
                </div>

                {/* content */}
                <div className='flex-1 flex flex-col space-y-2'>
                    {/* top */}
                    <div className='w-full flex justify-between'>
                        <Link
                            href={`/${origionalPost.user.userName}`}
                            className='flex gap-4'
                        >
                            <div
                                className={`${type !== 'status' && 'hidden'} relative w-10 h-10 rounded-full overflow-x-hidden`}
                            >
                                <ImageComponent
                                    path={
                                        origionalPost.user.img ||
                                        'posts/Portriat_Photography_Composition_Tips_FgwkiG9uc.jpg'
                                    }
                                    alt=''
                                    w={100}
                                    h={100}
                                    tr={true}
                                />
                            </div>

                            <div
                                className={`flex items-center gap-2 flex-wrap ${type === 'status' && 'flex-col gap-0 !items-start'}`}
                            >
                                <h1 className='text-md font-bold'>
                                    {origionalPost.user.displayName}
                                </h1>
                                <span
                                    className={`text-textGray ${type === 'status' && 'text-sm'}`}
                                >
                                    @{origionalPost.user.userName}
                                </span>
                                {type !== 'status' && (
                                    <span className='text-textGray'>
                                        {format(origionalPost.createdAt)}
                                    </span>
                                )}
                            </div>
                        </Link>
                        <PostInfo />
                    </div>
                    {/* text and media */}
                    <Link
                        href={`/${origionalPost.user.userName}/status/${origionalPost.id}`}
                    >
                        <p className={`${type == 'status' && 'text-lg'}`}>
                            {origionalPost.desc}
                        </p>
                    </Link>
                    {origionalPost.img && (
                        <ImageComponent
                            path={origionalPost.img}
                            alt='post image'
                            w={600}
                            h={600}
                            tr={true}
                        />
                    )}
                    {type === 'status' && (
                        <span className='text-textGray'>
                            2:34 PM Jul 2, 2025
                        </span>
                    )}
                    <PostInteractions
                        postId={origionalPost.id}
                        count={origionalPost._count}
                        isLiked={!!origionalPost.Like.length}
                        isReposted={!!origionalPost.reposts.length}
                        isSaved={!!origionalPost.SavedPost.length}
                    />
                </div>
            </div>
        </div>
    );
};

export default Post;
