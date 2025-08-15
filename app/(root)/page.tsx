import Feed from '../../components/feed';
import FeedSelector from '../../components/feed-selector';
import Share from '../../components/share';
import { Suspense } from 'react';
import { getCurrentUser } from '../../lib/get-current-user';
import { redirect } from 'next/navigation';

const Homepage = async ({
    searchParams,
}: {
    searchParams: Promise<{ feedType?: string }>;
}) => {
    const user = await getCurrentUser();
    const { feedType } = await searchParams;

    if (!user) {
        redirect('/sign-in');
    }

    const resolvedFeedType =
        feedType === 'for-you' || feedType === 'following'
            ? feedType
            : 'following';

    return (
        <div>
            <FeedSelector />
            <Share />
            <Suspense fallback={<div>Loading feed...</div>}>
                <Feed feedType={resolvedFeedType} />
            </Suspense>
        </div>
    );
};

export default Homepage;
