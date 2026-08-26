import { z } from "zod";

export const leadStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "DISQUALIFIED", "CONVERTED"]),
});

export type LeadStatusInput = z.infer<typeof leadStatusSchema>;
