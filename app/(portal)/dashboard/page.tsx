// Client Portal — Dashboard — PLAN.md §20.14.
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PROJECT_STATE_LABEL } from "@/lib/project-labels";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const clientId = session!.user.clientId as string | null;

  if (!clientId) {
    return <EmptyState title="No client account linked" description="Contact your Forge Digital team if this looks wrong." />;
  }

  const [projects, invoicesDue, upcomingMilestone, recentComments] = await Promise.all([
    db.project.findMany({
      where: { clientId, state: { notIn: ["CLOSED"] } },
      include: { milestones: { orderBy: { order: "asc" } } },
    }),
    db.invoice.count({ where: { clientId, status: { in: ["SENT", "OVERDUE"] } } }),
    db.milestone.findFirst({
      where: { project: { clientId }, status: "AWAITING_APPROVAL" },
      orderBy: { dueDate: "asc" },
    }),
    db.comment.findMany({
      where: { project: { clientId } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { author: true, project: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl">Welcome back{session!.user.name ? `, ${session!.user.name}` : ""}</h1>
        <p className="mt-1 text-text-muted">
          {projects.length} active project{projects.length === 1 ? "" : "s"}
          {upcomingMilestone && " · a milestone needs your review"}
          {invoicesDue > 0 && ` · ${invoicesDue} invoice${invoicesDue === 1 ? "" : "s"} due`}
        </p>
      </div>

      {projects.length === 0 ? (
        <EmptyState title="No active projects yet" description="Once a project kicks off, you'll see it here." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => {
            const awaitingApproval = project.milestones.find((m) => m.status === "AWAITING_APPROVAL");
            return (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card interactive>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{project.name}</p>
                    <Badge variant="info">{PROJECT_STATE_LABEL[project.state] ?? project.state}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-text-muted">
                    {awaitingApproval ? `Awaiting your approval on: ${awaitingApproval.name}` : "On track — no action needed"}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <div>
        <h2 className="mb-3 font-display text-lg">Recent activity</h2>
        {recentComments.length === 0 ? (
          <EmptyState title="No recent activity" />
        ) : (
          <ul className="flex flex-col gap-3">
            {recentComments.map((comment) => (
              <li key={comment.id} className="text-sm">
                <span className="font-medium">{comment.author.name}</span> commented on{" "}
                <Link href={`/projects/${comment.projectId}`} className="underline">
                  {comment.project.name}
                </Link>
                <span className="text-text-muted"> · {comment.createdAt.toLocaleDateString("en-IN")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-4 text-sm">
        <Link href="/invoices" className="underline">Invoices</Link>
        <Link href="/projects" className="underline">All projects</Link>
        <Link href="/settings" className="underline">Settings</Link>
      </div>
    </div>
  );
}
