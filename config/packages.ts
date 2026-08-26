// Structured source of truth for service/package pricing — PLAN.md §26.7,
// §21.3. Service pages and the pricing page render from this file rather
// than independently-maintained marketing copy.
export interface Package {
  tier: "STARTER" | "GROWTH" | "PREMIUM" | "CUSTOM";
  serviceSlug: string;
  name: string;
  priceInRupees: number | null; // null => "custom quote" (§08.1 states a floor price separately)
  includes: string[];
  excludes: string[];
  revisionLimit: number;
}

export const packages: Package[] = [
  // TODO: populate from PLAN.md §08 (Service Packages) — placeholder shape only.
];
