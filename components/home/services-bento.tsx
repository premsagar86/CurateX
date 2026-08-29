"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Service } from "@/config/services";
import { revealBatch } from "./motion/reveal-batch";
import { useTilt } from "./motion/use-tilt";

// Cycles the hover glow through all three brand colors (Ember/Spark/Steel —
// site.md §9.1) instead of leaning on primary alone, so the full palette
// shows up across the grid rather than just two-thirds of it.
const GLOW_COLORS = ["rgba(217,98,43,0.25)", "rgba(242,169,59,0.25)", "rgba(120,138,150,0.35)"];

function ServiceTile({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref as React.RefObject<HTMLElement>, 8);

  return (
    <div
      ref={ref}
      data-reveal
      className="group relative flex h-full min-h-[14rem] flex-col overflow-hidden rounded-3xl border border-home-border bg-home-surface p-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px circle at var(--mx,50%) var(--my,50%), ${GLOW_COLORS[index % GLOW_COLORS.length]}, transparent 70%)`,
        }}
      />
      <span className="pointer-events-none absolute -bottom-4 -right-2 select-none font-display text-[5.5rem] leading-none text-home-text/[0.04]">
        {String(index + 1).padStart(2, "0")}
      </span>
      <Link href={`/services/${service.slug}`} className="relative flex h-full flex-col">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-3 font-display text-xl leading-tight text-home-text">{service.name}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-home-muted">{service.oneLiner}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-home-text opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Explore <span aria-hidden>&rarr;</span>
        </span>
      </Link>
    </div>
  );
}

export function ServicesBento({ services }: { services: Service[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const mm = revealBatch(containerRef.current, "[data-reveal]", {
      from: { y: 80, rotate: -3 },
      stagger: 0.06,
    });
    return () => mm.revert();
  }, []);

  return (
    <section className="relative mx-auto max-w-container px-6 py-24 md:py-32">
      <div className="mb-12 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">What we do</p>
        <h2 className="mt-3 font-display text-display-2 text-home-text">Eight services, one accountable team</h2>
        <p className="mt-4 text-home-muted">
          No finger-pointing between &ldquo;the designer&rdquo; and &ldquo;the developer&rdquo; — one team owns your
          project end to end.
        </p>
      </div>

      <div ref={containerRef} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, index) => (
          <ServiceTile key={service.slug} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}
