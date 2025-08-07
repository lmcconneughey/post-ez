import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { POSTS_PER_PAGE } from '../lib/constants';
import {
    getFollowingFeedPostsAction,
    getUserProfilePostsAction,
    getForYouPostsAction,
} from '../lib/actions/interactions-actions';
import InfiniteFeed from './infiniteFeed';

const Feed = async ({
    userProfileId,
    feedType,
}: {
    userProfileId?: string;
    feedType: 'for-you' | 'following';
}) => {
    const { userId } = await auth();

    // Check for mandatory authentication
    if (!userId) {
        console.log('Feed: No userId found. Redirecting to sign-in.');
        redirect('/sign-in');
    }

    let posts;
    const skip = 0;

    if (userProfileId) {
        posts = await getUserProfilePostsAction(
            userProfileId,
            POSTS_PER_PAGE,
            skip,
        );
    } else if (feedType === 'for-you') {
        posts = await getForYouPostsAction(POSTS_PER_PAGE, skip);
    } else {
        // feedType === 'following'

        posts = await getFollowingFeedPostsAction(userId, POSTS_PER_PAGE, skip);
    }

    const initialHasMore = posts.length === POSTS_PER_PAGE;

    return (
        <InfiniteFeed
            userProfileId={userProfileId}
            initialPosts={posts}
            initialHasMore={initialHasMore}
            userId={userId}
            feedType={feedType}
        />
    );
};

export default Feed;
