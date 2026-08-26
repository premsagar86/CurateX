// Content CMS — PLAN.md §30.3. TEAM only.
import { NextResponse } from "next/server";

export async function GET() {
  // TODO: features/content/list.ts
  return NextResponse.json({ error: { code: "INTERNAL", message: "Not yet implemented" } }, { status: 501 });
}

export async function POST(_req: Request) {
  // TODO: features/content/create.ts
  return NextResponse.json({ error: { code: "INTERNAL", message: "Not yet implemented" } }, { status: 501 });
}
