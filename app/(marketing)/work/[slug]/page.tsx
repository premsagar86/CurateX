// Case study detail — PLAN.md §20.5.
export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  return (
    <section className="mx-auto max-w-container px-6 py-16">
      <h1 className="font-display text-3xl capitalize">{params.slug.replace(/-/g, " ")}</h1>
      {/* TODO: challenge/approach/outcome sections, testimonial, related case studies — PLAN.md §20.5 */}
    </section>
  );
}
