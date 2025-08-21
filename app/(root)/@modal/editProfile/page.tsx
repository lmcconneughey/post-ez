import { auth } from '@clerk/nextjs/server';
import EditProfile from '../../../../components/editProfile';
import { prisma } from '../../../../db/prisma';

const EditModal = async () => {
    const { userId } = await auth();
    if (!userId) return;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            website: true,
            img: true,
            cover: true,
            bio: true,
            displayName: true,
            location: true,
        },
    });

    if (!user) return;

    return <EditProfile user={user} />;
};

export default EditModal;
