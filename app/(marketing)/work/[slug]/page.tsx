// Case Study Detail — PLAN.md §20.5.
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Section } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { Testimonial } from "@/components/marketing/testimonial";
import { ProjectCard } from "@/components/marketing/project-card";
import { CtaBlock } from "@/components/marketing/cta-block";
import { services } from "@/config/services";
import type { ServiceType } from "@prisma/client";

// DB-backed — cached via ISR (revalidate); unknown slugs render on-demand then
// cache. `next build` still needs no database. See PLAN: CI build fix.
export const revalidate = 300;

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const caseStudy = await db.caseStudy.findUnique({
    where: { slug: params.slug },
    include: { testimonial: true },
  });

  if (!caseStudy || !caseStudy.publishedAt) notFound();

  const serviceTypes = (caseStudy.services as ServiceType[] | null) ?? [];

  const related = serviceTypes.length
    ? (
        await db.caseStudy.findMany({
          where: { publishedAt: { not: null }, id: { not: caseStudy.id } },
          orderBy: { publishedAt: "desc" },
          take: 10,
        })
      )
        .filter((cs) => ((cs.services as ServiceType[] | null) ?? []).some((t) => serviceTypes.includes(t)))
        .slice(0, 3)
    : [];

  return (
    <>
      <Section
        eyebrow={serviceTypes.map((t) => services.find((s) => s.type === t)?.name).filter(Boolean).join(" · ")}
        heading={caseStudy.title}
      >
        <div className="flex flex-wrap gap-2">
          {serviceTypes.map((t) => {
            const service = services.find((s) => s.type === t);
            return service ? <Badge key={t}>{service.name}</Badge> : null;
          })}
        </div>
        <div className="mt-4 flex aspect-video items-center justify-center rounded-lg border border-dashed border-border bg-surface-elevated text-sm text-text-muted">
          Project visual
        </div>
      </Section>

      <Section heading="The challenge" body={caseStudy.challenge} />
      <Section heading="Our approach" body={caseStudy.approach} />
      <Section heading="The outcome" body={caseStudy.outcome} />

      {caseStudy.testimonial && (
        <Section heading="From the client">
          <Testimonial testimonial={caseStudy.testimonial} />
        </Section>
      )}

      {related.length > 0 && (
        <Section heading="Related work">
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((cs) => (
              <ProjectCard key={cs.id} caseStudy={cs} />
            ))}
          </div>
        </Section>
      )}

      <CtaBlock />
    </>
  );
}
