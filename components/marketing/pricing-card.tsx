// Pricing Card — represents one package tier (§08). Exclusions are always
// present, even if collapsed by default — omitting them contradicts §08.5.
// PLAN.md §16.5.
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Package } from "@/config/packages";

export function PricingCard({ pkg }: { pkg: Package }) {
  return (
    <Card className="flex h-full flex-col">
      <p className="text-sm font-semibold uppercase tracking-wide text-primary">{pkg.tier}</p>
      <h3 className="mt-1 font-display text-xl">{pkg.name}</h3>
      <p className="mt-3 text-2xl font-semibold">
        {pkg.priceInRupees !== null ? `₹${pkg.priceInRupees.toLocaleString("en-IN")}` : "Custom quote"}
        {pkg.cadence === "monthly" && pkg.priceInRupees !== null && (
          <span className="text-base font-normal text-text-muted">/month</span>
        )}
      </p>
      {pkg.note && <p className="mt-1 text-xs text-text-muted">{pkg.note}</p>}

      <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm">
        {pkg.includes.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden className="text-success">✓</span>
            {item}
          </li>
        ))}
      </ul>

      {pkg.excludes.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-text-muted">What&apos;s not included</summary>
          <ul className="mt-2 flex flex-col gap-2 text-sm text-text-muted">
            {pkg.excludes.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden>–</span>
                {item}
              </li>
            ))}
          </ul>
        </details>
      )}

      <Link href="/contact" className={cn(buttonVariants(), "mt-6")}>
        Get a quote
      </Link>
    </Card>
  );
}
