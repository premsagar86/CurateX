"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Service } from "@/config/services";
import { revealBatch } from "./motion/reveal-batch";
import { useTilt } from "./motion/use-tilt";

// Cursor-follow hover glow, cycled through the brand palette (Ember / Spark /
// Steel — site.md §9.1). Softened so it reads as a highlight, not a flare.
const GLOW_COLORS = ["rgba(217,98,43,0.16)", "rgba(242,169,59,0.16)", "rgba(120,138,150,0.22)"];

// Tight labels for the 2-up mobile grid so the title always sits on one line
// inside the box. Full names return at sm+ where the tile is far wider.
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

function ServiceTile({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref as React.RefObject<HTMLElement>, 6);

  const number = String(index + 1).padStart(2, "0");

  return (
    <div
      className="h-full sm:animate-float"
      style={{
        animationDelay: `${(index % 4) * -1.5}s`,
        animationDuration: `${8 + (index % 3)}s`,
      }}
    >
      <div
        ref={ref}
        data-reveal
        className="group relative flex h-full min-h-[7.5rem] flex-col overflow-hidden rounded-lg border border-home-border bg-home-surface p-4 transition-colors duration-300 hover:border-primary/45 sm:min-h-[16rem] sm:p-6 sm:hover:bg-home-surface-2"
      >
        {/* Cursor-follow highlight. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(260px circle at var(--mx,50%) var(--my,50%), ${GLOW_COLORS[index % GLOW_COLORS.length]}, transparent 70%)`,
          }}
        />

        {/* Subtle full-card warm wash on hover — reads as a colour shift, not
            a flare. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-primary/[0.07] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        {/* Editorial index numeral — sm+ only; it would blow out the smaller
            mobile tile. */}
        <span
          aria-hidden
          className="decor-numeral absolute bottom-3 right-4 z-0 hidden sm:block sm:text-[7rem]"
        >
          {number}
        </span>

        {/* Content — fixed order: eyebrow → title → description → action. Stays
            fully visible on hover; only the "Explore more" prompt (pinned to
            the bottom-left corner) fades in. */}
        <Link
          href={`/services/${service.slug}`}
          className="relative z-[1] flex h-full min-w-0 flex-col focus-visible:outline-none"
        >
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-primary/80 sm:text-xs sm:tracking-[0.18em]">
            {number}
          </span>
          <h3 className="mt-1.5 truncate font-display text-sm leading-tight text-home-text sm:mt-3 sm:overflow-visible sm:whitespace-normal sm:pr-10 sm:text-xl">
            <span className="sm:hidden">{SHORT_NAMES[service.slug] ?? service.name}</span>
            <span className="hidden sm:inline">{service.name}</span>
          </h3>
          <p className="mt-1.5 line-clamp-2 text-[0.72rem] leading-snug text-home-muted sm:mt-2 sm:line-clamp-2 sm:pr-12 sm:text-sm sm:leading-relaxed">
            {service.oneLiner}
          </p>
          <span className="mt-auto hidden items-center gap-1.5 pt-5 text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:inline-flex">
            Explore more <span aria-hidden>&rarr;</span>
          </span>
        </Link>
      </div>
    </div>
  );
}

export function ServicesBento({ services }: { services: Service[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const mm = revealBatch(containerRef.current, "[data-reveal]", {
      from: { y: 60, rotate: -2 },
      stagger: 0.05,
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="section-y relative mx-auto max-w-container px-6">
      <div className="mb-6 max-w-2xl md:mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">What we do</p>
        <h2 className="mt-3 font-display text-display-2 text-home-text">Eight services, one accountable team</h2>
        <p className="mt-3 max-w-prose text-home-muted">
          No finger-pointing between &ldquo;the designer&rdquo; and &ldquo;the developer&rdquo; — one team owns
          your project end to end.
        </p>
      </div>

      {/* Mobile: 2-up grouped cards (title on one line + a short teaser);
          lg: the full 4-up bento. */}
      <div
        ref={containerRef}
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
      >
        {services.map((service, index) => (
          <ServiceTile key={service.slug} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}
