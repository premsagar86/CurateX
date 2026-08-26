import { z } from "zod";

export const createInvoiceSchema = z.object({
  clientId: z.string().min(1),
  projectId: z.string().optional(),
  dueDate: z.coerce.date(),
  lineItems: z.array(z.object({ description: z.string().min(1), quantity: z.coerce.number().int().min(1), unitAmount: z.coerce.number().min(0) })).min(1),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
