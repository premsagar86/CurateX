// Admin-only milestone status update. Client-side approval goes through the
// dedicated approve-milestone.ts flow instead — this is for TEAM moving a
// milestone through UPCOMING -> IN_PROGRESS -> AWAITING_APPROVAL, or
// recording DELIVERED after the client has approved.
import { db } from "@/lib/db";
import type { UpdateMilestoneInput } from "@/lib/validation/update-milestone";

export function updateMilestoneStatus(milestoneId: string, data: UpdateMilestoneInput) {
  return db.milestone.update({
    where: { id: milestoneId },
    data: { status: data.status, ...(data.status === "DELIVERED" ? { completedAt: new Date() } : {}) },
  });
}
