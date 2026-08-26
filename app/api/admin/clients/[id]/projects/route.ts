// Admin-only project creation for a client — TEAM only. New route, needed
// since nothing else in the API surface creates a Project.
import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createProject } from "@/features/projects/create";
import { createProjectSchema } from "@/lib/validation/create-project";
import { logError } from "@/lib/logger";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session || session.user.role !== "TEAM") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", fields: parsed.error.flatten().fieldErrors } }, { status: 400 });
  }

  try {
    const project = await createProject(params.id, parsed.data);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    logError(error, { route: "POST /api/admin/clients/[id]/projects" });
    return NextResponse.json({ error: { code: "INTERNAL" } }, { status: 500 });
  }
}
