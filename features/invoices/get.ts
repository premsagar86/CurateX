import { db } from "@/lib/db";

export function getInvoiceDetail(invoiceId: string) {
  return db.invoice.findUnique({
    where: { id: invoiceId },
    include: { lineItems: true, project: true, client: true },
  });
}
