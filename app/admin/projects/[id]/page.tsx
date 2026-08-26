// Internal project view — PLAN.md §33.4. Mirrors the client-facing view plus
// QA checklist gate, cost tracking, founder-owner assignment.
export default function AdminProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="font-display text-2xl">Project {params.id}</h1>
      {/* TODO: QA checklist gate (§46.4), cost/hour tracking, state-machine
          transition controls (features/projects/state-machine.ts) — PLAN.md §33.4 */}
    </div>
  );
}
