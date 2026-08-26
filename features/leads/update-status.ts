// Lead status update. Setting status to CONVERTED auto-creates the Client
// record (PLAN.md §34.1 note: "Lead converts to Client, §29.4") since there's
// no separate manual "create client" flow — the Lead is the only source of
// the initial company/contact info a Client record needs.
import { db } from "@/lib/db";
import type { LeadStatus } from "@prisma/client";

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const lead = await db.lead.findUniqueOrThrow({ where: { id: leadId } });

  if (status === "CONVERTED" && !lead.convertedClientId) {
    const client = await db.client.create({
      data: {
        companyName: lead.company || lead.name,
        source: "INBOUND",
        notes: `Converted from lead ${lead.id} (${lead.email}).`,
      },
    });
    return db.lead.update({ where: { id: leadId }, data: { status, convertedClientId: client.id } });
  }

  return db.lead.update({ where: { id: leadId }, data: { status } });
}
