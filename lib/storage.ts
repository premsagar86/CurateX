// File storage — Phase 1: local disk (site.md §5.2). Swap this file's
// implementation for the Cloudflare R2 version (site.md §6.1) in Phase 2;
// callers (features/files/*) use the same two function signatures either way.
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Written under public/ so Next.js serves uploaded files directly at
// /uploads/<key> without a dedicated streaming route (Phase 1 only — R2
// serves via signed URLs instead in Phase 2, site.md §6.1).
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function saveFile(buffer: Buffer, key: string) {
  await mkdir(path.dirname(path.join(UPLOAD_DIR, key)), { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, key), buffer);
  return `/uploads/${key}`;
}

export async function getFileUrl(key: string) {
  return `/uploads/${key}`;
}
