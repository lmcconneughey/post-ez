'use server';

import { auth } from '@clerk/nextjs/server';
import { prisma } from '../../db/prisma';
import { commentZodSchema } from '../validators';
import { revalidatePath } from 'next/cache';
import { EditProfileFormState, PostWithRelations } from '../../types';

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
        const existingSavedPost = await prisma.savedPost.findFirst({
            where: {
                userId,
                postId,
            },
        });
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
interface AddPostInput {
    desc: string;
    fileUrl?: string;
    fileType?: string;
    isSensitive?: boolean;
    imgHeight?: number | null;
    imgWidth?: number | null;
    transformType?: 'original' | 'wide' | 'square';
}

type AddPostResult =
    | { success: true; post: PostWithRelations }
    | { success: false; error: string };
export const addPostAction = async ({
    desc,
    fileUrl,
    fileType,
    isSensitive,
    transformType,
    imgHeight,
    imgWidth,
}: AddPostInput): Promise<AddPostResult> => {
    const { userId } = await auth();

    if (!userId) throw new Error('User not authorized');
    try {
        const newPost = await prisma.post.create({
            data: {
                userId,
                desc,
                ...(fileUrl && {
                    img: fileType?.startsWith('image/') ? fileUrl : null,
                    video: fileType?.startsWith('video/') ? fileUrl : null,
                    imgWidth,
                    imgHeight,
                    transformType,
                }),
                isSensitive: isSensitive ?? false,
            },
            include: {
                user: true,
                Like: true,
                repost: true,
                SavedPost: true,
                reposts: true,
                _count: {
                    select: {
                        Like: true,
                        comments: true,
                        reposts: true,
                    },
                },
            },
        });

        return {
            success: true as const,
            post: newPost,
        };
    } catch (error) {
        console.error('Failed to create post:', error);
        return {
            success: false as const,
            error: 'Invalid post data',
        };
    }
};

export const followUserAction = async (targetUserId: string) => {
    const { userId } = await auth();

    if (!userId) throw new Error('User not authorised');

    try {
        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
            select: { userName: true },
        });

        if (!targetUser) {
            // Handle the case where the user doesn't exist
            throw new Error('Target user not found');
        }

        const username = targetUser.userName;
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
        revalidatePath(`/${username}`);
        revalidatePath(`/`);
    } catch (error) {
        console.log(`Error following post: `, error);
    }
};

// fetch posts for following feed
const postInclude = {
    user: true,
    Like: true,
    repost: {
        include: {
            user: true,
            _count: {
                select: {
                    Like: true,
                    reposts: true,
                    comments: true,
                },
            },
            Like: true,
            reposts: true,
            SavedPost: true,
        },
    },
    _count: {
        select: {
            Like: true,
            reposts: true,
            comments: true,
        },
    },
    reposts: true,
    SavedPost: true,
};

export const getFollowingFeedPostsAction = async (
    userId: string,
    take: number,
    skip: number,
) => {
    const followingIds = await prisma.follow.findMany({
        where: {
            followerId: userId,
        },
        select: {
            followingId: true,
        },
    });

    const ids = followingIds.map((f) => f.followingId);

    const userIds = [userId, ...ids];

    return prisma.post.findMany({
        where: {
            userId: {
                in: userIds,
            },
            parentPostId: null, // fetch top level
        },
        take: take,
        skip: skip,
        orderBy: { createdAt: 'desc' },
        include: postInclude,
    });
};

export const getUserProfilePostsAction = async (
    userProfileId: string,
    take: number,
    skip: number,
) => {
    return prisma.post.findMany({
        where: {
            userId: userProfileId,
            parentPostId: null,
        },
        take: take,
        skip: skip,
        orderBy: { createdAt: 'desc' },
        include: postInclude,
    });
};
export const getForYouPostsAction = async (take: number, skip: number) => {
    return prisma.post.findMany({
        where: {
            parentPostId: null,
        },
        take: take,
        skip: skip,
        orderBy: { createdAt: 'desc' },
        include: postInclude,
    });
};

