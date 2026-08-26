// Shared Zod schema for admin project edits — PLAN.md §26.3. State
// transitions go through the dedicated state-machine endpoint, not this one.
import { z } from "zod";

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  startDate: z.coerce.date().optional(),
  targetDeliveryDate: z.coerce.date().optional(),
});

export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
