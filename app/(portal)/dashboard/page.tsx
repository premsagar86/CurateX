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

const isDone = (status: string) => status === "APPROVED" || status === "DELIVERED";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const clientId = session!.user.clientId as string | null;

  if (!clientId) {
    return <EmptyState title="No client account linked" description="Contact your Forge Digital team if this looks wrong." />;
  }

  const [projects, invoicesDue, recentComments] = await Promise.all([
    db.project.findMany({
      where: { clientId, state: { notIn: ["CLOSED"] } },
      include: { milestones: { orderBy: { order: "asc" } } },
    }),
    db.invoice.count({ where: { clientId, status: { in: ["SENT", "OVERDUE"] } } }),
    db.comment.findMany({
      where: { project: { clientId } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { author: true, project: true },
    }),
  ]);

  const allMilestones = projects.flatMap((p) => p.milestones.map((m) => ({ ...m, projectName: p.name, projectId: p.id })));
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
          {projects.length} active project{projects.length === 1 ? "" : "s"}
          {awaiting.length > 0 && ` · ${awaiting.length} awaiting your review`}
          {invoicesDue > 0 && ` · ${invoicesDue} invoice${invoicesDue === 1 ? "" : "s"} due`}
        </p>
      </header>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Active projects" value={projects.length} href="/projects" />
        <StatTile
          label="Needs your approval"
          value={awaiting.length}
          tone={awaiting.length > 0 ? "warning" : "default"}
        />
        <StatTile
          label="Invoices due"
          value={invoicesDue}
          href="/invoices"
          tone={invoicesDue > 0 ? "error" : "default"}
        />
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
                  <span className="hidden text-text-muted sm:inline">
                    due {m.dueDate.toLocaleDateString("en-IN")}
                  </span>
                )}
                <span className="text-text-muted transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      <section className="flex flex-col gap-3">
        <h2 className="font-display text-lg tracking-tight">Your projects</h2>
        {projects.length === 0 ? (
          <EmptyState title="No active projects yet" description="Once a project kicks off, you'll see it here." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {projects.map((project) => {
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
                          {done} / {total} milestones
                        </span>
                        <span className="tabular-nums">{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <div className="mt-auto flex items-center gap-2 text-sm">
                      {awaitingApproval ? (
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
        <h2 className="font-display text-lg tracking-tight">Recent activity</h2>
        {recentComments.length === 0 ? (
          <EmptyState title="No recent activity" />
        ) : (
          <Card className="p-0">
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
          </Card>
        )}
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
