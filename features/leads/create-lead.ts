// Orchestrates the full lead-creation operation: persist + notify.
// PLAN.md §26.4. Called from app/api/leads/route.ts, never from the UI directly.
import { db } from "@/lib/db";
import type { LeadInput } from "@/lib/validation/lead";

export async function createLead(data: Omit<LeadInput, "website">) {
  const lead = await db.lead.create({
    data: {
      name: data.name,
      email: data.email,
      company: data.company,
      service: data.service,
      budgetRange: data.budgetRange,
      timeline: data.timeline,
      message: data.message,
    },
  });

  // TODO: features/notifications/dispatch.ts — notify founders + send
  // submitter acknowledgment (PLAN.md §21.9, §37.2)

  return lead;
}
