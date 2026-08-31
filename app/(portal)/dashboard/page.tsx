// Client Portal — Dashboard — PLAN.md §20.14.
import { headers } from "next/headers";
import Link from "next/link";
import type { ReactNode } from "react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PROJECT_STATE_LABEL, MILESTONE_STATUS_LABEL } from "@/lib/project-labels";
import { cn } from "@/lib/utils";

const STATE_BADGE: Record<string, "neutral" | "success" | "warning" | "info"> = {
  ONBOARDING: "info",
  ACTIVE: "info",
  REVIEW: "warning",
  APPROVED: "success",
  DELIVERED: "success",
  CLOSED: "neutral",
};

const PROJECT_STATE_ORDER = ["ONBOARDING", "ACTIVE", "REVIEW", "APPROVED", "DELIVERED", "CLOSED"] as const;
const MILESTONE_STATUS_ORDER = ["UPCOMING", "IN_PROGRESS", "AWAITING_APPROVAL", "APPROVED", "DELIVERED"] as const;
const INVOICE_STATUS_ORDER = ["DRAFT", "SENT", "OVERDUE", "PAID", "CANCELLED"] as const;
const INVOICE_STATUS_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  OVERDUE: "Overdue",
  PAID: "Paid",
  CANCELLED: "Cancelled",
};

const isDone = (status: string) => status === "APPROVED" || status === "DELIVERED";

