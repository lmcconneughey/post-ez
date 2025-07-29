'use server';

import ComposePostWrapper from '../compose-post-wrapper';
import { prisma } from '../../../../../db/prisma';
import { auth } from '@clerk/nextjs/server';

const Modal = async () => {
    const { userId } = await auth();
    if (!userId) return null;

    const userData = await prisma.user.findFirst({
        where: { id: userId },
        select: {
            id: true,
            img: true,
        },
    });
    if (!userData || !userData.img) return null;
    return <ComposePostWrapper userData={userData} />;
};

export default Modal;
