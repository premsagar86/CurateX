// Blog post — PLAN.md §20.11.
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <article className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-display text-3xl capitalize">{params.slug.replace(/-/g, " ")}</h1>
      {/* TODO: article body from ContentPost, contextual CTA, related posts — PLAN.md §20.11 */}
    </article>
  );
}
