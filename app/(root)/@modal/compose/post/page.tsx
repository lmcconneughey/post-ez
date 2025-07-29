'use server';

import ComposePost from './compose-post';
import { prisma } from '../../../../../db/prisma';
import { auth } from '@clerk/nextjs/server';

interface ModalProps {
    params: {
        userProfileId?: string;
    };
}

const Modal = async ({ params }: ModalProps) => {
    const { userId: currentLoggedInUserId } = await auth();
    if (!currentLoggedInUserId) return null;

    const userData = await prisma.user.findFirst({
        where: { id: currentLoggedInUserId },
        select: {
            id: true,
            img: true,
        },
    });

    const userProfileIdFromRoute = params.userProfileId || null; // Ensure it's null if undefined

    return (
        <ComposePost
            userData={userData}
            userProfileId={userProfileIdFromRoute}
        />
    );
};

export default Modal;
