// Structured source of truth for service/package pricing — PLAN.md §26.7,
// §21.3. Service pages and the pricing page render from this file rather
// than independently-maintained marketing copy. All prices are the
// ASSUMPTION starting prices stated in PLAN.md §08 — flagged there as
// VALIDATION REQUIRED before publishing, carried through here unchanged.
export interface Package {
  tier: "STARTER" | "GROWTH" | "PREMIUM" | "CUSTOM";
  category: "Websites" | "Branding" | "Social & Content" | "SEO & Maintenance";
  serviceSlug: string;
  name: string;
  priceInRupees: number | null; // null => "custom quote" (a floor price, if any, is in `note`)
  cadence: "one-time" | "monthly";
  includes: string[];
  excludes: string[];
  revisionLimit?: number; // omitted for retainers, which aren't revision-based
  note?: string;
}

export const packages: Package[] = [
  // Websites — PLAN.md §08.1
  {
    tier: "STARTER",
    category: "Websites",
    serviceSlug: "website-design-development",
    name: "Starter Website",
    priceInRupees: 35000,
    cadence: "one-time",
    includes: ["Up to 5 pages (Home, About, Services, Contact, one more)", "Mobile-responsive", "Contact form", "Basic on-page SEO setup"],
    excludes: ["Custom illustrations", "E-commerce functionality", "Copywriting (client provides content, or add Content Creation)", "More than 1 revision round", "Ongoing maintenance (sold separately)"],
    revisionLimit: 1,
    note: "2 weeks from content-received.",
  },
  {
    tier: "GROWTH",
    category: "Websites",
    serviceSlug: "website-design-development",
    name: "Growth Website",
    priceInRupees: 85000,
    cadence: "one-time",
    includes: ["Up to 10 pages", "Custom component design (not template)", "Blog setup", "On-page SEO", "Basic analytics setup"],
    excludes: ["E-commerce (see E-commerce package)", "Copywriting beyond light editing", "More than 2 revision rounds"],
    revisionLimit: 2,
    note: "3-4 weeks from content-received.",
  },
  {
    tier: "PREMIUM",
    category: "Websites",
    serviceSlug: "ecommerce-builds",
    name: "Premium Website / E-commerce",
    priceInRupees: 180000,
    cadence: "one-time",
    includes: ["Up to 20 pages or full e-commerce catalog", "Payment gateway integration", "Custom animations/interactions", "Full SEO technical setup", "30-day post-launch support window"],
    excludes: ["Custom backend systems beyond standard e-commerce (see Enterprise/Custom)", "Ongoing content updates after the 30-day window (retainer)"],
    revisionLimit: 3,
    note: "5-6 weeks from content-received.",
  },
  {
    tier: "CUSTOM",
    category: "Websites",
    serviceSlug: "website-design-development",
    name: "Enterprise / Custom",
    priceInRupees: null,
    cadence: "one-time",
    includes: ["Fully scoped per discovery call — no fixed inclusion list"],
    excludes: ["Scope is defined per-project in a signed statement of work"],
    note: "Custom quote, stated floor of ₹2,50,000.",
  },

  // Branding — PLAN.md §08.2
  {
    tier: "STARTER",
    category: "Branding",
    serviceSlug: "branding-visual-identity",
    name: "Starter Brand Kit",
    priceInRupees: 25000,
    cadence: "one-time",
    includes: ["Logo (primary + 1 alternate lockup)", "Color palette", "2 fonts", "Basic 1-page brand guide", "2 concepts presented"],
    excludes: ["Full brand strategy workshop", "Stationery/collateral design", "Brand voice/messaging documentation (see Growth tier)"],
    revisionLimit: 2,
  },
  {
    tier: "GROWTH",
    category: "Branding",
    serviceSlug: "branding-visual-identity",
    name: "Growth Brand Identity",
    priceInRupees: 65000,
    cadence: "one-time",
    includes: ["Everything in Starter", "Brand strategy session", "Brand voice/messaging guide", "Business card/letterhead/social template kit", "Full brand guideline document"],
    excludes: ["Packaging/signage-ready assets (see Premium tier)"],
    revisionLimit: 2,
  },
  {
    tier: "PREMIUM",
    category: "Branding",
    serviceSlug: "branding-visual-identity",
    name: "Premium Brand System",
    priceInRupees: 140000,
    cadence: "one-time",
    includes: ["Everything in Growth", "Packaging/signage-ready assets", "Extended icon/pattern system", "Presentation template", "3 concepts presented"],
    excludes: [],
    revisionLimit: 3,
  },

  // Social Media & Content Retainers — PLAN.md §08.3
  {
    tier: "STARTER",
    category: "Social & Content",
    serviceSlug: "social-media-management",
    name: "Starter Retainer",
    priceInRupees: 18000,
    cadence: "monthly",
    includes: ["12 posts/month (mix of static + basic motion)", "1 platform", "Monthly content calendar approval", "Monthly performance summary"],
    excludes: ["Paid ad management", "Video editing beyond basic reels", "Community management outside business hours"],
  },
  {
    tier: "GROWTH",
    category: "Social & Content",
    serviceSlug: "social-media-management",
    name: "Growth Retainer",
    priceInRupees: 35000,
    cadence: "monthly",
    includes: ["20 posts/month", "2 platforms", "Content calendar + 1 short-form video/week", "Monthly strategy call", "Monthly report with recommendations"],
    excludes: ["Paid ad spend management (add-on)", "Influencer outreach"],
  },
  {
    tier: "PREMIUM",
    category: "Social & Content",
    serviceSlug: "social-media-management",
    name: "Premium Retainer",
    priceInRupees: 60000,
    cadence: "monthly",
    includes: ["30 posts/month", "Up to 3 platforms", "2 short-form videos/week", "Community management during business hours", "Quarterly strategy deep-dive"],
    excludes: ["Ad spend itself (client pays platform directly)"],
  },

  // Maintenance & SEO Retainers — PLAN.md §08.4
  {
    tier: "STARTER",
    category: "SEO & Maintenance",
    serviceSlug: "website-design-development",
    name: "Website Maintenance",
    priceInRupees: 6000,
    cadence: "monthly",
    includes: ["Uptime monitoring", "Security/plugin updates (if applicable)", "Monthly content updates (up to 2 hours)", "Monthly backup verification"],
    excludes: ["New feature development (quoted separately)", "Design changes beyond minor text/image swaps"],
  },
  {
    tier: "STARTER",
    category: "SEO & Maintenance",
    serviceSlug: "seo",
    name: "SEO Retainer",
    priceInRupees: 20000,
    cadence: "monthly",
    includes: ["Ongoing technical + content SEO"],
    excludes: [],
    note: "Minimum 3-month commitment — SEO needs time to show results.",
  },
];

export function packagesByCategory(category: Package["category"]) {
  return packages.filter((pkg) => pkg.category === category);
}
