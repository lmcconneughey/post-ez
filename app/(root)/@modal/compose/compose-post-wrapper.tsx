'use client';

import { useSearchParams } from 'next/navigation';
import ComposePost from './post/compose-post';

export default function ComposePostWrapper({
    userData,
}: {
    userData: { img: string | null; id: string };
}) {
    const searchParams = useSearchParams();
    const userProfileId = searchParams.get('userProfileId');

    return <ComposePost userData={userData} userProfileId={userProfileId} />;
}
