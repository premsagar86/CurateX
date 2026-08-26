import { db } from "@/lib/db";
import type { UpdateContentPostInput } from "@/lib/validation/content-post";

export function updateContentPost(id: string, data: UpdateContentPostInput) {
  const { published, ...rest } = data;
  return db.contentPost.update({
    where: { id },
    data: {
      ...rest,
      ...(published !== undefined ? { publishedAt: published ? new Date() : null } : {}),
    },
  });
}
