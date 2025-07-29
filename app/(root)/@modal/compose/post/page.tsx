'use server';

import ComposePost from './compose-post';
import { prisma } from '../../../../../db/prisma';
import { auth } from '@clerk/nextjs/server';

const Modal = async ({ params }: { params: { userProfileId?: string } }) => {
    const { userId: currentLoggedInUserId } = await auth();
    if (!currentLoggedInUserId) return null;

    const userData = await prisma.user.findFirst({
        where: { id: currentLoggedInUserId },
        select: {
            id: true,
            img: true,
        },
    });

    const userProfileIdFromRoute = params.userProfileId ?? null;

    return (
        <ComposePost
            userData={userData}
            userProfileId={userProfileIdFromRoute}
        />
    );
};

export default Modal;
