// Initiate payment — PLAN.md §30.3. Phase 1: manual (site.md §5.3, no route
// needed — a founder marks paid from the admin). Phase 2: Razorpay order
// creation (site.md §6.2).
import { NextResponse } from "next/server";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  // TODO Phase 2: features/invoices/initiate-payment.ts -> lib/payments/razorpay.ts
  return NextResponse.json(
    { error: { code: "INTERNAL", message: "Online payment not yet enabled — Phase 2 (site.md §6.2)." } },
    { status: 501 }
  );
}
