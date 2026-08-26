// Admin proposals — PLAN.md §30.3. TEAM only.
import { NextResponse } from "next/server";

export async function POST(_req: Request) {
  // TODO: features/proposals/create.ts
  return NextResponse.json({ error: { code: "INTERNAL", message: "Not yet implemented" } }, { status: 501 });
}
