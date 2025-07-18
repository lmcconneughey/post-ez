import type { Post, User } from '@prisma/client';

export type MinimalUser = Pick<User, 'displayName' | 'userName' | 'img'>;

export type InteractionSummary = {
    Like: { id: string }[];
    reposts: { id: string }[];
    SavedPost: { id: string }[];
};

export type PostCountSummary = {
    _count: {
        Like: number;
        reposts: number;
        comments: number;
    };
};

export type RepostWithRelations = Post & {
    user: MinimalUser;
} & PostCountSummary &
    InteractionSummary;

export type PostWithRelations = Post & {
    user: MinimalUser;
    repost?: RepostWithRelations | null;
} & PostCountSummary &
    InteractionSummary;
