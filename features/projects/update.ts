// TEAM-only project field updates (name/dates). State transitions go through
// features/projects/state-machine.ts + the dedicated /state route instead.
import { db } from "@/lib/db";
import type { UpdateProjectInput } from "@/lib/validation/project";

export function updateProject(projectId: string, data: UpdateProjectInput) {
  return db.project.update({ where: { id: projectId }, data });
}
