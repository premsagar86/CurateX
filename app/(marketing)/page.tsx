// Homepage — PLAN.md §20.1. Experimental bento/motion redesign: composition
// only pulls the same server-fetched data as before, but renders it through
// components/home/* rather than the shared marketing primitives (those stay
// unchanged for /services, /work, /pricing, etc).
import { db } from "@/lib/db";
import { HeroBento } from "@/components/home/hero-bento";
import { ServicesBento } from "@/components/home/services-bento";
import { ProcessHorizontal } from "@/components/home/process-horizontal";
import { WorkScatter } from "@/components/home/work-scatter";
import { TestimonialsFloat } from "@/components/home/testimonials-float";
import { PricingBento } from "@/components/home/pricing-bento";
import { CtaFinale } from "@/components/home/cta-finale";
import { services } from "@/config/services";
import { packagesByCategory } from "@/config/packages";
import type { ServiceType } from "@prisma/client";

// Reads case studies / testimonials from the DB — render per request so the
// build never needs a database connection. See PLAN: CI build fix.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredWork, testimonials] = await Promise.all([
    db.caseStudy.findMany({ where: { publishedAt: { not: null } }, orderBy: { publishedAt: "desc" }, take: 3 }),
    db.testimonial.findMany({ where: { approvedAt: { not: null } }, orderBy: { approvedAt: "desc" }, take: 2 }),
  ]);

  const pricingTeaser = packagesByCategory("Websites").filter((pkg) => pkg.tier !== "CUSTOM");

  const workItems = featuredWork.map((caseStudy) => {
    const serviceTypes = (caseStudy.services as ServiceType[] | null) ?? [];
    return {
      id: caseStudy.id,
      slug: caseStudy.slug,
      title: caseStudy.title,
      services: serviceTypes
        .map((type) => services.find((s) => s.type === type)?.name)
        .filter((name): name is string => Boolean(name)),
    };
  });

  const testimonialItems = testimonials.map((testimonial) => ({
    id: testimonial.id,
    quote: testimonial.quote,
    authorName: testimonial.authorName,
    authorRole: testimonial.authorRole,
  }));

  return (
    <div className="home-experimental relative overflow-clip">
      <HeroBento />
      <ServicesBento services={services} />
      <ProcessHorizontal />
      <WorkScatter items={workItems} />
      <TestimonialsFloat testimonials={testimonialItems} />
      <PricingBento packages={pricingTeaser} />
      <CtaFinale />
    </div>
  );
}
