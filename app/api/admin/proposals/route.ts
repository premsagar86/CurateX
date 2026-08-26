// Admin proposals — PLAN.md §30.3. TEAM only.
import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createProposal } from "@/features/proposals/create";
import { createProposalSchema } from "@/lib/validation/proposal";
import { logError } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session || session.user.role !== "TEAM") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createProposalSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", fields: parsed.error.flatten().fieldErrors } }, { status: 400 });
  }

  try {
    const proposal = await createProposal(parsed.data.leadId);
    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    logError(error, { route: "POST /api/admin/proposals" });
    return NextResponse.json({ error: { code: "INTERNAL" } }, { status: 500 });
  }
}
