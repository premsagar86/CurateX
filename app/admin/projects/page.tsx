// Admin — Projects — PLAN.md §18.3.
import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PROJECT_STATE_LABEL } from "@/lib/project-labels";

export default async function AdminProjectsPage() {
  const projects = await db.project.findMany({
    where: { deletedAt: null },
    include: { client: true, founderOwner: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl">Projects</h1>
      {projects.length === 0 ? (
        <EmptyState title="No projects yet" description="Create one from a client's detail page." />
      ) : (
        <ul className="flex flex-col gap-2">
          {projects.map((project) => (
            <li key={project.id}>
              <Link href={`/admin/projects/${project.id}`} className="flex items-center justify-between rounded-md border border-border px-4 py-3 text-sm hover:bg-surface-elevated">
                <div>
                  <p className="font-medium">{project.name}</p>
                  <p className="text-text-muted">{project.client.companyName} · {project.founderOwner.name}</p>
                </div>
                <Badge variant="info">{PROJECT_STATE_LABEL[project.state] ?? project.state}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
