// Admin-only milestone status update — new route, needed since the only
// other status-changing endpoint (approve) is client-only and requires the
// milestone already be AWAITING_APPROVAL. TEAM needs to move it there first.
import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { updateMilestoneStatus } from "@/features/projects/update-milestone";
import { updateMilestoneSchema } from "@/lib/validation/update-milestone";
import { logError } from "@/lib/logger";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; milestoneId: string } }
) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session || session.user.role !== "TEAM") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const body = await req.json();
  const parsed = updateMilestoneSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", fields: parsed.error.flatten().fieldErrors } }, { status: 400 });
  }

  try {
    const milestone = await updateMilestoneStatus(params.milestoneId, parsed.data);
    return NextResponse.json(milestone);
  } catch (error) {
    logError(error, { route: "PATCH /api/projects/[id]/milestones/[milestoneId]" });
    return NextResponse.json({ error: { code: "INTERNAL" } }, { status: 500 });
  }
}
