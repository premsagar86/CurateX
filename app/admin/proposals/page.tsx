// Admin — Proposals — PLAN.md §18.3.
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { CreateProposalForm, SendProposalButton } from "@/components/admin/proposal-actions";

export default async function AdminProposalsPage() {
  const [proposals, eligibleLeads] = await Promise.all([
    db.proposal.findMany({ include: { lead: true, client: true }, orderBy: { createdAt: "desc" } }),
    db.lead.findMany({ where: { status: { in: ["CONTACTED", "QUALIFIED"] } } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl">Proposals</h1>

      <div>
        <p className="mb-2 text-sm font-medium">Draft a new proposal</p>
        <CreateProposalForm leads={eligibleLeads} />
      </div>

      {proposals.length === 0 ? (
        <EmptyState title="No proposals yet" />
      ) : (
        <ul className="flex flex-col gap-2">
          {proposals.map((proposal) => (
            <li key={proposal.id} className="flex items-center justify-between rounded-md border border-border px-4 py-3 text-sm">
              <div>
                <p className="font-medium">{proposal.lead?.name ?? proposal.client?.companyName ?? "—"}</p>
                <p className="text-text-muted">{proposal.createdAt.toLocaleDateString("en-IN")}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge>{proposal.status}</Badge>
                {proposal.status === "DRAFT" && <SendProposalButton proposalId={proposal.id} />}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
