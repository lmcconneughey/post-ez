import Feed from '../../components/feed';
import FeedSelector from '../../components/feed-selector';
import Share from '../../components/share';
import { Suspense } from 'react';

const Homepage = async ({
    searchParams,
}: {
    searchParams: Promise<{ feedType?: string }>;
}) => {
    const { feedType } = await searchParams;

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
