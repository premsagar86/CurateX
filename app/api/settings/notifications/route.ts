// Client Portal — Settings — notification preferences — PLAN.md §20.19,
// §37.4. Takes effect immediately (Switch semantics, §16.1), no separate save step.
import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notificationPrefsSchema } from "@/lib/validation/settings";
import { logError } from "@/lib/logger";

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });

  const body = await req.json();
  const parsed = notificationPrefsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", fields: parsed.error.flatten().fieldErrors } }, { status: 400 });
  }

  try {
    const user = await db.user.update({
      where: { id: session.user.id },
      data: { notificationPrefs: parsed.data },
    });
    return NextResponse.json(user.notificationPrefs);
  } catch (error) {
    logError(error, { route: "PATCH /api/settings/notifications" });
    return NextResponse.json({ error: { code: "INTERNAL" } }, { status: 500 });
  }
}
