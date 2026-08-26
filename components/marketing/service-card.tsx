// Service Card — represents one service on the Services page/homepage grid.
// Price is always shown (§02.5 transparent pricing) — a Service Card with no
// price is a content-model violation, PLAN.md §16.5.
import Link from "next/link";
import { Card } from "@/components/ui/card";
import type { Service } from "@/config/services";
import { packages } from "@/config/packages";

export function ServiceCard({ service, compact = false }: { service: Service; compact?: boolean }) {
  const startingPrice = packages
    .filter((pkg) => pkg.serviceSlug === service.slug && pkg.priceInRupees !== null)
    .reduce<number | null>((min, pkg) => (min === null || (pkg.priceInRupees as number) < min ? pkg.priceInRupees : min), null);

  return (
    <Link href={`/services/${service.slug}`}>
      <Card interactive className="h-full">
        <h3 className="font-display text-lg">{service.name}</h3>
        <p className="mt-2 text-sm text-text-muted">{service.oneLiner}</p>
        {!compact && startingPrice && (
          <p className="mt-4 text-sm font-medium">Starting at ₹{startingPrice.toLocaleString("en-IN")}</p>
        )}
      </Card>
    </Link>
  );
}
