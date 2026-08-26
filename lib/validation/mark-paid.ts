import { z } from "zod";

export const markPaidSchema = z.object({ reference: z.string().min(1).max(100) });
export type MarkPaidInput = z.infer<typeof markPaidSchema>;
