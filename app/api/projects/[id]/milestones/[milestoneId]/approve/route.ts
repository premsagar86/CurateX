// Milestone approval — PLAN.md §30.3, §32.4. CLIENT only, own project,
// only if milestone.status = AWAITING_APPROVAL.
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: { id: string; milestoneId: string } }
) {
  // TODO: features/projects/approve-milestone.ts -> state-machine.ts transition + notification
  return NextResponse.json({ error: { code: "INTERNAL", message: "Not yet implemented" } }, { status: 501 });
}
