"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { getGsap } from "./motion/gsap-setup";
import { useMagnetic } from "./motion/use-magnetic";

// Parallax drift on the ambient layer is desktop-only — on phones the
// fragments sit in-flow (see markup) rather than floating behind the copy.
const DESKTOP_MOTION_QUERY = "(prefers-reduced-motion: no-preference) and (min-width: 768px)";

// "Interface fragments" that frame the CTA — large, but held low in opacity
// so they read as atmosphere and never compete with the headline / button.
const FRAGMENTS = [
  { value: "1 day", label: "reply time", pos: "left-[5%] top-[8%] lg:left-[11%]", spin: "rotate-[-6deg]", drift: -24 },
  { value: "4.9 / 5", label: "client rating", pos: "right-[5%] top-[12%] lg:right-[11%]", spin: "rotate-[5deg]", drift: 22 },
  { value: "150+", label: "projects shipped", pos: "left-[6%] bottom-[10%] lg:left-[12%]", spin: "rotate-[4deg]", drift: 20 },
  { value: "100%", label: "in-house team", pos: "right-[6%] bottom-[8%] lg:right-[12%]", spin: "rotate-[-4deg]", drift: -18 },
];

export function CtaFinale() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useMagnetic(ctaRef as React.RefObject<HTMLElement>, 0.4);

  useEffect(() => {
    if (!sectionRef.current) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION_QUERY, () => {
        cardsRef.current.forEach((el, i) => {
          if (!el) return;
          gsap.to(el, {
            yPercent: FRAGMENTS[i].drift,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1 + (i % 2) * 0.4,
            },
          });
        });

        gsap.fromTo(
          headlineRef.current,
          { scale: 0.92, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%", end: "top 35%", scrub: 0.6 },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-y relative isolate flex min-h-[52svh] flex-col items-center justify-center overflow-hidden px-6 text-center md:min-h-[76svh]"
    >
      {/* Ambient layer — soft glows + the framing fragments (desktop only). */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[var(--z-decor)] overflow-hidden">
        <div className="absolute -left-24 top-0 h-56 w-56 rounded-full bg-primary/12 blur-[100px] md:h-80 md:w-80" />
        <div className="motion-decor absolute -right-20 bottom-0 h-64 w-64 animate-pulse-glow rounded-full bg-accent/12 blur-[110px] md:h-80 md:w-80" />

        {FRAGMENTS.map((fragment, i) => (
          <div
            key={fragment.label}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            className={`absolute hidden md:block ${fragment.pos}`}
          >
            {/* Outer node owns the scroll parallax; inner owns the idle float
                so the two transforms never fight over `transform`. */}
            <div
              className={`decor-card motion-decor w-48 p-5 opacity-[0.38] lg:w-64 lg:p-6 ${fragment.spin} ${
                i % 2 ? "animate-drift" : "animate-float"
              }`}
            >
              <p className="font-display text-2xl leading-none text-home-text lg:text-3xl">{fragment.value}</p>
              <p className="mt-2 text-[0.62rem] uppercase tracking-wide text-home-muted">{fragment.label}</p>
            </div>
          </div>
        ))}
      </div>

      <h2
        ref={headlineRef}
        className="relative z-[var(--z-content)] max-w-2xl text-balance font-display text-display-1 text-home-text"
      >
        Ready to talk about your project?
      </h2>
      <p className="relative z-[var(--z-content)] mx-auto mt-6 max-w-md text-lg leading-relaxed text-home-muted">
        Tell us what you&apos;re building — we&apos;ll respond within one business day.
      </p>
      <Link
        ref={ctaRef}
        href="/contact"
        className="btn-pill btn-pill-lg btn-pill-primary is-magnetic relative z-[var(--z-content)] mt-10"
      >
        Get a quote
      </Link>

      {/* Mobile: fragments move in-flow so they never sit under the copy. */}
      <div className="relative z-[var(--z-content)] mt-12 grid w-full max-w-sm grid-cols-2 gap-3 opacity-75 md:hidden">
        {FRAGMENTS.map((fragment, i) => (
          <div
            key={fragment.label}
            className={`decor-card motion-decor flex flex-col gap-1.5 p-4 ${
              i % 2 ? "animate-drift" : "animate-float"
            }`}
          >
            <p className="font-display text-xl leading-none text-home-text">{fragment.value}</p>
            <p className="text-[0.6rem] uppercase tracking-wide text-home-muted">{fragment.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
