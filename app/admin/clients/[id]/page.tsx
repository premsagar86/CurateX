// Admin — Client Detail — PLAN.md §18.3, §31.1.
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { InviteUserForm } from "@/components/admin/invite-user-form";
import { CreateProjectForm } from "@/components/admin/create-project-form";
import { PROJECT_STATE_LABEL } from "@/lib/project-labels";

export default async function AdminClientDetailPage({ params }: { params: { id: string } }) {
  const [client, founders] = await Promise.all([
    db.client.findUnique({ where: { id: params.id }, include: { projects: true, invoices: true, users: true } }),
    db.user.findMany({ where: { role: "TEAM" }, select: { id: true, name: true } }),
  ]);

  if (!client) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl">{client.companyName}</h1>

      <div>
        <h2 className="mb-3 font-display text-lg">Portal users</h2>
        {client.users.length === 0 ? (
          <EmptyState title="No portal users yet" />
        ) : (
          <ul className="flex flex-col gap-2">
            {client.users.map((user) => (
              <li key={user.id} className="rounded-md border border-border px-4 py-2 text-sm">
                {user.name} — {user.email}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4">
          <p className="mb-2 text-sm font-medium">Invite a user</p>
          <InviteUserForm clientId={client.id} />
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg">Projects</h2>
        <div className="mb-4">
          <CreateProjectForm clientId={client.id} founders={founders} />
        </div>
        {client.projects.length === 0 ? (
          <EmptyState title="No projects yet" />
        ) : (
          <ul className="flex flex-col gap-2">
            {client.projects.map((project) => (
              <li key={project.id}>
                <Link href={`/admin/projects/${project.id}`} className="flex items-center justify-between rounded-md border border-border px-4 py-2 text-sm hover:bg-surface-elevated">
                  <span>{project.name}</span>
                  <Badge variant="info">{PROJECT_STATE_LABEL[project.state] ?? project.state}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg">Invoices</h2>
        {client.invoices.length === 0 ? (
          <EmptyState title="No invoices yet" />
        ) : (
          <ul className="flex flex-col gap-2">
            {client.invoices.map((invoice) => (
              <li key={invoice.id}>
                <Link href={`/invoices/${invoice.id}`} className="flex items-center justify-between rounded-md border border-border px-4 py-2 text-sm hover:bg-surface-elevated">
                  <span>{invoice.number}</span>
                  <Badge>{invoice.status}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
