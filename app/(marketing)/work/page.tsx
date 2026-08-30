// Portfolio / Work — PLAN.md §20.4.
import { db } from "@/lib/db";
import { Section } from "@/components/ui/section";
import { CtaBlock } from "@/components/marketing/cta-block";
import { WorkGrid } from "@/components/marketing/work-grid";

// DB-backed — cached via ISR (revalidate) so most requests render without a
// database round trip; `next build` still needs no database. See PLAN: CI build fix.
export const revalidate = 300;

export default async function WorkPage() {
  const caseStudies = await db.caseStudy.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    select: { id: true, slug: true, title: true, services: true },
  });

  return (
    <>
      <Section heading="Work" body="A look at what we've shipped, filtered by service.">
        <WorkGrid caseStudies={caseStudies} />
      </Section>
      <CtaBlock />
    </>
  );
}
