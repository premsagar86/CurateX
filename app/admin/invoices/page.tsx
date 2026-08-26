// Admin — Invoices — PLAN.md §18.3.
import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { CreateInvoiceForm, MarkPaidForm } from "@/components/admin/invoice-actions";

const STATUS_VARIANT: Record<string, "success" | "warning" | "error" | "neutral"> = {
  PAID: "success",
  SENT: "warning",
  OVERDUE: "error",
  DRAFT: "neutral",
  CANCELLED: "neutral",
};

export default async function AdminInvoicesPage() {
  const [invoices, clients] = await Promise.all([
    db.invoice.findMany({ include: { client: true }, orderBy: { createdAt: "desc" } }),
    db.client.findMany({ where: { deletedAt: null }, select: { id: true, companyName: true } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl">Invoices</h1>

      <div>
        <p className="mb-2 text-sm font-medium">New invoice</p>
        <CreateInvoiceForm clients={clients} />
      </div>

      {invoices.length === 0 ? (
        <EmptyState title="No invoices yet" />
      ) : (
        <ul className="flex flex-col gap-2">
          {invoices.map((invoice) => (
            <li key={invoice.id} className="flex items-center justify-between rounded-md border border-border px-4 py-3 text-sm">
              <div>
                <Link href={`/invoices/${invoice.id}`} className="font-medium underline">{invoice.number}</Link>
                <p className="text-text-muted">{invoice.client.companyName} · ₹{invoice.amountTotal.toString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={STATUS_VARIANT[invoice.status] ?? "neutral"}>{invoice.status}</Badge>
                {invoice.status !== "PAID" && <MarkPaidForm invoiceId={invoice.id} />}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
