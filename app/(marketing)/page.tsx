// Homepage — PLAN.md §20.1.
import Link from "next/link";
import { db } from "@/lib/db";
import { Hero } from "@/components/marketing/hero";
import { ServiceCard } from "@/components/marketing/service-card";
import { ProjectCard } from "@/components/marketing/project-card";
import { Testimonial } from "@/components/marketing/testimonial";
import { PricingCard } from "@/components/marketing/pricing-card";
import { CtaBlock } from "@/components/marketing/cta-block";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";
import { services } from "@/config/services";
import { packagesByCategory } from "@/config/packages";

export default async function HomePage() {
  const [featuredWork, testimonials] = await Promise.all([
    db.caseStudy.findMany({ where: { publishedAt: { not: null } }, orderBy: { publishedAt: "desc" }, take: 3 }),
    db.testimonial.findMany({ where: { approvedAt: { not: null } }, orderBy: { approvedAt: "desc" }, take: 2 }),
  ]);

  const pricingTeaser = packagesByCategory("Websites").filter((pkg) => pkg.tier !== "CUSTOM");

  return (
    <>
      <Hero
        eyebrow="Forge Digital"
        headline="Built to last."
        subhead="We build the digital presence your business has earned — designed with craft, delivered with process, maintained as a partner, not a vendor."
        primaryCta={{ label: "Get a quote", href: "/contact" }}
        secondaryCta={{ label: "See our work", href: "/work" }}
      />

      <Section
        eyebrow="What we do"
        heading="Eight services, one accountable team"
        body="No finger-pointing between 'the designer' and 'the developer' — one team owns your project end to end."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} compact />
          ))}
        </div>
      </Section>

      <Section eyebrow="How it works" heading="A process you can actually see">
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {["Discovery", "Design", "Build", "Delivery"].map((step, index) => (
            <li key={step} className="rounded-lg border border-border p-4">
              <span className="text-sm font-semibold text-primary">0{index + 1}</span>
              <p className="mt-2 font-medium">{step}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6">
          <Link href="/process" className="text-sm font-medium underline">
            See the full process →
          </Link>
        </p>
      </Section>

      <Section eyebrow="Work" heading="Recent projects">
        {featuredWork.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredWork.map((caseStudy) => (
              <ProjectCard key={caseStudy.id} caseStudy={caseStudy} />
            ))}
          </div>
        ) : (
          <EmptyState title="First case studies coming soon" description="We're just getting started — check back soon, or see our current process instead." />
        )}
      </Section>

      {testimonials.length > 0 && (
        <Section eyebrow="Clients" heading="What it's like to work with us">
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <Testimonial key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </Section>
      )}

      <Section eyebrow="Pricing" heading="Transparent, productized pricing" body="Every price, scope, and timeline is written down — no surprise invoices.">
        <div className="grid gap-6 sm:grid-cols-3">
          {pricingTeaser.map((pkg) => (
            <PricingCard key={pkg.name} pkg={pkg} />
          ))}
        </div>
        <p className="mt-6">
          <Link href="/pricing" className="text-sm font-medium underline">
            See full pricing →
          </Link>
        </p>
      </Section>

      <CtaBlock />
    </>
  );
}