/** Fill a fixed key order from groupBy rows, defaulting missing keys to 0. */
function fillCounts(order: readonly string[], rows: { key: string; count: number }[]) {
  const map = new Map(rows.map((r) => [r.key, r.count]));
  return order.map((key) => ({ key, count: map.get(key) ?? 0 }));
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const clientId = session!.user.clientId as string | null;

  if (!clientId) {
    return <EmptyState title="No client account linked" description="Contact your Forge Digital team if this looks wrong." />;
  }

  const [activeProjects, projectStateRows, invoiceStatusRows, commentCount, recentComments] = await Promise.all([
    db.project.findMany({
      where: { clientId, state: { notIn: ["CLOSED"] } },
      include: { milestones: { orderBy: { order: "asc" } } },
    }),
    db.project.groupBy({ by: ["state"], where: { clientId }, _count: true }),
    db.invoice.groupBy({ by: ["status"], where: { clientId }, _count: true }),
    db.comment.count({ where: { project: { clientId } } }),
    db.comment.findMany({
      where: { project: { clientId } },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { author: true, project: true },
    }),
  ]);

  const projectStateCounts = fillCounts(
    PROJECT_STATE_ORDER,
    projectStateRows.map((r) => ({ key: r.state, count: r._count }))
  );
  const invoiceStatusCounts = fillCounts(
    INVOICE_STATUS_ORDER,
    invoiceStatusRows.map((r) => ({ key: r.status, count: r._count }))
  );
  const totalProjects = projectStateCounts.reduce((n, r) => n + r.count, 0);
  const invoicesDue = invoiceStatusCounts
    .filter((r) => r.key === "SENT" || r.key === "OVERDUE")
    .reduce((n, r) => n + r.count, 0);

  const allMilestones = activeProjects.flatMap((p) =>
    p.milestones.map((m) => ({ ...m, projectName: p.name, projectId: p.id }))
  );
  const milestoneStatusCounts = fillCounts(
    MILESTONE_STATUS_ORDER,
    Object.entries(
      allMilestones.reduce<Record<string, number>>((acc, m) => {
        acc[m.status] = (acc[m.status] ?? 0) + 1;
        return acc;
      }, {})
    ).map(([key, count]) => ({ key, count }))
  );
  const awaiting = allMilestones.filter((m) => m.status === "AWAITING_APPROVAL");
  const doneCount = allMilestones.filter((m) => isDone(m.status)).length;
  const overallPct = allMilestones.length > 0 ? Math.round((doneCount / allMilestones.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl tracking-tight">
          Welcome back{session!.user.name ? `, ${session!.user.name}` : ""}
        </h1>
        <p className="text-sm text-text-muted">
          {activeProjects.length === 0
            ? "No active projects right now."
            : `${activeProjects.length} active project${activeProjects.length === 1 ? "" : "s"}`}
          {awaiting.length > 0 && ` · ${awaiting.length} awaiting your review`}
          {invoicesDue > 0 && ` · ${invoicesDue} invoice${invoicesDue === 1 ? "" : "s"} due`}
        </p>
      </header>

      {/* KPI row — always shown, real numbers (0 is 0) */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatTile label="Active projects" value={activeProjects.length} href="/projects" />
        <StatTile label="Total projects" value={totalProjects} href="/projects" />
        <StatTile label="Milestones" value={allMilestones.length} />
        <StatTile label="Needs your approval" value={awaiting.length} tone={awaiting.length > 0 ? "warning" : "default"} />
        <StatTile label="Invoices due" value={invoicesDue} href="/invoices" tone={invoicesDue > 0 ? "error" : "default"} />
        <StatTile label="Overall progress" value={`${overallPct}%`} />
      </div>

      {/* Pending approvals — surfaced first when there's action to take */}
      {awaiting.length > 0 && (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg tracking-tight">Waiting on you</h2>
            <Badge variant="warning">{awaiting.length}</Badge>
          </div>
          <div className="flex flex-col gap-2">
            {awaiting.map((m) => (
              <Link
                key={m.id}
                href={`/projects/${m.projectId}`}
                className="group flex items-center gap-3 rounded-md border border-warning/30 bg-surface px-4 py-3 text-sm transition-colors hover:border-warning/50 hover:bg-warning/5"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-warning" />
                <span className="flex-1">
                  Approve <strong>{m.name}</strong> on {m.projectName}
                </span>
                {m.dueDate && (
                  <span className="hidden text-text-muted sm:inline">due {m.dueDate.toLocaleDateString("en-IN")}</span>
                )}
                <span className="text-text-muted transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Breakdown cards — always rendered; rows show 0 rather than disappearing */}
      <section className="grid gap-3 md:grid-cols-3">
        <BreakdownCard
          title="Projects by stage"
          href="/projects"
          rows={projectStateCounts.map((r) => ({ label: PROJECT_STATE_LABEL[r.key] ?? r.key, count: r.count }))}
          footer={totalProjects === 0 ? "No projects have been created yet." : undefined}
        />
        <BreakdownCard
          title="Milestones by status"
          rows={milestoneStatusCounts.map((r) => ({ label: MILESTONE_STATUS_LABEL[r.key] ?? r.key, count: r.count }))}
          footer={allMilestones.length === 0 ? "No milestones on your active projects yet." : undefined}
        />
        <BreakdownCard
          title="Invoices by status"
          href="/invoices"
          rows={invoiceStatusCounts.map((r) => ({ label: INVOICE_STATUS_LABEL[r.key] ?? r.key, count: r.count }))}
          footer={invoiceStatusCounts.every((r) => r.count === 0) ? "No invoices have been issued yet." : undefined}
        />
      </section>

      {/* Projects */}
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg tracking-tight">Your projects</h2>
        {activeProjects.length === 0 ? (
          <EmptyState
            title="No active projects yet"
            description="Once a project kicks off, it'll show up here with milestones and progress."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {activeProjects.map((project) => {
              const total = project.milestones.length;
              const done = project.milestones.filter((m) => isDone(m.status)).length;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              const awaitingApproval = project.milestones.find((m) => m.status === "AWAITING_APPROVAL");
              const nextMilestone = project.milestones.find((m) => !isDone(m.status));

              return (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card interactive className="flex h-full flex-col gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">{project.name}</p>
                      <Badge variant={STATE_BADGE[project.state] ?? "neutral"}>
                        {PROJECT_STATE_LABEL[project.state] ?? project.state}
                      </Badge>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs text-text-muted">
                        <span>
                          {total === 0 ? "No milestones yet" : `${done} / ${total} milestones`}
                        </span>
                        <span className="tabular-nums">{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <div className="mt-auto flex items-center gap-2 text-sm">
                      {total === 0 ? (
                        <>
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-text-muted" />
                          <span className="text-text-muted">Milestones not scheduled yet</span>
                        </>
                      ) : awaitingApproval ? (
                        <>
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warning" />
                          <span className="text-text-muted">
                            {MILESTONE_STATUS_LABEL.AWAITING_APPROVAL}: {awaitingApproval.name}
                          </span>
                        </>
                      ) : nextMilestone ? (
                        <>
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-info" />
                          <span className="text-text-muted">
                            Next: {nextMilestone.name}
                            {nextMilestone.dueDate && ` · ${nextMilestone.dueDate.toLocaleDateString("en-IN")}`}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                          <span className="text-text-muted">All milestones complete</span>
                        </>
                      )}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent activity */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg tracking-tight">Recent activity</h2>
          <Badge variant="neutral">{commentCount}</Badge>
        </div>
        <Card className="p-0">
          {recentComments.length === 0 ? (
            <p className="px-5 py-4 text-sm text-text-muted">No comments on your projects yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {recentComments.map((comment) => (
                <li key={comment.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface-elevated text-xs font-medium">
                    {comment.author.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="flex-1">
                    <span className="font-medium">{comment.author.name}</span> commented on{" "}
                    <Link href={`/projects/${comment.projectId}`} className="underline">
                      {comment.project.name}
                    </Link>
                  </span>
                  <span className="shrink-0 text-text-muted">{comment.createdAt.toLocaleDateString("en-IN")}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>

      <div className="flex flex-wrap gap-2 text-sm">
        <QuickLink href="/invoices">Invoices</QuickLink>
        <QuickLink href="/projects">All projects</QuickLink>
        <QuickLink href="/settings">Settings</QuickLink>
      </div>
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
  value: ReactNode;
  href?: string;
  tone?: "default" | "warning" | "error";
}) {
  const nonZero = typeof value === "number" ? value > 0 : true;
  const body = (
    <>
      <span className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</span>
      <span
        className={cn(
          "mt-1 font-display text-3xl tracking-tight",
          tone === "warning" && nonZero && "text-warning",
          tone === "error" && nonZero && "text-error"
        )}
      >
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

function BreakdownCard({
  title,
  rows,
  href,
  footer,
}: {
  title: string;
  rows: { label: string; count: number }[];
  href?: string;
  footer?: string;
}) {
  const heading = <p className="border-b border-border px-5 py-3 text-sm font-medium">{title}</p>;
  return (
    <Card className="flex flex-col p-0">
      {href ? (
        <Link href={href} className="transition-colors hover:bg-surface-elevated">
          {heading}
        </Link>
      ) : (
        heading
      )}
      <ul className="divide-y divide-border">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between px-5 py-2.5 text-sm">
            <span className="text-text-muted">{row.label}</span>
            <span className={cn("font-medium tabular-nums", row.count === 0 && "text-text-muted")}>{row.count}</span>
          </li>
        ))}
      </ul>
      {footer && <p className="border-t border-border px-5 py-3 text-xs text-text-muted">{footer}</p>}
    </Card>
  );
}

function QuickLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-md border border-border px-3 py-1.5 font-medium text-text transition-colors hover:bg-surface-elevated"
    >
      {children}
    </Link>
  );
}
