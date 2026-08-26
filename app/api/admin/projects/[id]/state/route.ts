// Project state transition — PLAN.md §30.3. TEAM only.
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { transition, InvalidTransitionError } from "@/features/projects/state-machine";
import type { ProjectState } from "@prisma/client";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session || session.user.role !== "TEAM") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const { state } = (await req.json()) as { state: ProjectState };

  const project = await db.project.findUniqueOrThrow({ where: { id: params.id } });

  try {
    const nextState = transition(project.state, state);
    const updated = await db.project.update({ where: { id: params.id }, data: { state: nextState } });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof InvalidTransitionError) {
      return NextResponse.json({ error: { code: "VALIDATION_ERROR", message: error.message } }, { status: 400 });
    }
    throw error;
  }
}
