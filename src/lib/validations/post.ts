/**
 * Post validation schemas
 */

import { z } from "zod";

export const createPostSchema = z.object({
  type: z.enum(["update", "announcement", "reminder"]),
  title: z
    .string()
    .max(100, "Title must be 100 characters or less")
    .optional()
    .or(z.literal("")),
  content: z
    .string()
    .min(1, "Content is required")
    .max(5000, "Content must be 5000 characters or less"),
  images: z.array(z.string().url("Invalid image URL")).max(10).optional(),
});

export const updatePostSchema = createPostSchema.partial();

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
export type UpdatePostFormValues = z.infer<typeof updatePostSchema>;
