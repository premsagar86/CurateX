"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Service } from "@/config/services";
import { revealBatch } from "./motion/reveal-batch";
import { useTilt } from "./motion/use-tilt";

// One hand-tuned layout slot per index — the asymmetry is intentional, not
// derived, so each of the 8 services gets a distinct silhouette/personality
// rather than a repeating card template.
const LAYOUT = [
  "col-span-6 md:col-span-4 md:row-span-2 rounded-[2rem]",
  "col-span-6 md:col-span-2 md:row-span-2 rounded-[2rem] md:-rotate-2 md:-ml-6 md:mt-10",
  "col-span-3 md:col-span-2 aspect-square rounded-full text-center",
  "col-span-3 md:col-span-2 rounded-[2rem] md:rotate-1",
  "col-span-6 md:col-span-2 rounded-[2rem] [clip-path:polygon(0_0,100%_0,100%_82%,85%_100%,0_100%)]",
  "col-span-6 md:col-span-3 rounded-[2rem] md:rotate-1",
  "col-span-6 md:col-span-3 rounded-[2rem] md:-rotate-1",
  "col-span-6 rounded-[2rem]",
];

// Cycles the hover glow through all three brand colors (Ember/Spark/Steel —
// site.md §9.1) instead of leaning on primary alone, so the full palette
// shows up across the grid rather than just two-thirds of it.
const GLOW_COLORS = ["rgba(217,98,43,0.25)", "rgba(242,169,59,0.25)", "rgba(120,138,150,0.35)"];

function ServiceTile({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useTilt(ref as React.RefObject<HTMLElement>, 8);
  const isCircle = LAYOUT[index]?.includes("rounded-full");

  return (
    <div ref={ref} data-reveal className={`group relative overflow-hidden border border-home-border bg-home-surface p-6 md:p-8 ${LAYOUT[index] ?? "col-span-3 rounded-[2rem]"}`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(280px circle at var(--mx,50%) var(--my,50%), ${GLOW_COLORS[index % GLOW_COLORS.length]}, transparent 70%)`,
        }}
      />
      <span className="pointer-events-none absolute right-3 top-2 select-none font-display text-6xl leading-none text-white/[0.06] md:text-7xl">
        {String(index + 1).padStart(2, "0")}
      </span>
      <Link
        href={`/services/${service.slug}`}
        className={`relative flex h-full flex-col ${isCircle ? "items-center justify-center px-4 text-center" : "justify-end"}`}
      >
        <h3 className={`font-display text-home-text ${isCircle ? "text-lg" : "text-2xl md:text-3xl"}`}>{service.name}</h3>
        {!isCircle && <p className="mt-2 text-sm text-home-muted">{service.oneLiner}</p>}
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

      <div ref={containerRef} className="grid grid-cols-6 gap-4 md:auto-rows-[150px] md:gap-6">
        {services.map((service, index) => (
          <ServiceTile key={service.slug} service={service} index={index} />
        ))}
      </div>
    </section>
  );
}
