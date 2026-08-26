// Project detail fetch, scoped for the portal + admin project-detail views.
// PLAN.md §31.8 resource-level auth: CLIENT may only ever see their own
// project; TEAM may see any. Authorization itself happens in the route
// handler (needs session context) — this just fetches by id.
import { db } from "@/lib/db";

export function getProjectDetail(projectId: string) {
  return db.project.findUnique({
    where: { id: projectId },
    include: {
      client: true,
      founderOwner: true,
      milestones: { orderBy: { order: "asc" } },
      comments: { orderBy: { createdAt: "desc" }, include: { author: true } },
      files: { orderBy: { createdAt: "desc" }, include: { uploadedBy: true } },
      invoices: { orderBy: { createdAt: "desc" } },
    },
  });
}
