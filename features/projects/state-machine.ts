// Project state machine — encodes valid states/transitions in one place so
// an invalid transition can never happen in code. PLAN.md §26.6, §34.
import type { ProjectState } from "@prisma/client";

const VALID_TRANSITIONS: Record<ProjectState, ProjectState[]> = {
  ONBOARDING: ["ACTIVE"],
  ACTIVE: ["REVIEW"],
  REVIEW: ["APPROVED", "ACTIVE"], // client can request revisions, bouncing back to ACTIVE
  APPROVED: ["DELIVERED"],
  DELIVERED: ["CLOSED"],
  CLOSED: [],
};

export class InvalidTransitionError extends Error {}

export function transition(currentState: ProjectState, toState: ProjectState): ProjectState {
  if (!VALID_TRANSITIONS[currentState].includes(toState)) {
    throw new InvalidTransitionError(`Cannot transition from ${currentState} to ${toState}`);
  }
  // TODO: guard clauses per PLAN.md §34.2, e.g. ACTIVE -> REVIEW requires
  // every Milestone APPROVED/DELIVERED AND the QA checklist (§46.4) complete.
  return toState;
}
