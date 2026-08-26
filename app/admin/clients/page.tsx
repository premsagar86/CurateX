// Admin — Clients — PLAN.md §18.3.
import Link from "next/link";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";

export default async function AdminClientsPage() {
  const clients = await db.client.findMany({
    where: { deletedAt: null },
    include: { _count: { select: { projects: true, users: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl">Clients</h1>
      {clients.length === 0 ? (
        <EmptyState title="No clients yet" description="Convert a lead to CONVERTED status to create your first client." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {clients.map((client) => (
            <Link key={client.id} href={`/admin/clients/${client.id}`}>
              <Card interactive>
                <p className="font-medium">{client.companyName}</p>
                <p className="mt-1 text-sm text-text-muted">
                  {client._count.projects} project{client._count.projects === 1 ? "" : "s"} · {client._count.users} user{client._count.users === 1 ? "" : "s"}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
