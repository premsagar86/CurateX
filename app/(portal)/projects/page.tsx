// Client Portal — Projects List — PLAN.md §20.15.
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PROJECT_STATE_LABEL } from "@/lib/project-labels";

export default async function ProjectsPage({ searchParams }: { searchParams: { filter?: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  const clientId = session!.user.clientId as string | null;
  const showPast = searchParams.filter === "past";

  const projects = clientId
    ? await db.project.findMany({
        where: { clientId, state: showPast ? "CLOSED" : { not: "CLOSED" } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Projects</h1>
        <div className="flex gap-2 text-sm">
          <Link href="/projects" className={!showPast ? "font-medium underline" : "text-text-muted"}>Active</Link>
          <Link href="/projects?filter=past" className={showPast ? "font-medium underline" : "text-text-muted"}>Past</Link>
        </div>
      </div>

      {projects.length === 0 ? (
        <EmptyState title={showPast ? "No past projects" : "No active projects"} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card interactive>
                <div className="flex items-center justify-between">
                  <p className="font-medium">{project.name}</p>
                  <Badge variant="info">{PROJECT_STATE_LABEL[project.state] ?? project.state}</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
