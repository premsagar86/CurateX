// About — PLAN.md §20.6, §11.
import { Section } from "@/components/ui/section";
import { Avatar } from "@/components/ui/avatar";
import { CtaBlock } from "@/components/marketing/cta-block";
import Link from "next/link";

const FOUNDERS = [
  {
    name: "Bavana Sruthi",
    role: "Co-Founder & Design Lead",
    blurb: "",
  },
  {
    name: "Selvin Joel",
    role: "Co-Founder & Engineering Lead",
    blurb: "",
  },
  {
    name: "Prem Sagar",
    role: "CEO & Co-Founder",
    blurb: "",
  },
];

const VALUES = [
  { title: "Craft over speed-for-its-own-sake", detail: "Timelines are realistic, not artificially compressed to win deals." },
  { title: "Radical clarity", detail: "Every price, scope, and timeline is written down." },
  { title: "Accountability", detail: "One team, one point of contact — no finger-pointing between 'the designer' and 'the developer'." },
  { title: "Sustainable ambition", detail: "Growth the team can deliver on, not growth for its own sake." },
];

export default function AboutPage() {
  return (
    <>
      <Section
        heading="About Forge Digital"
        body="Forge Digital started because three people kept seeing the same problem from different sides of the table: talented freelancers with no system behind them, and small businesses paying agency prices for freelancer-level accountability — or the reverse. Forge exists to be the version of a digital studio that treats a growing business's website, brand, and online presence the way it deserves to be treated: as something built once, built well, and built to keep working."
      />

      <Section heading="Founders">
        <div className="grid gap-4 sm:grid-cols-3">
          {FOUNDERS.map((founder) => (
            <div key={founder.name} className="rounded-lg border border-border p-8 text-center transition hover:scale-105 duration-1000 hover:border-zinc-700">
              <Avatar name={founder.name} size="lg" className="mx-auto" />
              <p className="mt-3 font-medium">{founder.name}</p>
              <p className="text-sm text-primary">{founder.role}</p>
              <p className="mt-2 text-sm text-text-muted">{founder.blurb}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section heading="Values">
        <div className="grid gap-4 sm:grid-cols-2">
          {VALUES.map((value) => (
            <div key={value.title} className="rounded-lg border border-border p-4">
              <p className="font-medium">{value.title}</p>
              <p className="mt-1 text-sm text-text-muted">{value.detail}</p>
            </div>
          ))}
        </div>
        <p className="mt-4">
          <Link href="/process" className="text-sm font-medium underline">
            See how we actually work →
          </Link>
        </p>
      </Section>

      <CtaBlock />
    </>
  );
}
