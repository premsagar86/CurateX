// Project detail — PLAN.md §20.16. Milestone timeline, current-action panel,
// files, comments, linked invoices.
export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="font-display text-2xl">Project {params.id}</h1>
      {/* TODO: Timeline (§16.4), current-action panel, Comment thread,
          linked invoices — PLAN.md §20.16 */}
    </div>
  );
}
