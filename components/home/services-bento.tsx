"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Service } from "@/config/services";
import { revealBatch } from "./motion/reveal-batch";
import { useTilt } from "./motion/use-tilt";

// Cursor-follow hover glow, cycled through the brand palette (Ember / Spark /
// Steel — site.md §9.1). Softened so it reads as a highlight, not a flare.
const GLOW_COLORS = ["rgba(217,98,43,0.16)", "rgba(242,169,59,0.16)", "rgba(120,138,150,0.22)"];

function ServiceTile({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref as React.RefObject<HTMLElement>, 6);

  const number = String(index + 1).padStart(2, "0");

  return (
    <div
      className="h-full animate-float"
      style={{
        animationDelay: `${(index % 4) * -1.5}s`,
        animationDuration: `${8 + (index % 3)}s`,
      }}
    >
      <div
        ref={ref}
        data-reveal
        className="group relative flex h-full min-h-[16rem] flex-col overflow-hidden rounded-lg border border-home-border bg-home-surface p-6"
      >
        {/* Cursor-follow highlight. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(260px circle at var(--mx,50%) var(--my,50%), ${GLOW_COLORS[index % GLOW_COLORS.length]}, transparent 70%)`,
          }}
        />

        {/* Editorial index numeral — sits fully inside the card, behind the
            content and printed into the surface. The copy reserves the right edge
            (title pr-10, description pr-12) so it never overlaps. */}
        <span
          aria-hidden
          className="decor-numeral absolute bottom-3 right-4 z-0 text-[7rem]"
        >
          {number}
        </span>

        {/* Content — fixed order: eyebrow → title → description → action. */}
        <Link
          href={`/services/${service.slug}`}
          className="relative z-[1] flex h-full flex-col focus-visible:outline-none"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">{number}</span>
          <h3 className="mt-3 pr-10 font-display text-xl leading-tight text-home-text">{service.name}</h3>
          <p className="mt-2 line-clamp-2 pr-12 text-sm leading-relaxed text-home-muted">{service.oneLiner}</p>
          <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-home-text opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            Explore <span aria-hidden>&rarr;</span>
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
      <div className="mb-14 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">What we do</p>
        <h2 className="mt-4 font-display text-display-2 text-home-text">Eight services, one accountable team</h2>
        <p className="mt-4 max-w-prose text-home-muted">
          No finger-pointing between &ldquo;the designer&rdquo; and &ldquo;the developer&rdquo; — one team owns
          your project end to end.
        </p>
      </div>

      <div ref={containerRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => (
          <ServiceTile key={service.slug} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}
