// Client Portal — Invoices List — PLAN.md §20.18.
import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

const STATUS_VARIANT: Record<string, "success" | "warning" | "error" | "neutral"> = {
  PAID: "success",
  SENT: "warning",
  OVERDUE: "error",
  DRAFT: "neutral",
  CANCELLED: "neutral",
};

export default async function InvoicesPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const clientId = session!.user.clientId as string | null;

  const invoices = clientId
    ? await db.invoice.findMany({ where: { clientId }, include: { project: true }, orderBy: { createdAt: "desc" } })
    : [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl">Invoices</h1>
      {invoices.length === 0 ? (
        <EmptyState title="No invoices yet" />
      ) : (
        <ul className="flex flex-col gap-2">
          {invoices.map((invoice) => (
            <li key={invoice.id}>
              <Link href={`/invoices/${invoice.id}`} className="flex items-center justify-between rounded-md border border-border px-4 py-3 text-sm hover:bg-surface-elevated">
                <div>
                  <p className="font-medium">{invoice.number}</p>
                  <p className="text-text-muted">{invoice.project?.name ?? "—"}</p>
                </div>
                <div className="text-right">
                  <p>₹{invoice.amountTotal.toString()}</p>
                  <Badge variant={STATUS_VARIANT[invoice.status] ?? "neutral"}>{invoice.status}</Badge>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
