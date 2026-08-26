// Razorpay integration — Phase 2 (site.md §6.2). Not wired into any route
// yet; features/invoices/ uses the Phase 1 manual-payment path
// (features/invoices/mark-paid.ts) until this is activated.
import Razorpay from "razorpay";

function getClient() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export async function createOrder(amountInRupees: number, invoiceId: string) {
  return getClient().orders.create({
    amount: amountInRupees * 100,
    currency: "INR",
    receipt: invoiceId,
  });
}
