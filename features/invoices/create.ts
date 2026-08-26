// Admin-only invoice creation — Phase 1 manual/offline billing (site.md §5.3).
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import type { CreateInvoiceInput } from "@/lib/validation/create-invoice";

export async function createInvoice(data: CreateInvoiceInput) {
  const amountTotal = data.lineItems.reduce((sum, item) => sum + item.quantity * item.unitAmount, 0);
  const number = `INV-${new Date().getFullYear()}-${randomUUID().slice(0, 6).toUpperCase()}`;

  return db.invoice.create({
    data: {
      clientId: data.clientId,
      projectId: data.projectId,
      number,
      amountTotal,
      dueDate: data.dueDate,
      status: "SENT",
      lineItems: { create: data.lineItems },
    },
    include: { lineItems: true },
  });
}
