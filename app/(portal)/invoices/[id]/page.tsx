// Invoice detail — PLAN.md §20.18.
export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="font-display text-2xl">Invoice {params.id}</h1>
      {/* TODO: line items, total, due date, "Pay now" (Phase 1: manual reference,
          Phase 2: Razorpay §6.2), download PDF — PLAN.md §20.18 */}
    </div>
  );
}
