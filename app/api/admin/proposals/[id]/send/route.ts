// Send proposal — PLAN.md §30.3. TEAM only; triggers §37 email (deferred —
// no email transport is wired up yet, same as features/notifications/dispatch.ts).
import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { sendProposal, ProposalNotSendableError } from "@/features/proposals/send";
import { logError } from "@/lib/logger";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session || session.user.role !== "TEAM") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  try {
    const proposal = await sendProposal(params.id);
    return NextResponse.json(proposal);
  } catch (error) {
    if (error instanceof ProposalNotSendableError) {
      return NextResponse.json({ error: { code: "INVALID_STATE", message: error.message } }, { status: 400 });
    }
    logError(error, { route: "POST /api/admin/proposals/[id]/send" });
    return NextResponse.json({ error: { code: "INTERNAL" } }, { status: 500 });
  }
}
