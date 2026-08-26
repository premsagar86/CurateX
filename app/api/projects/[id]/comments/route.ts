// Project-scoped comments — PLAN.md §30.3, §32.5.
import { NextResponse } from "next/server";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  // TODO: features/projects/add-comment.ts
  return NextResponse.json({ error: { code: "INTERNAL", message: "Not yet implemented" } }, { status: 501 });
}
