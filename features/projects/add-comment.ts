// Project-scoped comment — PLAN.md §32.5, not a general chat.
import { db } from "@/lib/db";
import type { CommentInput } from "@/lib/validation/comment";

export function addComment(projectId: string, authorUserId: string, data: CommentInput) {
  return db.comment.create({
    data: { projectId, authorUserId, body: data.body, milestoneId: data.milestoneId },
    include: { author: true },
  });
}
