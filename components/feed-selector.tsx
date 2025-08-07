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
        <div className='px-4 pt-4 flex flex-wrap text-textGray font-bold border-b-[1px] border-borderGray'>
            <div className='basis-1/2 flex justify-center'>
                <button
                    onClick={() => handleFeedChange('for-you')}
                    className={`pb-3 cursor-pointer   ${
                        currentFeedType === 'for-you'
                            ? 'border-b-4 border-iconBlue'
                            : ''
                    }`}
                >
                    For You
                </button>
            </div>
            <div className='basis-1/2 flex justify-center'>
                <button
                    onClick={() => handleFeedChange('following')}
                    className={`pb-3 cursor-pointer ${
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
