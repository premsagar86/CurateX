// Service Card — represents one service on the Services page grid.
// Price is always shown (§02.5 transparent pricing) — a Service Card with no
// price is a content-model violation, PLAN.md §16.5.
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { Service } from "@/config/services";
import { packages } from "@/config/packages";

// Tight labels for the 2-up mobile grid so the title stays on one line
// inside the box. Full names return at sm+ where the card is far wider.
const SHORT_NAMES: Record<string, string> = {
  "website-design-development": "Web Design",
  "ui-ux-design": "UI / UX",
  "branding-visual-identity": "Branding",
  "graphic-design-marketing-creatives": "Graphic Design",
  "social-media-management": "Social Media",
  "content-creation": "Content",
  seo: "SEO",
  "ecommerce-builds": "E-commerce",
};

export function ServiceCard({ service, compact = false }: { service: Service; compact?: boolean }) {
  const startingPrice = packages
    .filter((pkg) => pkg.serviceSlug === service.slug && pkg.priceInRupees !== null)
    .reduce<number | null>((min, pkg) => (min === null || (pkg.priceInRupees as number) < min ? pkg.priceInRupees : min), null);

  return (
    <Link href={`/services/${service.slug}`} className="group block h-full">
      <Card
        interactive
        className="relative flex h-full min-h-[6.5rem] min-w-0 flex-col overflow-hidden rounded-lg p-4 transition duration-300 group-hover:border-primary/45 sm:min-h-0 sm:p-6 sm:group-hover:bg-surface-elevated"
      >
        {/* Subtle warm wash on hover — reads as a colour shift, not a flare. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-primary/[0.07] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Content stays fully visible on hover; only the "Explore more"
            prompt (pinned to the bottom-left corner) fades in. */}
        <div className="relative flex h-full min-w-0 flex-col">
          <h3 className="truncate font-display text-sm leading-tight sm:overflow-visible sm:whitespace-normal sm:text-lg">
            <span className="sm:hidden">{SHORT_NAMES[service.slug] ?? service.name}</span>
            <span className="hidden sm:inline">{service.name}</span>
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[0.72rem] leading-snug text-text-muted sm:mt-2 sm:text-sm sm:leading-normal">
            {service.oneLiner}
          </p>
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
