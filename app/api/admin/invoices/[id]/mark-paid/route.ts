// Manual/offline payment marking — TEAM only. PLAN.md §35, site.md §5.3.
import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { markInvoicePaidManually } from "@/features/invoices/mark-paid";
import { markPaidSchema } from "@/lib/validation/mark-paid";
import { logError } from "@/lib/logger";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session || session.user.role !== "TEAM") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const body = await req.json();
  const parsed = markPaidSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", fields: parsed.error.flatten().fieldErrors } }, { status: 400 });
  }

  try {
    const invoice = await markInvoicePaidManually(params.id, parsed.data.reference);
    return NextResponse.json(invoice);
  } catch (error) {
    logError(error, { route: "POST /api/admin/invoices/[id]/mark-paid" });
    return NextResponse.json({ error: { code: "INTERNAL" } }, { status: 500 });
  }
}
