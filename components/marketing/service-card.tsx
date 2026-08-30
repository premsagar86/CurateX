// Service Card — represents one service on the Services page grid.
// Price is always shown (§02.5 transparent pricing) — a Service Card with no
// price is a content-model violation, PLAN.md §16.5.
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { Service } from "@/config/services";
import { packages } from "@/config/packages";

// Short labels for the compact mobile grid (4 across, 2 rows). Full names
// return at sm+ where the card also carries the one-liner and price.
const SHORT_NAMES: Record<string, string> = {
  "website-design-development": "Web Design",
  "ui-ux-design": "UI / UX",
  "branding-visual-identity": "Branding",
  "graphic-design-marketing-creatives": "Graphic",
  "social-media-management": "Social",
  "content-creation": "Content",
  seo: "SEO",
  "ecommerce-builds": "Ecommerce",
};

export function ServiceCard({ service, compact = false }: { service: Service; compact?: boolean }) {
  const startingPrice = packages
    .filter((pkg) => pkg.serviceSlug === service.slug && pkg.priceInRupees !== null)
    .reduce<number | null>((min, pkg) => (min === null || (pkg.priceInRupees as number) < min ? pkg.priceInRupees : min), null);

  return (
    <Link href={`/services/${service.slug}`} className="group block h-full">
      <Card
        interactive
        className="relative flex h-full min-h-[4.75rem] flex-col overflow-hidden rounded-md p-3 transition duration-300 group-hover:border-primary/45 sm:min-h-0 sm:rounded-lg sm:p-6 sm:group-hover:bg-surface-elevated"
      >
        {/* Subtle warm wash on hover — reads as a colour shift, not a flare. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-primary/[0.07] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Content stays fully visible on hover; only the "Explore more"
            prompt (pinned to the bottom-left corner) fades in. */}
        <div className="relative flex h-full flex-col">
          <h3 className="break-words font-display text-[0.82rem] leading-[1.15] sm:text-lg sm:leading-tight">
            <span className="sm:hidden">{SHORT_NAMES[service.slug] ?? service.name}</span>
            <span className="hidden sm:inline">{service.name}</span>
          </h3>
          <p className="mt-2 hidden text-sm text-text-muted sm:block">{service.oneLiner}</p>
          {!compact && startingPrice && (
            <p className="mt-4 hidden text-sm font-medium sm:block">
              Starting at ₹{startingPrice.toLocaleString("en-IN")}
            </p>
          )}
          <span className="mt-auto hidden items-center gap-1.5 pt-5 text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:inline-flex">
            Explore more <span aria-hidden>&rarr;</span>
          </span>
        </div>
      </Card>
    </Link>
  );
}
