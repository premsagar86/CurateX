// Send proposal — PLAN.md §37. No document-generation exists yet, so
// documentUrl stays whatever it already was (null by default) — this only
// transitions status/sentAt, it doesn't fabricate a document link.
import { db } from "@/lib/db";

export class ProposalNotSendableError extends Error {}

export async function sendProposal(proposalId: string) {
  const proposal = await db.proposal.findUniqueOrThrow({ where: { id: proposalId } });
  if (proposal.status !== "DRAFT") {
    throw new ProposalNotSendableError("Only a DRAFT proposal can be sent.");
  }
  return db.proposal.update({ where: { id: proposalId }, data: { status: "SENT", sentAt: new Date() } });
}
