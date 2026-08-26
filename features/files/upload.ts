// Project file upload — PLAN.md §36. Storage backend swaps behind
// lib/storage.ts (local disk Phase 1 -> R2 Phase 2) without this changing.
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { saveFile } from "@/lib/storage";

const MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25MB per-file limit

export class FileTooLargeError extends Error {}

export async function uploadProjectFile(
  projectId: string,
  uploadedByUserId: string,
  file: File,
  options: { milestoneId?: string; supersedesFileId?: string } = {}
) {
  if (file.size > MAX_SIZE_BYTES) {
    throw new FileTooLargeError(`File exceeds the ${MAX_SIZE_BYTES / 1024 / 1024}MB limit`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `${projectId}/${randomUUID()}-${file.name}`;
  const storageKey = await saveFile(buffer, key);

  let version = 1;
  if (options.supersedesFileId) {
    const previous = await db.file.findUnique({ where: { id: options.supersedesFileId } });
    version = (previous?.version ?? 0) + 1;
  }

  return db.file.create({
    data: {
      projectId,
      milestoneId: options.milestoneId,
      uploadedByUserId,
      name: file.name,
      storageKey,
      size: file.size,
      mimeType: file.type || "application/octet-stream",
      version,
      supersedesFileId: options.supersedesFileId,
    },
  });
}
