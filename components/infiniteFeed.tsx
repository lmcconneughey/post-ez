'use client';

import {
    InfiniteData,
    useInfiniteQuery,
    useQueryClient,
} from '@tanstack/react-query';
import {
    getFollowingFeedPostsAction,
    getUserProfilePostsAction,
    getForYouPostsAction,
} from '../lib/actions/interactions-actions';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from './post';
import { POSTS_PER_PAGE } from '../lib/constants';
import type { PostWithRelations, PostsPage } from '../types';
import React from 'react';

export const PostContext = React.createContext<{
    // eslint-disable-next-line no-unused-vars
    addPost: (post: PostWithRelations) => void;
} | null>(null);

interface InfiniteFeedProps {
    userProfileId?: string;
    initialPosts: PostWithRelations[];
    initialHasMore: boolean;
    userId: string;
    feedType?: 'for-you' | 'following';
}

const InfiniteFeed = ({
    userProfileId,
    initialPosts,
    initialHasMore,
    userId,
    feedType = 'following',
}: InfiniteFeedProps) => {
    const queryClient = useQueryClient();

    const queryKey = ['posts', feedType, userProfileId ?? null, userId ?? null];

    const addPost = (newPost: PostWithRelations) => {
        queryClient.setQueryData(
            queryKey,
            (oldData: InfiniteData<PostsPage> | undefined) => {
                if (!oldData) {
                    return {
                        pages: [{ posts: [newPost], hasMore: false }],
                        pageParams: [0],
                    };
                }

                const firstPagePosts = oldData.pages[0].posts;
                const newPostAlreadyExists = firstPagePosts.some(
                    (post) => post.id === newPost.id,
                );

                if (newPostAlreadyExists) {
                    console.warn(
                        'Attempted to add a duplicate post to the feed cache. Skipping.',
                    );
                    return oldData;
                }

                const newFirstPage = {
                    ...oldData.pages[0],
                    posts: [newPost, ...firstPagePosts],
                };

                return {
                    ...oldData,
                    pages: [newFirstPage, ...oldData.pages.slice(1)],
                };
            },
        );
    };

    const fetchPosts = async ({ pageParam = 0 }: { pageParam?: number }) => {
        let posts: PostWithRelations[] = [];
        const skip = pageParam * POSTS_PER_PAGE;
        const take = POSTS_PER_PAGE;

        if (userProfileId) {
            posts = await getUserProfilePostsAction(userProfileId, take, skip);
        } else if (feedType === 'for-you') {
            posts = await getForYouPostsAction(take, skip);
        } else if (feedType === 'following') {
            posts = await getFollowingFeedPostsAction(userId, take, skip);
        }

        return {
            posts: posts,
            hasMore: posts.length === POSTS_PER_PAGE,
        };
    };

    const { data, error, fetchNextPage, hasNextPage, fetchStatus } =
        useInfiniteQuery({
            queryKey: queryKey,
            queryFn: fetchPosts,
            initialPageParam: 0,
            getNextPageParam: (lastPage, allPages) => {
                return lastPage.hasMore ? allPages.length : undefined;
            },
            initialData: {
                pages: [{ posts: initialPosts, hasMore: initialHasMore }],
                pageParams: [0],
            },
        });

    const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

    if (fetchStatus === 'fetching' && allPosts.length === 0) {
        return (
            <p className='text-center text-gray-300 p-4'>Loading posts...</p>
        );
    }

    if (error) {
        return (
            <p className='text-center text-red-500 p-4'>
                Error: {error.message}
            </p>
        );
    }

    if (allPosts.length === 0) {
        return (
            <p className='text-center text-gray-300 p-4'>
                No posts to display.
            </p>
        );
    }

    return (
        <PostContext.Provider value={{ addPost }}>
            <InfiniteScroll
                dataLength={allPosts.length}
                next={() => fetchNextPage()}
                hasMore={!!hasNextPage}
                loader={
                    <h1 className='text-center text-gray-300 p-4'>
                        Loading more posts....
                    </h1>
                }
                endMessage={
                    <h1 className='text-center text-gray-300 p-4'>
                        All posts displayed!
                    </h1>
                }
                className='flex flex-col'
            >
                {allPosts.map((post) => (
                    <Post key={post.id} post={post} />
                ))}
            </InfiniteScroll>
        </PostContext.Provider>
    );
};

export default InfiniteFeed;
