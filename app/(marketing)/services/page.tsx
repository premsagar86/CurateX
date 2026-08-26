// Services Overview — PLAN.md §20.2.
import { Section } from "@/components/ui/section";
import { ServiceCard } from "@/components/marketing/service-card";
import { CtaBlock } from "@/components/marketing/cta-block";
import { services } from "@/config/services";

export default function ServicesPage() {
  return (
    <>
      <Section
        heading="Services"
        body="We keep a narrow menu on purpose — eight services we're genuinely good at, delivered by one accountable team, instead of a long list stretched thin across freelancers who've never worked together."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Section>
      <CtaBlock
        heading="Not sure what you need?"
        support="Book a free consult and we'll help you figure out the right starting point."
        ctaLabel="Book a free consult"
      />
    </>
  );
}
