import { z } from "zod";

export const createProposalSchema = z.object({
  leadId: z.string().min(1),
});

export type CreateProposalInput = z.infer<typeof createProposalSchema>;
