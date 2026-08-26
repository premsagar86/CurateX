// Client detail — PLAN.md §33.3.
export default function AdminClientDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="font-display text-2xl">Client {params.id}</h1>
      {/* TODO: full client history — projects, invoices, retainers, internal notes — PLAN.md §33.3 */}
    </div>
  );
}
