// Seeds portfolio case studies for the /work section (PLAN.md §20.4, §21.5).
// There is no admin CRUD for case studies yet, so this script is the way to add
// or update portfolio entries. It is idempotent — it upserts by slug, so
// re-running only refreshes copy / tags on existing rows.
//
// Run with:  npx tsx scripts/seed-case-studies.ts
import { Prisma, ServiceType } from "@prisma/client";
import { db } from "../lib/db";

interface CaseStudySeed {
  slug: string;
  title: string;
  liveUrl: string;
  services: ServiceType[];
  challenge: string;
  approach: string;
  outcome: string;
}

// §21.5 — every entry names a specific problem, states the actual approach (not
// "we designed a beautiful website"), and gives an honestly-attributable outcome
// with no invented metrics.
const caseStudies: CaseStudySeed[] = [
  {
    slug: "premsagar-developer-portfolio",
    title: "Eedubilli Premsagar — Full-Stack Developer Portfolio",
    liveUrl: "https://myportfolio-gamma-eosin.vercel.app/",
    services: [ServiceType.WEBSITE, ServiceType.BRANDING],
    challenge:
      "A full-stack developer needed a personal site that makes their capability legible to hiring managers and prospective clients in under a minute — without a wall of framework logos or a generic template that says nothing about the work behind it.",
    approach:
      "We built a single-page site in Next.js and Tailwind CSS with a restrained visual identity — one accent colour, a consistent type scale, generous spacing — and structured it around evidence rather than adjectives: a short positioning line, project write-ups that each state the actual technical problem solved (token-rotation auth with Redis caching, an agency portal, an event platform), and direct contact routes. Deployed on Vercel.",
    outcome:
      "A reviewer gets a clear read on stack depth and delivery history from the first screen. The site also serves as the reference visual identity — colour, type, spacing — reused consistently across the developer's other projects.",
  },
  {
    slug: "techspark-2026-event-platform",
    title: "TechSpark 2026 — College Tech-Fest Event Platform",
    liveUrl: "https://tech-spark-zeta.vercel.app/",
    services: [ServiceType.WEBSITE, ServiceType.UI_UX_DESIGN],
    challenge:
      "A college technical festival needed a public site that could carry event information and channel students into registering for individual competitions, with content changing week to week as the schedule firmed up.",
    approach:
      "We designed the registration and event-browsing flows first — what a student sees from landing on the site to being signed up for a specific competition — then built the front end in Next.js and Tailwind CSS against that flow. Components were kept simple enough that non-developers on the organising committee could update event details. Deployed on Vercel.",
    outcome:
      "TechSpark 2026 has a single, current home for event details and competition sign-ups, replacing a scattered posters-and-forms approach. The same flow-first structure can be carried into the next edition of the fest.",
  },
];

async function main() {
  for (const { slug, services, ...rest } of caseStudies) {
    const data = {
      ...rest,
      services: services as unknown as Prisma.InputJsonValue,
      publishedAt: new Date(),
    };

    await db.caseStudy.upsert({
      where: { slug },
      create: { slug, ...data },
      update: data,
    });

    console.log(`upserted case study: ${slug}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
