// Shared Zod schema for the Contact form — used client-side (fast feedback)
// and server-side (authoritative) so the two can never drift apart.
// PLAN.md §21.9 (field spec) / §26.3.
import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  company: z.string().optional(),
  service: z.enum([
    "WEBSITE",
    "UI_UX_DESIGN",
    "BRANDING",
    "GRAPHIC_DESIGN",
    "SOCIAL_MEDIA",
    "CONTENT_CREATION",
    "SEO",
    "ECOMMERCE",
  ]),
  budgetRange: z.enum(["UNDER_25K", "RANGE_25K_75K", "RANGE_75K_2L", "OVER_2L", "NOT_SURE"]),
  timeline: z.enum(["ASAP", "ONE_MONTH", "ONE_TO_THREE_MONTHS", "FLEXIBLE"]),
  message: z.string().optional(),
  // Honeypot field — invisible to real users, filled only by bots (§21.9 spam prevention)
  website: z.string().max(0).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
