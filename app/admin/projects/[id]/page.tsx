// Admin — Project Detail — PLAN.md §18.3, §32-34.
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getProjectDetail } from "@/features/projects/get";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectStateControl } from "@/components/admin/project-state-control";
import { MilestoneCreateForm } from "@/components/admin/milestone-create-form";
import { MilestoneStatusSelect } from "@/components/admin/milestone-status-select";
import { CommentThread } from "@/components/portal/comment-thread";
import { PROJECT_STATE_LABEL } from "@/lib/project-labels";

export default async function AdminProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await getProjectDetail(params.id);
  if (!project) notFound();

  const nextOrder = project.milestones.length > 0 ? Math.max(...project.milestones.map((m) => m.order)) + 1 : 0;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl">{project.name}</h1>
          <Badge variant="info">{PROJECT_STATE_LABEL[project.state] ?? project.state}</Badge>
        </div>
        <ProjectStateControl projectId={project.id} state={project.state} />
      </div>
      <p className="text-sm text-text-muted">{project.client.companyName} · Owned by {project.founderOwner.name}</p>

      <div>
        <h2 className="mb-3 font-display text-lg">Milestones</h2>
        <div className="mb-4">
          <MilestoneCreateForm projectId={project.id} nextOrder={nextOrder} />
        </div>
        {project.milestones.length === 0 ? (
          <EmptyState title="No milestones yet" />
        ) : (
          <ul className="flex flex-col gap-2">
            {project.milestones.map((m) => (
              <li key={m.id} className="flex items-center justify-between rounded-md border border-border px-4 py-2 text-sm">
                <span>{m.name}</span>
                <MilestoneStatusSelect projectId={project.id} milestoneId={m.id} status={m.status} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg">Messages</h2>
        <CommentThread
          projectId={project.id}
          comments={project.comments.map((c) => ({ id: c.id, body: c.body, createdAt: c.createdAt.toISOString(), author: { name: c.author.name } }))}
        />
      </div>
    </div>
  );
}
