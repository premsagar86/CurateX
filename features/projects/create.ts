// Admin-only project creation — no client-facing equivalent (§18.4, projects
// are always created by a founder after a Lead is WON/CONVERTED).
import { db } from "@/lib/db";
import type { CreateProjectInput } from "@/lib/validation/create-project";

export function createProject(clientId: string, data: CreateProjectInput) {
  return db.project.create({ data: { clientId, ...data } });
}
