// Blog Index — PLAN.md §20.10.
import Link from "next/link";
import { db } from "@/lib/db";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

// DB-backed — render per request so `next build` needs no database. See PLAN: CI build fix.
export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const posts = await db.contentPost.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });

  const [featured, ...rest] = posts;

  return (
    <Section heading="Blog">
      {posts.length === 0 ? (
        <EmptyState title="No posts published yet" description="Check back soon for insights on branding, web, and growth for Indian SMBs." />
      ) : (
        <div className="flex flex-col gap-8">
          {featured && (
            <Link href={`/blog/${featured.slug}`}>
              <Card interactive>
                <p className="text-sm text-text-muted">{featured.publishedAt?.toLocaleDateString("en-IN")}</p>
                <h2 className="mt-2 font-display text-2xl">{featured.title}</h2>
                <p className="mt-2 text-text-muted">{featured.metaDescription}</p>
              </Card>
            </Link>
          )}
          {rest.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card interactive className="h-full">
                    <p className="text-xs text-text-muted">{post.publishedAt?.toLocaleDateString("en-IN")}</p>
                    <h3 className="mt-2 font-display text-lg">{post.title}</h3>
                    <p className="mt-2 text-sm text-text-muted">{post.metaDescription}</p>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </Section>
  );
}
