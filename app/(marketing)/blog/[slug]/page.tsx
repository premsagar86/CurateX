// Blog Post — PLAN.md §20.11.
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Section } from "@/components/ui/section";
import { CtaBlock } from "@/components/marketing/cta-block";

// DB-backed — render per request so `next build` needs no database. See PLAN: CI build fix.
export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await db.contentPost.findUnique({
    where: { slug: params.slug },
    include: { author: true },
  });

  if (!post || !post.publishedAt) notFound();

  const related = await db.contentPost.findMany({
    where: { publishedAt: { not: null }, id: { not: post.id } },
    orderBy: { publishedAt: "desc" },
    take: 2,
  });

  return (
    <>
      <Section
        eyebrow={post.publishedAt?.toLocaleDateString("en-IN")}
        heading={post.title}
        body={`By ${post.author.name}`}
      >
        <div className="prose max-w-none whitespace-pre-wrap text-text">{post.body}</div>
      </Section>

      <CtaBlock heading="Want something like this for your business?" ctaLabel="See our services" ctaHref="/services" />

      {related.length > 0 && (
        <Section heading="Related posts">
          <ul className="flex flex-col gap-2">
            {related.map((r) => (
              <li key={r.id}>
                <a href={`/blog/${r.slug}`} className="underline">
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  );
}
