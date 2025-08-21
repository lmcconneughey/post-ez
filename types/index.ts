import type { Post, User, Like, SavedPost } from '@prisma/client';

export type MinimalUser = Pick<User, 'displayName' | 'userName' | 'img'>;

export type PostCountSummary = {
    _count: {
        Like: number;
        reposts: number;
        comments: number;
    };
};

export interface AddPostInput {
    desc: string;
    fileUrl?: string;
    fileType?: string;
    isSensitive: boolean;
    imgHeight?: number;
    imgWidth?: number;
    transformType?: 'original' | 'wide' | 'square'; // Changed from `Type | null`
}

export interface PostWithRelations extends Post {
    user: User;
    Like: Like[];
    repost: Post | null;
    reposts: Post[];
    SavedPost: SavedPost[];
    _count: PostCountSummary['_count'];
}

export type AddPostResult =
    | { success: true; post: PostWithRelations }
    | { success: false; error: string };

export interface PostsPage {
    posts: PostWithRelations[];
    hasMore: boolean;
}

export type EditProfileFormState =
    | {
          errors: {
              name?: string[];
              bio?: string[];
              location?: string[];
              website?: string[];
              cover?: string[];
              img?: string[];
          };
          success?: undefined;
          message?: undefined;
      }
    | {
          errors: { _form: string };
          success?: undefined;
          message?: undefined;
      }
    | {
          success: true;
          message: string;
          errors?: undefined;
      };
