// Individual Service Page — PLAN.md §20.3.
import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { Hero } from "@/components/marketing/hero";
import { Section } from "@/components/ui/section";
import { PricingCard } from "@/components/marketing/pricing-card";
import { ProjectCard } from "@/components/marketing/project-card";
import { Accordion } from "@/components/ui/accordion";
import { CtaBlock } from "@/components/marketing/cta-block";
import { EmptyState } from "@/components/ui/empty-state";
import { getServiceBySlug } from "@/config/services";
import { packages } from "@/config/packages";

// Reads case studies from the DB — render per request so `next build` needs no
// database connection. (No generateStaticParams: enumerated params would force
// build-time prerender of this route, which is exactly what we're avoiding.)
// See PLAN: CI build fix.
export const dynamic = "force-dynamic";

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const servicePackages = packages.filter((pkg) => pkg.serviceSlug === service.slug);
  const relatedWork = await db.caseStudy.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });
  const filteredWork = relatedWork
    .filter((cs) => ((cs.services as string[] | null) ?? []).includes(service.type))
    .slice(0, 3);

  return (
    <>
      <Hero
        eyebrow={service.name}
        headline={service.oneLiner}
        primaryCta={{ label: `Get a quote for ${service.name}`, href: "/contact" }}
      />

      <Section heading="Who this is for" body={service.whoFor} />

      <Section heading="What's included">
        <ul className="grid gap-3 sm:grid-cols-2">
          {service.deliverables.map((item) => (
            <li key={item} className="flex gap-2 text-sm">
              <span aria-hidden className="text-success">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </Section>

      <Section heading="How it works">
        <ol className="flex flex-col gap-3">
          {service.process.map((step, index) => (
            <li key={step} className="flex gap-3 text-sm">
              <span className="font-semibold text-primary">{index + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </Section>

      {servicePackages.length > 0 && (
        <Section heading="Pricing snapshot">
          <div className="grid gap-6 sm:grid-cols-3">
            {servicePackages.map((pkg) => (
              <PricingCard key={pkg.name} pkg={pkg} />
            ))}
          </div>
          <p className="mt-6">
            <Link href="/pricing" className="text-sm font-medium underline">
              See combined package pricing →
            </Link>
          </p>
        </Section>
      )}

      <Section heading="Related work">
        {filteredWork.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-3">
            {filteredWork.map((caseStudy) => (
              <ProjectCard key={caseStudy.id} caseStudy={caseStudy} />
            ))}
          </div>
        ) : (
          <EmptyState title="No published projects for this service yet" />
        )}
      </Section>

      {service.faq.length > 0 && (
        <Section heading="Frequently asked questions">
          <Accordion items={service.faq.map((f) => ({ question: f.question, answer: f.answer }))} />
        </Section>
      )}

      <CtaBlock />
    </>
  );
}
