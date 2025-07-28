'use server';

import ComposePost from './compose-post';
import { prisma } from '../../../../../db/prisma';
import { auth } from '@clerk/nextjs/server';

interface ModalProps {
    params: {
        userProfileId?: string; // This name MUST match your folder name `[userProfileId]`
        // Or if your profile page uses [userId], then it would be userId?: string;
    };
}

const Modal = async ({ params }: ModalProps) => {
    const { userId: currentLoggedInUserId } = await auth(); // Get logged-in user ID from Clerk auth
    if (!currentLoggedInUserId) return null; // Or handle unauthorized access

    const userData = await prisma.user.findFirst({
        where: { id: currentLoggedInUserId },
        select: {
            id: true,
            img: true,
        },
    });

    // Extract userProfileId from params
    const userProfileIdFromRoute = params.userProfileId || null; // Ensure it's null if undefined

    return (
        <ComposePost
            userData={userData}
            userProfileId={userProfileIdFromRoute} // Pass the ID from the route params
        />
    );
};

export default Modal;
