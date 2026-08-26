import { db } from "@/lib/db";

export function createProposal(leadId: string) {
  return db.proposal.create({ data: { leadId, status: "DRAFT" } });
}
