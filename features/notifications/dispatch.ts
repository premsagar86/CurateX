// Notification dispatch — in-app Notification row + email (PLAN.md §37).
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function dispatchNotification(
  userId: string,
  type: string,
  payload: Prisma.InputJsonValue
) {
  return db.notification.create({
    data: { userId, type, payload },
  });
  // TODO: send the matching email via a Resend/SMTP wrapper once transactional
  // email is wired up — deferred here since it isn't in the current site.md stack.
}
