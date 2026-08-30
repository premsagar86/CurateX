// Structured source of truth for the 8 Launch services — PLAN.md §07.1,
// §21.3. Home, /services, and /services/[slug] all render from this file
// rather than independently-maintained marketing copy (mirrors the same
// single-source-of-truth pattern as config/packages.ts).
import type { ServiceType } from "@prisma/client";

export interface Service {
  slug: string;
  type: ServiceType;
  name: string;
  oneLiner: string;
  whoFor: string;
  deliverables: string[];
  process: string[];
  faq: { question: string; answer: string }[];
}

export const services: Service[] = [
  {
    slug: "website-design-development",
    type: "WEBSITE",
    name: "Website Design & Development",
    oneLiner: "A credible, converting website — built once, built well.",
    whoFor:
      "Growing businesses that don't yet have a website that matches the quality of the work they actually do, or whose current site was built cheaply and never maintained.",
    deliverables: [
      "Mobile-responsive design, built for your business, not a generic template",
      "Contact form wired to a real inbox",
      "Basic on-page SEO setup",
      "A stated number of revision rounds — no unlimited-revision loop (see Pricing)",
    ],
    process: [
      "Discovery — goals, audience, content inventory",
      "Sitemap & information architecture",
      "Wireframe, then visual design in Figma",
      "Client approval",
      "Development & QA",
      "Launch",
    ],
    faq: [
      {
        question: "How long does a website take?",
        answer: "2-6 weeks depending on tier and page count, starting once we have your content — see Pricing for the breakdown per tier.",
      },
      {
        question: "Do you write the copy for us?",
        answer: "You provide content by default; copywriting is available as a paid add-on (Content Creation) if you'd rather we draft it.",
      },
      {
        question: "What happens after launch?",
        answer: "Ongoing updates and monitoring are a separate Website Maintenance retainer — the build itself doesn't include indefinite free changes.",
      },
    ],
  },
  {
    slug: "ui-ux-design",
    type: "UI_UX_DESIGN",
    name: "UI/UX Design",
    oneLiner: "Interfaces designed around how people actually use them.",
    whoFor: "Teams building an app or product who need screens designed before (or instead of) a full website build.",
    deliverables: [
      "Screen-by-screen Figma designs, scoped to an agreed screen count",
      "A clickable prototype for key flows",
      "Handoff-ready specs for your development team",
    ],
    process: ["Discovery & flow mapping", "Wireframes", "Visual design", "Prototype & handoff"],
    faq: [
      {
        question: "Can this be bundled with a website build?",
        answer: "Yes — UI/UX Design is most commonly bundled into a Website package rather than sold standalone.",
      },
      {
        question: "Do you build the product too?",
        answer: "Not in Phase 1 — custom app/product engineering is a planned future service, not something we take on today.",
      },
    ],
  },
  {
    slug: "branding-visual-identity",
    type: "BRANDING",
    name: "Branding & Visual Identity",
    oneLiner: "A visual identity your team can actually use consistently.",
    whoFor: "Businesses launching fresh, or rebranding from a logo that was never built out into a real system.",
    deliverables: [
      "Logo (primary + one alternate lockup)",
      "Color palette and typography",
      "A brand guide documenting how to use it",
    ],
    process: ["Brand strategy input", "Concept presentation", "Revisions within the stated limit", "Final guideline document"],
    faq: [
      {
        question: "How many logo concepts do we see?",
        answer: "2-3 concepts depending on tier, then revision rounds within the package limit — see Pricing.",
      },
      {
        question: "Do you design packaging or signage?",
        answer: "Packaging/signage-ready assets are part of the Premium tier only — see Pricing for what each tier includes.",
      },
    ],
  },
  {
    slug: "graphic-design-marketing-creatives",
    type: "GRAPHIC_DESIGN",
    name: "Graphic Design & Marketing Creatives",
    oneLiner: "Posters, social creatives, and sales collateral that look like they came from one brand.",
    whoFor: "Any business that needs recurring design output — event posters, sales decks, social creatives — without hiring an in-house designer.",
    deliverables: ["Batch design turnaround (2-5 days typical)", "Consistent use of your brand system", "Source files on request"],
    process: ["Brief", "Design batch", "Review & revisions"],
    faq: [
      {
        question: "Can you print and ship these for us?",
        answer: "We design the piece; printing and physical fulfillment is intentionally outside what we do — you handle print production with your own vendor.",
      },
    ],
  },
  {
    slug: "social-media-management",
    type: "SOCIAL_MEDIA",
    name: "Social Media Management & Strategy",
    oneLiner: "A consistent social presence, planned monthly and actually shipped.",
    whoFor: "Businesses whose social presence is inconsistent or has gone quiet — this is a retainer built specifically to fix that continuity gap.",
    deliverables: [
      "A monthly content calendar you approve before anything is produced",
      "12-30 posts/month depending on tier, across 1-3 platforms",
      "A monthly performance summary",
    ],
    process: ["Monthly calendar proposal", "Your approval", "Production", "Scheduled publishing", "Monthly report"],
    faq: [
      {
        question: "Do you guarantee follower growth or sales?",
        answer: "No — we never promise follower or sales outcomes. What we commit to is consistency, quality, and a documented process; those are the things we actually control.",
      },
      {
        question: "Do you manage ad spend?",
        answer: "Not in the base retainer — managed ad spend is a separate, more tightly-scoped service we're careful about taking on responsibly.",
      },
    ],
  },
  {
    slug: "content-creation",
    type: "CONTENT_CREATION",
    name: "Content Creation",
    oneLiner: "Written and short-form visual content, produced on a real cadence.",
    whoFor: "Businesses that need a steady stream of blog, caption, or short-form content without staffing a writer.",
    deliverables: ["Written content per an agreed monthly volume", "Basic visual/short-form pieces", "AI-assisted drafting, always human-reviewed before it ships"],
    process: ["Content pillar & calendar alignment", "Drafting", "Human review", "Delivery"],
    faq: [
      {
        question: "Is this AI-generated content?",
        answer: "AI assists the drafting process, but nothing ships without a human review pass against our brand voice guidelines — no unreviewed AI output goes out under your name.",
      },
    ],
  },
  {
    slug: "seo",
    type: "SEO",
    name: "SEO (On-Page + Local)",
    oneLiner: "Findable in search — without empty ranking promises.",
    whoFor: "Local and regional businesses that are effectively invisible in organic and local search results.",
    deliverables: ["A technical SEO audit", "Keyword & local-pack strategy", "On-page implementation", "Monthly content/link-building cadence", "Monthly ranking/traffic report"],
    process: ["Technical audit", "Strategy", "On-page implementation", "Ongoing monthly cadence", "Monthly reporting"],
    faq: [
      {
        question: "Can you guarantee a #1 ranking?",
        answer: "No, and we'd flag any studio that promises this — guaranteed rankings aren't something an honest SEO engagement can deliver. Every recommendation we make is traceable to an actual finding, not a generic checklist.",
      },
      {
        question: "What's the minimum commitment?",
        answer: "3 months — SEO genuinely needs that runway to show results, and we'd rather set that expectation up front than sell a 1-month engagement that can't work.",
      },
    ],
  },
  {
    slug: "ecommerce-builds",
    type: "ECOMMERCE",
    name: "E-commerce Builds",
    oneLiner: "A store built to actually sell, with a real checkout.",
    whoFor: "Product businesses that need a proper online store, not a website with a checkout bolted on afterward.",
    deliverables: ["Full catalog integration", "Payment gateway integration", "Full technical SEO setup", "30-day post-launch support window"],
    process: ["Discovery & catalog planning", "Design", "Build & payment integration", "QA", "Launch", "30-day support window"],
    faq: [
      {
        question: "Which payment gateways do you support?",
        answer: "Manual/offline payment collection today, with a live gateway integration on our roadmap — ask what's currently available for your launch timeline.",
      },
      {
        question: "What happens after the 30-day support window?",
        answer: "Ongoing content updates move to a separate Website Maintenance retainer — the 30 days covers post-launch stabilization, not indefinite free support.",
      },
    ],
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
