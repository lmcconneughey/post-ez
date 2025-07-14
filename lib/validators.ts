import { z } from 'zod';

export const commentZodSchema = z.object({
    parentPostId: z.string(),
    desc: z.string().max(155),
});

export const postZodSchema = z.object({
    desc: z.string().max(155),
    isSensitive: z.boolean().optional(),
});
