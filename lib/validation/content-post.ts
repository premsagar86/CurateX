import { z } from "zod";

export const createContentPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, and hyphens only."),
  body: z.string().min(1),
  metaDescription: z.string().min(1).max(300),
});

export const updateContentPostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  body: z.string().min(1).optional(),
  metaDescription: z.string().min(1).max(300).optional(),
  published: z.boolean().optional(),
});

export type CreateContentPostInput = z.infer<typeof createContentPostSchema>;
export type UpdateContentPostInput = z.infer<typeof updateContentPostSchema>;
