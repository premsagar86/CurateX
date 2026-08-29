// Shared Zod schema for the invite-gated signup form — used client-side (fast
// feedback) and server-side (authoritative), mirroring lib/validation/lead.ts.
// PLAN.md §20.13, §31.1.
import { z } from "zod";

export const signupSchema = z
  .object({
    token: z.string().min(1),
    // Lower-cased to match Better Auth's own normalization — PostgreSQL lookups
    // by email are case-sensitive, so client and server must agree on the form.
    email: z.string().email().toLowerCase(),
    name: z.string().min(1).max(100),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof signupSchema>;
