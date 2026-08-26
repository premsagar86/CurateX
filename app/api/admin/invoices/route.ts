// Admin invoice creation — TEAM only. New route — nothing else creates
// Invoice rows, and /admin/invoices has no purpose without one.
import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { createInvoice } from "@/features/invoices/create";
import { createInvoiceSchema } from "@/lib/validation/create-invoice";
import { logError } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session || session.user.role !== "TEAM") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createInvoiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "VALIDATION_ERROR", fields: parsed.error.flatten().fieldErrors } }, { status: 400 });
  }

  try {
    const invoice = await createInvoice(parsed.data);
    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    logError(error, { route: "POST /api/admin/invoices" });
    return NextResponse.json({ error: { code: "INTERNAL" } }, { status: 500 });
  }
}
