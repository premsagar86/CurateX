// PLAN.md §30.3 — GET (own project if CLIENT, any if TEAM), PATCH (TEAM only).
import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getProjectDetail } from "@/features/projects/get";
import { updateProject } from "@/features/projects/update";
import { updateProjectSchema } from "@/lib/validation/project";
import { logError } from "@/lib/logger";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });

  const project = await getProjectDetail(params.id);
  if (!project) return NextResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });

  const isOwner = session.user.role === "TEAM" || project.clientId === session.user.clientId;
  if (!isOwner) return NextResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });

  return NextResponse.json(project);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session || session.user.role !== "TEAM") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const body = await req.json();
  const parsed = updateProjectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", fields: parsed.error.flatten().fieldErrors } }, { status: 400 });
  }

  try {
    const project = await updateProject(params.id, parsed.data);
    return NextResponse.json(project);
  } catch (error) {
    logError(error, { route: "PATCH /api/projects/[id]" });
    return NextResponse.json({ error: { code: "INTERNAL" } }, { status: 500 });
  }
}
