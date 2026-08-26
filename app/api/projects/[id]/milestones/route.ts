// Admin-only milestone creation — new route, needed for /admin/projects/[id]'s
// milestone management to be functional.
import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createMilestone } from "@/features/projects/create-milestone";
import { createMilestoneSchema } from "@/lib/validation/milestone";
import { logError } from "@/lib/logger";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session || session.user.role !== "TEAM") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createMilestoneSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", fields: parsed.error.flatten().fieldErrors } }, { status: 400 });
  }

  try {
    const milestone = await createMilestone(params.id, parsed.data);
    return NextResponse.json(milestone, { status: 201 });
  } catch (error) {
    logError(error, { route: "POST /api/projects/[id]/milestones" });
    return NextResponse.json({ error: { code: "INTERNAL" } }, { status: 500 });
  }
}
