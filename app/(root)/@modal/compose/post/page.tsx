'use server';

import ComposePost from './compose-post';
import { prisma } from '../../../../../db/prisma';
import { auth } from '@clerk/nextjs/server';

const Modal = async () => {
    const { userId } = await auth();
    if (!userId) return;
    const userData = await prisma.user.findFirst({
        where: { id: userId },
        select: {
            id: true,
            img: true,
        },
    });
    return <ComposePost userData={userData} />;
};

export default Modal;
