import { z } from 'zod';

export const commentZodSchema = z.object({
    parentPostId: z.string(),
    desc: z.string().max(155),
});

export const postZodSchema = z.object({
    desc: z.string().max(155),
    isSensitive: z.boolean().optional(),
});

export const editProfileZodSchema = z.object({
    name: z.string().max(50, 'Too long!').optional(),
    bio: z.string().max(160, 'Too long!').optional(),
    location: z.string().max(30, 'Too long!').optional(),
    website: z.url().optional(),
    cover: z.string().optional(),
    img: z.string().optional(),
});
