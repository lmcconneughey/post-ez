'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '../../db/prisma';

export const likePostAction = async (postId: string) => {
    const { userId } = await auth();

    if (!userId) throw new Error('User not authorised');

    try {
        // check for existing Like
        const existingLike = await prisma.like.findFirst({
            where: {
                userId,
                postId,
            },
        });

        // delete like or add like "toggle"
        if (existingLike) {
            await prisma.like.delete({
                where: { id: existingLike.id },
            });
        } else {
            await prisma.like.create({
                data: {
                    userId,
                    postId,
                },
            });
        }
    } catch (error) {
        console.log(`Error liking post`, error);
        //return { success: false, message: 'Could not like post' };
    }
};
export const rePostAction = async (postId: string) => {
    const { userId } = await auth();

    if (!userId) throw new Error('User not authorised');

    try {
        // check for existing Like
        const existingRepost = await prisma.post.findFirst({
            where: {
                userId,
                repostId: postId,
            },
        });

        // delete like or add like "toggle"
        if (existingRepost) {
            await prisma.post.delete({
                where: { id: existingRepost.id },
            });
        } else {
            await prisma.post.create({
                data: {
                    userId,
                    repostId: postId,
                },
            });
        }
    } catch (error) {
        console.log(`Error rePosting`, error);
        //return { success: false, message: 'Could not like post' };
    }
};
export const savedPostAction = async (postId: string) => {
    const { userId } = await auth();

    if (!userId) throw new Error('User not authorised');

    try {
        // check for existing Like
        const existingSavedPost = await prisma.savedPost.findFirst({
            where: {
                userId,
                postId,
            },
        });

        // delete like or add like "toggle"
        if (existingSavedPost) {
            await prisma.savedPost.delete({
                where: { id: existingSavedPost.id },
            });
        } else {
            await prisma.savedPost.create({
                data: {
                    userId,
                    postId,
                },
            });
        }
    } catch (error) {
        console.log(`Error rePosting`, error);
        //return { success: false, message: 'Could not like post' };
    }
};
