import { z } from "zod";

export const updateMilestoneSchema = z.object({
  status: z.enum(["UPCOMING", "IN_PROGRESS", "AWAITING_APPROVAL", "APPROVED", "DELIVERED"]),
});

export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;
