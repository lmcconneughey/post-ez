import { auth } from '@clerk/nextjs/server';
import { prisma } from '../db/prisma';

/**
 * fetch the current user from the database after a Clerk authentication.
 * handle the potential race condition by retrying the query.
 * then return The user object from the database, or null if not found after retries.
 */
export async function getCurrentUser() {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    // retry
    const maxRetries = 5;
    const retryDelay = 500;

    for (let i = 0; i < maxRetries; i++) {
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (user) {
            return user;
        }

        await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }

    // if all retries and still haven't found a user,
    return null;
}
