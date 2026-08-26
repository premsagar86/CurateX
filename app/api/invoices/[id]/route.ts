// Invoice detail — PLAN.md §30.3. CLIENT: own only; TEAM: any.
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  // TODO: features/invoices/get.ts
  return NextResponse.json({ error: { code: "INTERNAL", message: "Not yet implemented" } }, { status: 501 });
}
