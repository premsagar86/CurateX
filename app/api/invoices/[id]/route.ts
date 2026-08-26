// Invoice detail — PLAN.md §30.3. CLIENT: own only; TEAM: any.
import { NextResponse, type NextRequest } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getInvoiceDetail } from "@/features/invoices/get";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) return NextResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });

  const invoice = await getInvoiceDetail(params.id);
  if (!invoice) return NextResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });

  const isOwner = session.user.role === "TEAM" || invoice.clientId === session.user.clientId;
  if (!isOwner) return NextResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });

  return NextResponse.json(invoice);
}