export const editProfileAction = async (
    _prevState: EditProfileFormState | undefined,
    data: {
        name: string;
        bio: string;
        location: string;
        website: string;
        cover?: string;
        img?: string;
    },
): Promise<EditProfileFormState> => {
    const { userId } = await auth();
    if (!userId) {
        return { errors: { _form: 'You must be logged in' } };
    }
    const user = await prisma.user.findFirst({
        where: {
            id: userId,
        },
        select: {
            userName: true,
        },
    });

    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                displayName: data.name,
                bio: data.bio,
                location: data.location,
                website: data.website,
                cover: data.cover ?? null,
                img: data.img ?? null,
            },
        });
    } catch (err) {
        console.error('DB update failed:', err);
        return { errors: { _form: 'Failed to update profile' } };
    }

    revalidatePath(`/${user?.userName}`);
    return { success: true, message: 'Profile updated successfully!' };
};

export const searchPeopleAction = async (query: string) => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error('Unauthorized');
    }

    if (!query || query.trim() === '') {
        return [];
    }
    try {
        const users = await prisma.user.findMany({
            where: {
                id: { not: userId },
                OR: [
                    { userName: { contains: query, mode: 'insensitive' } },
                    { displayName: { contains: query, mode: 'insensitive' } },
                ],
            },
            select: {
                id: true,
                userName: true,
                displayName: true,
                img: true,
            },
            take: 10,
        });

        return users;
    } catch (error) {
        console.error('Error searching people:', error);
        throw new Error('Could not search people');
    }
};

export const createConversationAction = async (participantIds: string[]) => {
    try {
        if (!participantIds || participantIds.length < 2) {
            throw new Error(
                'A conversation must have at least two participants.',
            );
        }

        const sortedParticipantIds = [...participantIds].sort();

        const conversationExists = await prisma.conversation.findFirst({
            where: {
                AND: [
                    {
                        participants: {
                            every: {
                                userId: { in: sortedParticipantIds },
                            },
                        },
                    },

                    {
                        participants: {
                            every: {
                                userId: { in: sortedParticipantIds },
                            },
                        },
                    },
                ],
            },
        });

        if (conversationExists) {
            return conversationExists;
        }

        const newConversation = await prisma.conversation.create({
            data: {
                participants: {
                    create: sortedParticipantIds.map((id) => ({ userId: id })),
                },
            },
            include: {
                participants: true,
            },
        });

        return newConversation;
    } catch (error) {
        console.error('Conversation Error:', error);
        return null;
    }
};

export const fetchConversationAction = async (conversationId: string) => {
    try {
        if (!conversationId) {
            return;
        }
        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'desc',
                    },

                    take: 20,
                },
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                userName: true,
                                displayName: true,
                                img: true,
                            },
                        },
                    },
                },
            },
        });
        return conversation;
    } catch (error) {
        console.error('Error fetching conversation:', error);

        return null;
    }
};

export const sendMessageAction = async (
    conversationId: string,
    body: string,
) => {
    try {
        const { userId } = await auth();
        if (!userId) return;

        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
        });
        if (!conversation) {
            throw new Error('Conversation not found');
        }

        const newMessage = await prisma.message.create({
            data: {
                conversationId,
                senderId: userId,
                body,
            },
            select: {
                id: true,
                body: true,
                createdAt: true,
                senderId: true,
            },
        });
        revalidatePath('/messages/[conversationId]');
        return newMessage;
    } catch (error) {
        console.error('Failed to send message:', error);
    }
};

export const fetchConversationsAction = async (userId: string) => {
    try {
        const results = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: { userId },
                },
            },
            include: {
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                userName: true,
                                displayName: true,
                                img: true,
                            },
                        },
                    },
                },
            },
        });

        console.log('DEBUG: fetchConversationsAction results', results);
        return results;
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return [];
    }
};
