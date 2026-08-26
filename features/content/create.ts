import { db } from "@/lib/db";
import type { CreateContentPostInput } from "@/lib/validation/content-post";

export function createContentPost(authorId: string, data: CreateContentPostInput) {
  return db.contentPost.create({ data: { authorId, ...data } });
}
