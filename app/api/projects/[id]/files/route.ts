// File upload — PLAN.md §30.3, §36. Per-file size limit enforced here.
import { NextResponse } from "next/server";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  // TODO: features/files/upload.ts -> lib/storage.ts (site.md §5.2 Phase 1 / §6.1 Phase 2)
  return NextResponse.json({ error: { code: "INTERNAL", message: "Not yet implemented" } }, { status: 501 });
}
