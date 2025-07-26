'use client';

import {
    InfiniteData,
    useInfiniteQuery,
    useQueryClient,
} from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from './post';
import { POSTS_PER_PAGE } from '../lib/constants';
import type { PostWithRelations, PostsPage } from '../types';
import { useUser } from '@clerk/nextjs';
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
}

const InfiniteFeed = ({
    userProfileId,
    initialPosts,
    initialHasMore,
    userId, // Still available in props if needed elsewhere, but Clerk's user.id is used for queries
}: InfiniteFeedProps) => {
    const queryClient = useQueryClient();
    const { user, isLoaded, isSignedIn } = useUser();
    // The feed should only fetch if it's a profile feed (userProfileId) or if the user is signed in.
    const enableQuery = !!userProfileId || (isLoaded && isSignedIn);

    const fetchPosts = async ({ pageParam = 0 }: { pageParam?: number }) => {
        const params = new URLSearchParams();
        params.set('take', POSTS_PER_PAGE.toString());
        params.set('skip', pageParam.toString());
        if (userProfileId) {
            params.set('userProfileId', userProfileId);
        } else if (isSignedIn && user?.id) {
            // This ensures currentUserId is only set if user is signed in and has an ID
            params.set('currentUserId', user.id);
        } else {
            // good fallback for type safety and clarity.
            console.warn(
                'Attempted to fetch posts without valid userProfileId or signed-in user.',
            );
            return { posts: [], hasMore: false };
        }

        const res = await fetch(`/api/posts?${params.toString()}`);
        if (!res.ok) {
            const errorData = await res
                .json()
                .catch(() => ({ message: 'Unknown error' }));
            throw new Error(
                `Failed to fetch posts: ${errorData.message || res.statusText}`,
            );
        }
        const data: PostsPage = await res.json();
        return data;
    };

    const { data, error, fetchStatus, hasNextPage, fetchNextPage } =
        useInfiniteQuery<
            PostsPage, // Type of each page
            Error, // Type of error
            InfiniteData<PostsPage>, // Type of the entire data structure
            (string | null)[], // Type of QueryKey (['posts', userProfileId, user?.id])
            number // Type of pageParam
        >({
            queryKey: ['posts', userProfileId ?? null, user?.id ?? null],
            queryFn: fetchPosts,
            initialPageParam: initialPosts.length, // Corrected
            getNextPageParam: (lastPage, allPages) => {
                if (lastPage.hasMore) {
                    // Calculate the `skip` value for the next fetch
                    return allPages.reduce(
                        (acc, page) => acc + page.posts.length,
                        0,
                    );
                }
                return undefined; // No more pages
            },
            initialData: {
                pages: [{ posts: initialPosts, hasMore: initialHasMore }],
                pageParams: [0], // The initial page was fetched with skip=0
            },
            // Control background refetch and ensure query is enabled when conditions are met
            staleTime: 1000 * 60 * 5, // stay fresh for 5 min for faster UI
            gcTime: 1000 * 60 * 10, // garbage collected
            enabled: enableQuery, //  if userProfileId exists or user is loaded and signed in
        });

    const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

    if (!isLoaded) {
        return (
            <p className='text-center text-gray-300 p-4'>
                Loading user authentication...
            </p>
        );
    }

    if (!enableQuery) {
        return (
            <p className='text-center text-gray-300 p-4'>
                Please sign in to view your feed or select a profile.
            </p>
        );
    }

    if (error) {
        return (
            <p className='text-center text-red-500 p-4'>
                Error: {error.message}
            </p>
        );
    }

    // only show loading if no posts have been fetched
    if (fetchStatus === 'fetching' && allPosts.length === 0) {
        return (
            <p className='text-center text-gray-300 p-4'>Loading posts...</p>
        );
    }

    // if no posts are available after all checks and fetches
    if (allPosts.length === 0) {
        return (
            <p className='text-center text-gray-300 p-4'>
                No posts to display.
            </p>
        );
    }

    return (
        <PostContext.Provider
            value={{
                addPost: (newPost: PostWithRelations) => {
                    queryClient.setQueryData(
                        ['posts', userProfileId ?? null, user?.id ?? null],
                        (oldData: InfiniteData<PostsPage> | undefined) => {
                            if (!oldData) {
                                return {
                                    pages: [
                                        { posts: [newPost], hasMore: false },
                                    ],
                                    pageParams: [0],
                                };
                            }

                            return {
                                ...oldData,
                                pages: [
                                    {
                                        posts: [
                                            newPost,
                                            ...oldData.pages[0].posts, // Prepend new post to the first page
                                        ],
                                        hasMore: oldData.pages[0].hasMore,
                                    },
                                    ...oldData.pages.slice(1), // Keep other pages as they are
                                ],
                            };
                        },
                    );
                },
            }}
        >
            <InfiniteScroll
                dataLength={allPosts.length}
                next={() => fetchNextPage()} // Call fetchNextPage directly
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
