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

// Reads case studies / testimonials from the DB. Cached via ISR (revalidate)
// rather than `force-dynamic` so most requests render without touching Neon —
// published content changes rarely. The build still never needs a database
// connection. See PLAN: CI build fix.
export const revalidate = 300;

export default async function HomePage() {
  const [featuredWork, testimonials] = await Promise.all([
    db.caseStudy.findMany({
      where: { publishedAt: { not: null } },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: { id: true, slug: true, title: true, services: true },
    }),
    db.testimonial.findMany({
      where: { approvedAt: { not: null } },
      orderBy: { approvedAt: "desc" },
      take: 2,
      select: { id: true, quote: true, authorName: true, authorRole: true },
    }),
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
