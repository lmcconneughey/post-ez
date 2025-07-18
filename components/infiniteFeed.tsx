'use client';

import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from './post';
import { POSTS_PER_PAGE } from '../lib/constants';
import type { PostWithRelations } from '../types/index';
import { useUser } from '@clerk/nextjs';

// api response for a single page
interface PostsPage {
    posts: PostWithRelations[];
    hasMore: boolean;
}
interface InfiniteFeedProps {
    userProfileId?: string; // if viewing specific profile
    initialPosts: PostWithRelations[];
    initialHasMore: boolean;
}

const InfiniteFeed = ({
    userProfileId,
    initialPosts,
    initialHasMore,
}: InfiniteFeedProps) => {
    const { user, isLoaded, isSignedIn } = useUser();
    const fetchPosts = async ({ pageParam = 0 }: { pageParam?: number }) => {
        const params = new URLSearchParams();
        params.set('take', POSTS_PER_PAGE.toString());
        params.set('skip', pageParam.toString());

        if (userProfileId) {
            params.set('userProfileId', userProfileId);
        } else if (isSignedIn && user?.id) {
            params.set('currentUserId', user.id); // add current user id for personal feed
        } else {
            return { posts: [], hasMore: false }; // no posts to fetch
        }

        const res = await fetch(`/api/posts?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch posts');

        const data: { posts: PostWithRelations[]; hasMore: boolean } =
            await res.json();

        return data; // strict
    };
    const {
        data,
        error,
        fetchStatus,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<
        PostsPage,
        Error,
        InfiniteData<PostsPage>,
        (string | null)[],
        number
    >({
        queryKey: ['posts', userProfileId ?? null, user?.id ?? null],
        queryFn: fetchPosts,
        initialPageParam: POSTS_PER_PAGE, // skip value for first client side fetch
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.hasMore) {
                return allPages.length * POSTS_PER_PAGE;
            }
            return undefined; // no more pages
        },
        initialData: {
            // initial data from server
            pages: [{ posts: initialPosts, hasMore: initialHasMore }],
            pageParams: [0],
        },

        // controle background refetch
        staleTime: 1000 * 60 * 5, // stay fresh for 5 min for faster UI
        gcTime: 1000 * 60 * 10, // garbage collected
    });
    const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

    if (!isLoaded) {
        return (
            <p className='text-center text-gray-300 p-4'>
                {' '}
                Loading user Authentication...
            </p>
        );
    }
    if (!isSignedIn && !userProfileId) {
        return (
            <p className='text-center text-gray-300 p-4'>
                {' '}
                Please sign in to view your feed...
            </p>
        );
    }
    if (error)
        return (
            <p className='text-center text-gray-300 p-4'>${error.message}</p>
        );
    if (fetchStatus === 'fetching' && allPosts.length === 0)
        return 'Loading...';

    return (
        <InfiniteScroll
            dataLength={allPosts.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={
                <h1 className='text-center text-gray-300 p-4'>
                    Loading more posts....
                </h1>
            }
            endMessage={
                <h1 className='text-center text-gray-300 p-4'>All posts</h1>
            }
            className='flex flex-col'
        >
            {allPosts.map((post) => (
                <Post key={post.id} post={post} />
            ))}
        </InfiniteScroll>
    );
};

export default InfiniteFeed;
