// Stripe webhook — Phase 2+, gated behind the international-client ICP
// trigger (PLAN.md §06.3, §23.2). Not active until Stripe is added.
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: { code: "INTERNAL", message: "Stripe not yet enabled — Phase 2+, international clients." } },
    { status: 501 }
  );
}
