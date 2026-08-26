// Lead status update — TEAM only. New route (not part of the original stub
// inventory) — /admin/leads has no purpose without a way to change status.
import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { updateLeadStatus } from "@/features/leads/update-status";
import { leadStatusSchema } from "@/lib/validation/lead-status";
import { logError } from "@/lib/logger";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session || session.user.role !== "TEAM") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const body = await req.json();
  const parsed = leadStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", fields: parsed.error.flatten().fieldErrors } }, { status: 400 });
  }

  try {
    const lead = await updateLeadStatus(params.id, parsed.data.status);
    return NextResponse.json(lead);
  } catch (error) {
    logError(error, { route: "PATCH /api/admin/leads/[id]" });
    return NextResponse.json({ error: { code: "INTERNAL" } }, { status: 500 });
  }
}
