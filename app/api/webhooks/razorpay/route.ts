// Razorpay webhook — Phase 2, site.md §6.2. Signature-verified, not
// session-based (PLAN.md §30.4).
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logError } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Razorpay not yet configured — Phase 2." } },
      { status: 501 }
    );
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "Invalid signature" } }, { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody);
    if (event.event === "payment.captured") {
      await db.invoice.update({
        where: { razorpayOrderId: event.payload.payment.entity.order_id },
        data: {
          status: "PAID",
          paidAt: new Date(),
          razorpayPaymentId: event.payload.payment.entity.id,
        },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    logError(error, { route: "POST /api/webhooks/razorpay" });
    return NextResponse.json({ error: { code: "INTERNAL", message: "Webhook processing failed" } }, { status: 500 });
  }
}
