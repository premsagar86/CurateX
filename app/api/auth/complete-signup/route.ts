// Completes an invite-gated signup — PLAN.md §20.13, §31.1. Validates the
// Verification token created by features/auth/create-invite.ts, creates the
// User+Account via Better Auth (so the password is hashed/stored correctly),
// then forces role=CLIENT and the invite's clientId (never trusts a
// client-supplied role/clientId), and burns the token (single-use).
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { logError } from "@/lib/logger";
import { signupSchema } from "@/lib/validation/signup";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = signupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", fields: parsed.error.flatten().fieldErrors } },
      { status: 400 }
    );
  }

  const { token, email, name, password } = parsed.data;

  const verification = await db.verification.findFirst({
    where: { identifier: email, value: token },
  });

  if (!verification || verification.expiresAt < new Date()) {
    return NextResponse.json(
      { error: { code: "INVALID_INVITE", message: "This invite link is invalid or has expired." } },
      { status: 400 }
    );
  }

  try {
    const signUpResponse = await auth.api.signUpEmail({
      body: { email, password, name },
      asResponse: true,
    });

    if (!signUpResponse.ok) {
      const detail = await signUpResponse.json().catch(() => null);
      return NextResponse.json(
        { error: { code: "SIGNUP_FAILED", message: detail?.message ?? "Could not create account." } },
        { status: 400 }
      );
    }

    const metadata = verification.metadata as { clientId?: string } | null;

    await db.user.update({
      where: { email },
      data: { role: "CLIENT", clientId: metadata?.clientId ?? null },
    });

    await db.verification.delete({ where: { id: verification.id } });

    const response = NextResponse.json({ ok: true }, { status: 201 });
    for (const cookie of signUpResponse.headers.getSetCookie()) {
      response.headers.append("Set-Cookie", cookie);
    }
    return response;
  } catch (error) {
    logError(error, { route: "POST /api/auth/complete-signup" });
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Something went wrong. Please try again." } },
      { status: 500 }
    );
  }
}
