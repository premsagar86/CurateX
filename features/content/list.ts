import { db } from "@/lib/db";

export function listContentPosts() {
  return db.contentPost.findMany({ include: { author: true }, orderBy: { createdAt: "desc" } });
}
