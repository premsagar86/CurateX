// Client-facing labels for internal state-machine values — PLAN.md §20.7's
// labeling note: client-facing labels differ from internal state-machine
// names where the internal name would be confusing to a client.
export const PROJECT_STATE_LABEL: Record<string, string> = {
  ONBOARDING: "Getting started",
  ACTIVE: "In progress",
  REVIEW: "In review",
  APPROVED: "Approved",
  DELIVERED: "Delivered",
  CLOSED: "Closed",
};

export const MILESTONE_STATUS_LABEL: Record<string, string> = {
  UPCOMING: "Upcoming",
  IN_PROGRESS: "In progress",
  AWAITING_APPROVAL: "Awaiting your approval",
  APPROVED: "Approved",
  DELIVERED: "Delivered",
};

export function milestoneTimelineStatus(status: string): "complete" | "current" | "upcoming" {
  if (status === "APPROVED" || status === "DELIVERED") return "complete";
  if (status === "IN_PROGRESS" || status === "AWAITING_APPROVAL") return "current";
  return "upcoming";
}
