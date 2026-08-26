// Project-scoped comments — PLAN.md §30.3, §32.5.
import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { addComment } from "@/features/projects/add-comment";
import { commentSchema } from "@/lib/validation/comment";
import { logError } from "@/lib/logger";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });

  const project = await db.project.findUnique({ where: { id: params.id }, select: { clientId: true } });
  if (!project) return NextResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });

  const isParticipant = session.user.role === "TEAM" || project.clientId === session.user.clientId;
  if (!isParticipant) return NextResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });

  const body = await req.json();
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", fields: parsed.error.flatten().fieldErrors } }, { status: 400 });
  }

  try {
    const comment = await addComment(params.id, session.user.id, parsed.data);
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    logError(error, { route: "POST /api/projects/[id]/comments" });
    return NextResponse.json({ error: { code: "INTERNAL" } }, { status: 500 });
  }
}
