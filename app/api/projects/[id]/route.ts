// PLAN.md §30.3 — GET (own project if CLIENT, any if TEAM), PATCH (TEAM only).
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  // TODO: features/projects/get.ts — resource-level auth per PLAN.md §31.8
  return NextResponse.json({ error: { code: "INTERNAL", message: "Not yet implemented" } }, { status: 501 });
}

export async function PATCH(_req: Request, { params }: { params: { id: string } }) {
  // TODO: features/projects/update.ts — TEAM only
  return NextResponse.json({ error: { code: "INTERNAL", message: "Not yet implemented" } }, { status: 501 });
}
