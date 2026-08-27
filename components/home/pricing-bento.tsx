"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Package } from "@/config/packages";
import { revealBatch } from "./motion/reveal-batch";

export function PricingBento({ packages }: { packages: Package[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const mm = revealBatch(containerRef.current, "[data-reveal]", { from: { y: 70, rotate: -2 }, stagger: 0.1 });
    return () => mm.revert();
  }, []);

  return (
    <section className="relative mx-auto max-w-container px-6 py-24 md:py-32">
      <div className="mb-12 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Pricing</p>
        <h2 className="mt-3 font-display text-display-2 text-home-text">Transparent, productized pricing</h2>
        <p className="mt-4 text-home-muted">Every price, scope, and timeline is written down — no surprise invoices.</p>
      </div>

      <div ref={containerRef} className="grid items-start gap-6 md:grid-cols-3">
        {packages.map((pkg) => {
          const featured = pkg.tier === "GROWTH";
          return (
            <div
              key={pkg.name}
              data-reveal
              className={
                featured
                  ? "relative z-10 flex flex-col rounded-[2rem] border border-primary/50 bg-home-surface-2 p-8 shadow-glow-primary md:-my-6 md:scale-105"
                  : "flex flex-col rounded-[2rem] border border-home-border bg-home-surface p-8"
              }
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">{pkg.tier}</p>
              <h3 className="mt-1 font-display text-2xl text-home-text">{pkg.name}</h3>
              <p className="mt-4 font-display text-4xl text-home-text">
                {pkg.priceInRupees !== null ? `₹${pkg.priceInRupees.toLocaleString("en-IN")}` : "Custom quote"}
                {pkg.cadence === "monthly" && pkg.priceInRupees !== null && (
                  <span className="text-base font-normal text-home-muted">/month</span>
                )}
              </p>
              {pkg.note && <p className="mt-1 text-xs text-home-muted">{pkg.note}</p>}

              <ul className="mt-6 flex flex-1 flex-col gap-2 text-sm text-home-text">
                {pkg.includes.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden className="text-success">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className={
                  featured
                    ? "mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 font-semibold text-white hover:bg-primary-hover"
                    : "mt-8 inline-flex h-12 items-center justify-center rounded-full border border-home-border px-6 font-semibold text-home-text hover:bg-black/5"
                }
              >
                Get a quote
              </Link>
            </div>
          );
        })}
      </div>

      <p className="mt-10">
        <Link href="/pricing" className="text-sm font-medium text-home-text underline">
          See full pricing →
        </Link>
      </p>
    </section>
  );
}
