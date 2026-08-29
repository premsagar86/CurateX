"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Package } from "@/config/packages";
import { revealBatch } from "./motion/reveal-batch";

// Renders a plan name on two clean lines when it carries a " / " split
// (e.g. "Premium Website / E-commerce") instead of letting the slash wrap
// awkwardly.
function PlanName({ name }: { name: string }) {
  if (name.includes(" / ")) {
    const [first, second] = name.split(" / ");
    return (
      <>
        {first}
        <br />
        <span className="text-home-muted">/ {second}</span>
      </>
    );
  }
  return <>{name}</>;
}

function PricingCard({ pkg }: { pkg: Package }) {
  const featured = pkg.tier === "GROWTH";

  return (
    <div
      data-reveal
      className={`relative flex h-full flex-col rounded-lg border p-8 ${
        featured
          ? "border-primary/45 bg-home-surface-2 shadow-glow-primary"
          : "border-home-border bg-home-surface"
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white">
          Most popular
        </span>
      )}

      {/* Header block — fixed order, identical top alignment across cards. */}
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{pkg.tier}</p>
      <h3 className="mt-2 min-h-[3.75rem] font-display text-2xl leading-tight text-home-text">
        <PlanName name={pkg.name} />
      </h3>

      <p className="mt-5 font-display text-4xl text-home-text">
        {pkg.priceInRupees !== null ? `₹${pkg.priceInRupees.toLocaleString("en-IN")}` : "Custom quote"}
        {pkg.cadence === "monthly" && pkg.priceInRupees !== null && (
          <span className="text-base font-normal text-home-muted">/month</span>
        )}
      </p>
      <p className="mt-1 min-h-[1.25rem] text-xs text-home-muted">{pkg.note ?? " "}</p>

      {/* Features grow to fill, so every CTA lands on the same baseline. */}
      <ul className="mt-6 flex flex-1 flex-col gap-2.5 text-sm text-home-text">
        {pkg.includes.map((item) => (
          <li key={item} className="flex gap-2.5">
            <span aria-hidden className="mt-0.5 text-success">✓</span>
            <span className="leading-snug">{item}</span>
          </li>
        ))}
      </ul>

      <Link
        href="/contact"
        className={`btn-pill mt-8 w-full ${featured ? "btn-pill-primary" : "btn-pill-secondary"}`}
      >
        Get a quote
      </Link>
    </div>
  );
}

export function PricingBento({ packages }: { packages: Package[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const mm = revealBatch(containerRef.current, "[data-reveal]", { from: { y: 56 }, stagger: 0.08 });
    return () => mm.revert();
  }, []);

  return (
    <section className="section-y relative mx-auto max-w-container px-6">
      <div className="mb-14 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Pricing</p>
        <h2 className="mt-4 font-display text-display-2 text-home-text">Transparent, productized pricing</h2>
        <p className="mt-4 max-w-prose text-home-muted">
          Every price, scope, and timeline is written down — no surprise invoices.
        </p>
      </div>

      <div ref={containerRef} className="grid items-stretch gap-5 md:grid-cols-3">
        {packages.map((pkg) => (
          <PricingCard key={pkg.name} pkg={pkg} />
        ))}
      </div>

      <p className="mt-10">
        <Link
          href="/pricing"
          className="text-sm font-medium text-home-text underline underline-offset-4 hover:text-primary"
        >
          See full pricing &rarr;
        </Link>
      </p>
    </section>
  );
}
