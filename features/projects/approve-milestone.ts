// Milestone approval — PLAN.md §32.4. CLIENT only, own project, only if
// milestone.status = AWAITING_APPROVAL. Notifies the founder owner.
import { db } from "@/lib/db";
import { dispatchNotification } from "@/features/notifications/dispatch";

export class MilestoneNotApprovableError extends Error {}

export async function approveMilestone(projectId: string, milestoneId: string) {
  const milestone = await db.milestone.findFirst({ where: { id: milestoneId, projectId } });
  if (!milestone || milestone.status !== "AWAITING_APPROVAL") {
    throw new MilestoneNotApprovableError("This milestone is not awaiting approval.");
  }

  const updated = await db.milestone.update({
    where: { id: milestoneId },
    data: { status: "APPROVED", completedAt: new Date() },
  });

  const project = await db.project.findUnique({ where: { id: projectId } });
  if (project) {
    await dispatchNotification(project.founderOwnerId, "MILESTONE_APPROVED", {
      projectId,
      milestoneId,
      milestoneName: milestone.name,
    });
  }

  return updated;
}
