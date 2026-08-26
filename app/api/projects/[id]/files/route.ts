// File upload — PLAN.md §30.3, §36. Per-file size limit enforced in
// features/files/upload.ts.
import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploadProjectFile, FileTooLargeError } from "@/features/files/upload";
import { logError } from "@/lib/logger";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });

  const project = await db.project.findUnique({ where: { id: params.id }, select: { clientId: true } });
  if (!project) return NextResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });

  const isParticipant = session.user.role === "TEAM" || project.clientId === session.user.clientId;
  if (!isParticipant) return NextResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: "No file provided." } }, { status: 400 });
  }

  const milestoneId = formData.get("milestoneId");
  const supersedesFileId = formData.get("supersedesFileId");

  try {
    const created = await uploadProjectFile(params.id, session.user.id, file, {
      milestoneId: typeof milestoneId === "string" && milestoneId ? milestoneId : undefined,
      supersedesFileId: typeof supersedesFileId === "string" && supersedesFileId ? supersedesFileId : undefined,
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof FileTooLargeError) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: error.message } }, { status: 400 });
    }
    logError(error, { route: "POST /api/projects/[id]/files" });
    return NextResponse.json({ error: { code: "INTERNAL" } }, { status: 500 });
  }
}
