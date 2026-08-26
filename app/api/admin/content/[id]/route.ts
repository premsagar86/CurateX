// Content CMS — edit/publish a single post. New route — needed for
// /admin/content/[id]'s edit + publish-toggle to be functional.
import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { updateContentPost } from "@/features/content/update";
import { updateContentPostSchema } from "@/lib/validation/content-post";
import { logError } from "@/lib/logger";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session || session.user.role !== "TEAM") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }
  const post = await db.contentPost.findUnique({ where: { id: params.id } });
  if (!post) return NextResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });
  return NextResponse.json(post);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session || session.user.role !== "TEAM") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const body = await req.json();
  const parsed = updateContentPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", fields: parsed.error.flatten().fieldErrors } }, { status: 400 });
  }

  try {
    const post = await updateContentPost(params.id, parsed.data);
    return NextResponse.json(post);
  } catch (error) {
    logError(error, { route: "PATCH /api/admin/content/[id]" });
    return NextResponse.json({ error: { code: "INTERNAL" } }, { status: 500 });
  }
}
