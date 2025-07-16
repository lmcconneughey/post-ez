'use client';

import { useOptimistic, useState } from 'react';
import { followUserAction } from '../lib/actions/interactions-actions';

const FollowButton = ({
    userId,
    isFollowed,
}: {
    userId: string;
    isFollowed: boolean;
}) => {
    const [state, setState] = useState(isFollowed);

    const handleFollow = async () => {
        switchOptimisticFollow('');
        await followUserAction(userId);
        setState((prev) => !prev);
    };

    const [optimisticFollow, switchOptimisticFollow] = useOptimistic(
        state,
        (prev) => !prev,
    );

    return (
        <form action={handleFollow}>
            <button className='py-2 px-4 bg-white text-black font-bold rounded-full '>
                {optimisticFollow ? 'Unfollow' : 'Follow'}
            </button>
        </form>
    );
};

export default FollowButton;
