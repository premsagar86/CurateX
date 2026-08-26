import { z } from "zod";

export const commentSchema = z.object({
  body: z.string().min(1).max(4000),
  milestoneId: z.string().optional(),
});

export type CommentInput = z.infer<typeof commentSchema>;
