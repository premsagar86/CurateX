// Founder-initiated client invite — clients never self-register.
// PLAN.md §31.1, §18.4. Generates a signed, time-limited invite link (§37.2).
import { randomBytes } from "crypto";
import { db } from "@/lib/db";

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function createClientInvite(clientId: string, email: string) {
  const token = randomBytes(32).toString("hex");

  // Normalize to match Better Auth's lower-casing and the signup schema — the
  // complete-signup route matches this Verification row by identifier, and
  // PostgreSQL comparison is case-sensitive.
  const normalizedEmail = email.trim().toLowerCase();

  await db.verification.create({
    data: {
      identifier: normalizedEmail,
      value: token,
      expiresAt: new Date(Date.now() + INVITE_TTL_MS),
      metadata: { clientId },
    },
  });

  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/signup?token=${token}&email=${encodeURIComponent(normalizedEmail)}`;

  // No transactional email provider is wired up yet (features/notifications/dispatch.ts
  // has the same TODO) — log the link so it's visible in dev/server logs, and return it
  // so the admin UI can display/copy it directly until email sending exists.
  console.log(`[invite] ${normalizedEmail} -> ${inviteUrl}`);

  return { clientId, email: normalizedEmail, inviteUrl, status: "invite_pending" as const };
}
