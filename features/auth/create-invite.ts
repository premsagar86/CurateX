// Founder-initiated client invite — clients never self-register.
// PLAN.md §31.1, §18.4. Generates a signed, time-limited invite link (§37.2).
import { db } from "@/lib/db";

export async function createClientInvite(clientId: string, email: string) {
  // TODO: generate a signed, time-limited token and email it via
  // features/notifications/dispatch.ts (PLAN.md §31.1, §37.2). The invited
  // user completes account setup at /signup with role=CLIENT and this clientId.
  return { clientId, email, status: "invite_pending" as const };
}
