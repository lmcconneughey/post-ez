'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const FeedSelector = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // get current feed type
    const currentFeedType = searchParams.get('feedType') || 'following';

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            return params.toString();
        },
        [searchParams],
    );

    const handleFeedChange = (feedType: 'for-you' | 'following') => {
        router.push('/?' + createQueryString('feedType', feedType));
    };

    return (
        <div className='flex text-textGray font-bold border-b-[1px] border-borderGray'>
            <div
                onClick={() => handleFeedChange('for-you')}
                className=' cursor-pointer basis-1/2 flex justify-center pt-4 hover:bg-gray-100/10 transition-colors'
            >
                <button
                    className={`pb-3   ${
                        currentFeedType === 'for-you'
                            ? 'border-b-4 border-iconBlue'
                            : ''
                    }`}
                >
                    For You
                </button>
            </div>
            <div
                onClick={() => handleFeedChange('following')}
                className=' cursor-pointer basis-1/2 flex justify-center pt-4 hover:bg-gray-100/10 transition-colors'
            >
                <button
                    className={`pb-3 ${
                        currentFeedType === 'following'
                            ? 'border-b-4 border-iconBlue'
                            : ''
                    }`}
                >
                    Following
                </button>
            </div>
        </div>
    );
};

export default FeedSelector;
