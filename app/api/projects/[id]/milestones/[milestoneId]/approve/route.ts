// Milestone approval — PLAN.md §30.3, §32.4. CLIENT only, own project,
// only if milestone.status = AWAITING_APPROVAL.
import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { approveMilestone, MilestoneNotApprovableError } from "@/features/projects/approve-milestone";
import { logError } from "@/lib/logger";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string; milestoneId: string } }
) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });

  const project = await db.project.findUnique({ where: { id: params.id }, select: { clientId: true } });
  if (!project) return NextResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });

  if (project.clientId !== session.user.clientId) {
    return NextResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });
  }

  try {
    const milestone = await approveMilestone(params.id, params.milestoneId);
    return NextResponse.json(milestone);
  } catch (error) {
    if (error instanceof MilestoneNotApprovableError) {
      return NextResponse.json({ error: { code: "INVALID_STATE", message: error.message } }, { status: 400 });
    }
    logError(error, { route: "POST /api/projects/[id]/milestones/[milestoneId]/approve" });
    return NextResponse.json({ error: { code: "INTERNAL" } }, { status: 500 });
  }
}
