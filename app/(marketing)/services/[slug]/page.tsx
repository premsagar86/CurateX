// Individual service page — PLAN.md §20.3.
export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  return (
    <section className="mx-auto max-w-container px-6 py-16">
      <h1 className="font-display text-3xl capitalize">{params.slug.replace(/-/g, " ")}</h1>
      {/* TODO: deliverables (from config/packages.ts), process, pricing snapshot,
          related work, FAQ — PLAN.md §20.3, §21.3 */}
    </section>
  );
}
