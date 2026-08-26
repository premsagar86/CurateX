import { z } from "zod";

export const createMilestoneSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  order: z.coerce.number().int().min(0),
  dueDate: z.coerce.date().optional(),
});

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;
