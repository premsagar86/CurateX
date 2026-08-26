// Pricing — PLAN.md §20.8.
import { Section } from "@/components/ui/section";
import { PricingCard } from "@/components/marketing/pricing-card";
import { Accordion } from "@/components/ui/accordion";
import { CtaBlock } from "@/components/marketing/cta-block";
import { packagesByCategory, type Package } from "@/config/packages";

const CATEGORIES: Package["category"][] = ["Websites", "Branding", "Social & Content", "SEO & Maintenance"];

const FAQ = [
  { question: "How many revisions do I get?", answer: "Every package states a fixed revision-round limit up front — we don't offer unlimited revisions, since that structurally reproduces scope creep for everyone." },
  { question: "What's not included in a package?", answer: "Each pricing card lists its exclusions — click \"What's not included\" on any card. Third-party costs (domain, hosting, ad spend) are always passed through at cost, never silently absorbed." },
  { question: "How do I pay?", answer: "Currently manual/offline payment (bank transfer or UPI) — a milestone-based schedule is agreed in your proposal before work starts." },
  { question: "Can I get a custom quote outside these tiers?", answer: "Yes — Enterprise/Custom work is scoped per discovery call with a stated price floor, defined in a signed statement of work." },
];

export default function PricingPage() {
  return (
    <>
      <Section heading="Pricing" body="Every price, scope, and timeline is written down before work starts — no surprise invoices.">
        {CATEGORIES.map((category) => {
          const pkgs = packagesByCategory(category);
          if (pkgs.length === 0) return null;
          return (
            <div key={category} className="mb-12">
              <h3 className="mb-4 font-display text-xl">{category}</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pkgs.map((pkg) => (
                  <PricingCard key={pkg.name} pkg={pkg} />
                ))}
              </div>
            </div>
          );
        })}

        <div className="mt-8 rounded-lg border border-primary/30 bg-primary/5 p-6 text-center">
          <p className="font-medium">Need something outside these tiers?</p>
          <p className="mt-1 text-sm text-text-muted">Enterprise/Custom work is scoped per discovery call, with a stated floor of ₹2,50,000.</p>
        </div>
      </Section>

      <Section heading="Pricing FAQ">
        <Accordion items={FAQ} />
      </Section>

      <CtaBlock />
    </>
  );
}
