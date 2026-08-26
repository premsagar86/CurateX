// Client invite — PLAN.md §30.3, §31.1. TEAM only.
import { NextResponse } from "next/server";
import { createClientInvite } from "@/features/auth/create-invite";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { email } = await req.json();
  const invite = await createClientInvite(params.id, email);
  return NextResponse.json(invite, { status: 201 });
}
