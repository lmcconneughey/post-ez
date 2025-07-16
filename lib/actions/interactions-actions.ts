'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '../../db/prisma';
import { commentZodSchema, postZodSchema } from '../validators';
import { revalidatePath } from 'next/cache';

// action to like a post
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

// action for repost
export const rePostAction = async (postId: string) => {
    const { userId } = await auth();

    if (!userId) throw new Error('User not authorised');

    try {
        const existingRepost = await prisma.post.findFirst({
            where: {
                userId,
                repostId: postId,
            },
        });

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
    }
};

// action for saved post
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

// add comment action
export const addCommentAction = async (
    prevState: { success: boolean; error: boolean },
    formData: FormData,
) => {
    const { userId } = await auth();

    if (!userId) return { success: false, error: true };

    const postId = formData.get('postId');
    const userName = formData.get('userName');
    const desc = formData.get('desc');

    const validatedFields = commentZodSchema.safeParse({
        parentPostId: postId,
        desc,
    });
    if (!validatedFields.success) {
        return { success: false, error: true };
    }

    try {
        await prisma.post.create({
            data: {
                ...validatedFields.data,
                userId,
            },
        });

        revalidatePath(`${userName}/status/${postId}`);

        return {
            success: true,
            error: false,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error: true,
        };
    }
};

// add post action
export const addPostAction = async ({
    desc,
    fileUrl,
    fileType,
    isSensitive,
    transformType,
    imgHeight,
    imgWidth,
}: {
    desc: string;
    fileUrl?: string;
    fileType?: string;
    isSensitive?: boolean;
    transformType?: 'origional' | 'wide' | 'square';
    imgHeight?: number | null;
    imgWidth?: number | null;
}) => {
    const { userId } = await auth();

    if (!userId) throw new Error('User not authorized');

    if (!fileUrl && !desc) throw new Error('Post must have content');

    const validatedFields = postZodSchema.safeParse({
        isSensitive,
        desc,
    });
    if (!validatedFields.success) {
        return { success: false, error: true };
    }

    try {
        await prisma.post.create({
            data: {
                userId,
                desc,
                ...(fileUrl && {
                    img: fileType?.startsWith('image/') ? fileUrl : null,
                    video: fileType?.startsWith('video/') ? fileUrl : null,
                    imgWidth: imgWidth,
                    imgHeight: imgHeight,
                    transformType: transformType,
                }),
                isSensitive: isSensitive ?? false,
            },
        });

        revalidatePath(`/`);
    } catch (error) {
        console.error('Failed to create post:', error);
        throw new Error('Post creation failed');
    }
};

export const followUserAction = async (targetUserId: string) => {
    const { userId } = await auth();

    if (!userId) throw new Error('User not authorised');

    try {
        // check if we are following target user
        const existingFollow = await prisma.follow.findFirst({
            where: {
                followerId: userId,
                followingId: targetUserId,
            },
        });

        // delete follow or add follow "toggle"
        if (existingFollow) {
            await prisma.follow.delete({
                where: { id: existingFollow.id },
            });
        } else {
            await prisma.follow.create({
                data: {
                    followerId: userId,
                    followingId: targetUserId,
                },
            });
        }
    } catch (error) {
        console.log(`Error liking post`, error);
        //return { success: false, message: 'Could not like post' };
    }
};
