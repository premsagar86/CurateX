import { db } from "@/lib/db";
import type { CreateMilestoneInput } from "@/lib/validation/milestone";

export function createMilestone(projectId: string, data: CreateMilestoneInput) {
  return db.milestone.create({ data: { projectId, ...data } });
}
