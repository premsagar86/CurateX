// Client Portal — Invoice Detail — PLAN.md §20.18. Live "Pay now" is
// explicitly Phase 2 (Razorpay) — the pay endpoint stays a 501 stub; this
// page shows status/amount/manual reference only, no fake payment flow.
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getInvoiceDetail } from "@/features/invoices/get";
import { Badge } from "@/components/ui/badge";

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  const invoice = await getInvoiceDetail(params.id);

  if (!invoice) notFound();
  const isOwner = session!.user.role === "TEAM" || invoice.clientId === session!.user.clientId;
  if (!isOwner) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-2xl">{invoice.number}</h1>
        <Badge variant={invoice.status === "PAID" ? "success" : invoice.status === "OVERDUE" ? "error" : "warning"}>
          {invoice.status}
        </Badge>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-text-muted">
            <th className="py-2">Description</th>
            <th className="py-2">Qty</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((item) => (
            <tr key={item.id} className="border-b border-border">
              <td className="py-2">{item.description}</td>
              <td className="py-2">{item.quantity}</td>
              <td className="py-2 text-right">₹{item.unitAmount.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span>₹{invoice.amountTotal.toString()}</span>
      </div>

      <p className="text-sm text-text-muted">Due {invoice.dueDate.toLocaleDateString("en-IN")}</p>

      {invoice.status === "PAID" ? (
        <p className="text-sm text-success">
          Paid {invoice.paidAt?.toLocaleDateString("en-IN")}
          {invoice.paymentReference && ` · Ref: ${invoice.paymentReference}`}
        </p>
      ) : (
        <div className="rounded-md border border-border p-4 text-sm text-text-muted">
          Online payment isn&apos;t available yet — pay by bank transfer/UPI per your proposal, and we&apos;ll mark this paid once received.
        </div>
      )}
    </div>
  );
}
