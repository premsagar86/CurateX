// Phase 1 manual/offline payment marking — site.md §5.3. Replaced by the
// Razorpay webhook handler (app/api/webhooks/razorpay/route.ts) in Phase 2,
// site.md §6.2 — Invoice.status/paidAt fields already match either path.
import { db } from "@/lib/db";

export async function markInvoicePaidManually(invoiceId: string, reference: string) {
  return db.invoice.update({
    where: { id: invoiceId },
    data: { status: "PAID", paidAt: new Date(), paymentReference: reference },
  });
}
