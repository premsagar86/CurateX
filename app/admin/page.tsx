// Admin Dashboard — PLAN.md §20.20.
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";

const WIP_CAP = 4; // PLAN.md §34.3

export default async function AdminDashboardPage() {
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const now = new Date();

  const [staleLeads, overdueInvoices, stuckMilestones, leadCounts, projectCounts, projects] = await Promise.all([
    db.lead.findMany({ where: { status: "NEW", createdAt: { lt: dayAgo } }, orderBy: { createdAt: "asc" } }),
    db.invoice.findMany({ where: { status: "SENT", dueDate: { lt: now } }, include: { client: true } }),
    db.milestone.findMany({ where: { status: "AWAITING_APPROVAL" }, include: { project: true } }),
    db.lead.groupBy({ by: ["status"], _count: true }),
    db.project.groupBy({ by: ["state"], _count: true }),
    db.project.findMany({
      where: { state: { in: ["ONBOARDING", "ACTIVE", "REVIEW"] } },
      include: { founderOwner: true },
    }),
  ]);

  const wipByFounder = new Map<string, { name: string; count: number }>();
  for (const project of projects) {
    const entry = wipByFounder.get(project.founderOwnerId) ?? { name: project.founderOwner.name, count: 0 };
    entry.count += 1;
    wipByFounder.set(project.founderOwnerId, entry);
  }

  const needsAttention = staleLeads.length + overdueInvoices.length + stuckMilestones.length;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl">Admin Dashboard</h1>

      <div>
        <h2 className="mb-3 font-display text-lg">Needs your attention {needsAttention > 0 && <Badge variant="error">{needsAttention}</Badge>}</h2>
        {needsAttention === 0 ? (
          <EmptyState title="Nothing needs attention right now" />
        ) : (
          <div className="flex flex-col gap-2">
            {staleLeads.map((lead) => (
              <Link key={lead.id} href="/admin/leads" className="rounded-md border border-error/30 bg-error/5 px-4 py-2 text-sm">
                Lead <strong>{lead.name}</strong> has been unresponded for over 24 hours
              </Link>
            ))}
            {overdueInvoices.map((invoice) => (
              <Link key={invoice.id} href={`/invoices/${invoice.id}`} className="rounded-md border border-error/30 bg-error/5 px-4 py-2 text-sm">
                Invoice <strong>{invoice.number}</strong> for {invoice.client.companyName} is overdue
              </Link>
            ))}
            {stuckMilestones.map((milestone) => (
              <Link key={milestone.id} href={`/admin/projects/${milestone.projectId}`} className="rounded-md border border-warning/30 bg-warning/5 px-4 py-2 text-sm">
                Milestone <strong>{milestone.name}</strong> on {milestone.project.name} is awaiting client approval
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg">Pipeline snapshot</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <p className="mb-2 text-sm font-medium">Leads</p>
            <ul className="flex flex-col gap-1 text-sm">
              {leadCounts.map((row) => (
                <li key={row.status} className="flex justify-between">
                  <span>{row.status}</span>
                  <span>{row._count}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <p className="mb-2 text-sm font-medium">Projects</p>
            <ul className="flex flex-col gap-1 text-sm">
              {projectCounts.map((row) => (
                <li key={row.state} className="flex justify-between">
                  <span>{row.state}</span>
                  <span>{row._count}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg">WIP per founder (cap: {WIP_CAP})</h2>
        {wipByFounder.size === 0 ? (
          <EmptyState title="No active projects" />
        ) : (
          <ul className="flex flex-col gap-2">
            {Array.from(wipByFounder.values()).map((entry) => (
              <li key={entry.name} className="flex items-center justify-between rounded-md border border-border px-4 py-2 text-sm">
                <span>{entry.name}</span>
                <Badge variant={entry.count > WIP_CAP ? "error" : "neutral"}>{entry.count} / {WIP_CAP}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
