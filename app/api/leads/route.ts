// Contact form endpoint — PLAN.md §21.9, §26.5, §30.3.
import { NextRequest, NextResponse } from "next/server";
import { leadSchema } from "@/lib/validation/lead";
import { createLead } from "@/features/leads/create-lead";
import { logError } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid submission.",
          fields: parsed.error.flatten().fieldErrors,
        },
      },
      { status: 400 }
    );
  }

  // Honeypot — silently reject without revealing to the bot that it was caught (§21.9)
  if (parsed.data.website) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  try {
    const lead = await createLead(parsed.data);
    return NextResponse.json({ id: lead.id }, { status: 201 });
  } catch (error) {
    logError(error, { route: "POST /api/leads" });
    return NextResponse.json(
      { error: { code: "INTERNAL", message: "Something went wrong. Please try again." } },
      { status: 500 }
    );
  }
}
