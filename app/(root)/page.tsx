import Feed from '../../components/feed';
import FeedSelector from '../../components/feed-selector';
import Share from '../../components/share';
import { Suspense } from 'react';

const Homepage = async ({
    searchParams,
}: {
    searchParams: { feedType?: string };
}) => {
    // Explicitly await the searchParams object
    const resolvedSearchParams = await searchParams;
    const feedType =
        (resolvedSearchParams.feedType as 'for-you' | 'following') ||
        'following';

    return (
        <div className=''>
            <FeedSelector />
            <Share />
            <Suspense fallback={<div>Loading feed...</div>}>
                <Feed feedType={feedType} />
            </Suspense>
        </div>
    );
};

export default Homepage;
