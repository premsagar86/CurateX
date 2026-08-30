// Client Portal — Project Detail — PLAN.md §20.16.
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getProjectDetail } from "@/features/projects/get";
import { Badge } from "@/components/ui/badge";
import { Timeline } from "@/components/ui/timeline";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ApproveMilestoneButton } from "@/components/portal/approve-milestone-button";
import { CommentThread } from "@/components/portal/comment-thread";
import { PROJECT_STATE_LABEL, MILESTONE_STATUS_LABEL, milestoneTimelineStatus } from "@/lib/project-labels";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  const project = await getProjectDetail(params.id);

  if (!project) notFound();
  const isOwner = session!.user.role === "TEAM" || project.clientId === session!.user.clientId;
  if (!isOwner) notFound();

  const awaitingApproval = project.milestones.find((m) => m.status === "AWAITING_APPROVAL");
  const totalMilestones = project.milestones.length || 1;
  const completed = project.milestones.filter((m) => m.status === "APPROVED" || m.status === "DELIVERED").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl">{project.name}</h1>
          <Badge variant="info">{PROJECT_STATE_LABEL[project.state] ?? project.state}</Badge>
        </div>
        <div className="mt-2 h-2 w-full max-w-sm overflow-hidden rounded-full bg-surface-elevated">
          <div className="h-full bg-primary" style={{ width: `${Math.round((completed / totalMilestones) * 100)}%` }} />
        </div>
      </div>

      {awaitingApproval && (
        <Card className="border-primary/40 bg-primary/5">
          <p className="font-medium">Awaiting your review: {awaitingApproval.name}</p>
          {awaitingApproval.description && <p className="mt-1 text-sm text-text-muted">{awaitingApproval.description}</p>}
          <div className="mt-4">
            <ApproveMilestoneButton projectId={project.id} milestoneId={awaitingApproval.id} />
          </div>
        </Card>
      )}

      <div>
        <h2 className="mb-3 font-display text-lg">Milestones</h2>
        {project.milestones.length === 0 ? (
          <EmptyState title="No milestones yet" />
        ) : (
          <Timeline
            steps={project.milestones.map((m) => ({
              label: m.name,
              description: MILESTONE_STATUS_LABEL[m.status] ?? m.status,
              status: milestoneTimelineStatus(m.status),
            }))}
          />
        )}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg">Files</h2>
        <Link href={`/projects/${project.id}/files`} className="text-sm underline">
          View all files →
        </Link>
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg">Messages</h2>
        <CommentThread
          projectId={project.id}
          comments={project.comments.map((c) => ({ id: c.id, body: c.body, createdAt: c.createdAt.toISOString(), author: { name: c.author.name } }))}
        />
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg">Invoices</h2>
        {project.invoices.length === 0 ? (
          <EmptyState title="No invoices for this project yet" />
        ) : (
          <ul className="flex flex-col gap-2">
            {project.invoices.map((invoice) => (
              <li key={invoice.id}>
                <Link href={`/invoices/${invoice.id}`} className="flex justify-between rounded-md border border-border px-4 py-2 text-sm hover:bg-surface-elevated">
                  <span>{invoice.number}</span>
                  <span>₹{invoice.amountTotal.toString()} · {invoice.status}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
