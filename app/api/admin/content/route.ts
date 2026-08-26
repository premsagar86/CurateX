// Content CMS — PLAN.md §30.3. TEAM only.
import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { listContentPosts } from "@/features/content/list";
import { createContentPost } from "@/features/content/create";
import { createContentPostSchema } from "@/lib/validation/content-post";
import { logError } from "@/lib/logger";

export async function GET() {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session || session.user.role !== "TEAM") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }
  return NextResponse.json(await listContentPosts());
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session || session.user.role !== "TEAM") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createContentPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", fields: parsed.error.flatten().fieldErrors } }, { status: 400 });
  }

  try {
    const post = await createContentPost(session.user.id, parsed.data);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    logError(error, { route: "POST /api/admin/content" });
    return NextResponse.json({ error: { code: "INTERNAL" } }, { status: 500 });
  }
}
