// Admin Dashboard — PLAN.md §20.20.
import Link from "next/link";
import type { ReactNode } from "react";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

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

  const attentionItems: { id: string; href: string; severity: "error" | "warning"; text: ReactNode }[] = [
    ...staleLeads.map((lead) => ({
      id: `lead-${lead.id}`,
      href: "/admin/leads",
      severity: "error" as const,
      text: (
        <>
          Lead <strong>{lead.name}</strong> has been unresponded for over 24 hours
        </>
      ),
    })),
    ...overdueInvoices.map((invoice) => ({
      id: `invoice-${invoice.id}`,
      href: `/invoices/${invoice.id}`,
      severity: "error" as const,
      text: (
        <>
          Invoice <strong>{invoice.number}</strong> for {invoice.client.companyName} is overdue
        </>
      ),
    })),
    ...stuckMilestones.map((milestone) => ({
      id: `milestone-${milestone.id}`,
      href: `/admin/projects/${milestone.projectId}`,
      severity: "warning" as const,
      text: (
        <>
          Milestone <strong>{milestone.name}</strong> on {milestone.project.name} is awaiting client approval
        </>
      ),
    })),
  ];

  const newLeads = leadCounts.find((row) => row.status === "NEW")?._count ?? 0;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-text-muted">
          {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </header>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Needs attention" value={attentionItems.length} tone={attentionItems.length > 0 ? "error" : "default"} />
        <StatTile label="New leads" value={newLeads} href="/admin/leads" />
        <StatTile label="Active projects" value={projects.length} href="/admin/projects" />
        <StatTile
          label="Overdue invoices"
          value={overdueInvoices.length}
          tone={overdueInvoices.length > 0 ? "error" : "default"}
          href="/admin/invoices"
        />
      </div>

      {/* Needs attention */}
      <Section
        title="Needs your attention"
        action={attentionItems.length > 0 ? <Badge variant="error">{attentionItems.length}</Badge> : null}
      >
        {attentionItems.length === 0 ? (
          <EmptyState title="Nothing needs attention right now" description="Overdue invoices, stale leads, and stuck milestones will surface here." />
        ) : (
          <div className="flex flex-col gap-2">
            {attentionItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-md border bg-surface px-4 py-3 text-sm transition-colors",
                  item.severity === "error"
                    ? "border-error/30 hover:border-error/50 hover:bg-error/5"
                    : "border-warning/30 hover:border-warning/50 hover:bg-warning/5"
                )}
              >
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full",
                    item.severity === "error" ? "bg-error" : "bg-warning"
                  )}
                />
                <span className="flex-1">{item.text}</span>
                <span className="text-text-muted transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            ))}
          </div>
        )}
      </Section>

      {/* Pipeline snapshot */}
      <Section title="Pipeline snapshot">
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="p-0">
            <p className="border-b border-border px-5 py-3 text-sm font-medium">Leads by status</p>
            <CountRows rows={leadCounts.map((r) => ({ label: r.status, count: r._count }))} empty="No leads yet" />
          </Card>
          <Card className="p-0">
            <p className="border-b border-border px-5 py-3 text-sm font-medium">Projects by state</p>
            <CountRows rows={projectCounts.map((r) => ({ label: r.state, count: r._count }))} empty="No projects yet" />
          </Card>
        </div>
      </Section>

      {/* WIP per founder */}
      <Section title="WIP per founder" action={<span className="text-xs text-text-muted">cap {WIP_CAP}</span>}>
        {wipByFounder.size === 0 ? (
          <EmptyState title="No active projects" />
        ) : (
          <Card className="flex flex-col gap-4 p-5">
            {Array.from(wipByFounder.values()).map((entry) => {
              const over = entry.count > WIP_CAP;
              const pct = Math.min(100, (entry.count / WIP_CAP) * 100);
              return (
                <div key={entry.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{entry.name}</span>
                    <Badge variant={over ? "error" : "neutral"}>
                      {entry.count} / {WIP_CAP}
                    </Badge>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
                    <div
                      className={cn("h-full rounded-full", over ? "bg-error" : "bg-primary")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </Card>
        )}
      </Section>
    </div>
  );
}

function StatTile({
  label,
  value,
  href,
  tone = "default",
}: {
  label: string;
  value: number;
  href?: string;
  tone?: "default" | "error";
}) {
  const body = (
    <>
      <span className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</span>
      <span className={cn("mt-1 font-display text-3xl tracking-tight", tone === "error" && value > 0 && "text-error")}>
        {value}
      </span>
    </>
  );

  const className = cn(
    "flex flex-col rounded-lg border border-border bg-surface p-4 transition-colors",
    href && "hover:border-primary/40 hover:bg-surface-elevated"
  );

  return href ? (
    <Link href={href} className={className}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h2 className="font-display text-lg tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function CountRows({ rows, empty }: { rows: { label: string; count: number }[]; empty: string }) {
  if (rows.length === 0) {
    return <p className="px-5 py-4 text-sm text-text-muted">{empty}</p>;
  }
  return (
    <ul className="divide-y divide-border">
      {rows.map((row) => (
        <li key={row.label} className="flex items-center justify-between px-5 py-2.5 text-sm">
          <span className="text-text-muted">{row.label}</span>
          <span className="font-medium tabular-nums">{row.count}</span>
        </li>
      ))}
    </ul>
  );
}
