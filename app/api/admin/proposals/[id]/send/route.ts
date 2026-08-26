// Send proposal — PLAN.md §30.3. TEAM only; triggers §37 email.
import { NextResponse } from "next/server";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  // TODO: features/proposals/send.ts
  return NextResponse.json({ error: { code: "INTERNAL", message: "Not yet implemented" } }, { status: 501 });
}
