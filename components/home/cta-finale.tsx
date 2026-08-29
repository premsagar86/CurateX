"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { getGsap, MOTION_OK_QUERY } from "./motion/gsap-setup";
import { useMagnetic } from "./motion/use-magnetic";

export function CtaFinale() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const shapeARef = useRef<HTMLDivElement>(null);
  const shapeBRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useMagnetic(ctaRef as React.RefObject<HTMLElement>, 0.4);

  useEffect(() => {
    if (!sectionRef.current) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK_QUERY, () => {
        gsap.to(shapeARef.current, {
          yPercent: -26,
          rotate: 10,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
        });
        gsap.to(shapeBRef.current, {
          yPercent: 22,
          rotate: -8,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.2 },
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
      className="section-y relative isolate flex min-h-[70svh] flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div
        ref={shapeARef}
        aria-hidden
        className="decor-panel motion-decor absolute -left-10 top-10 z-[var(--z-decor)] h-56 w-56 md:h-72 md:w-72"
      />
      <div
        ref={shapeBRef}
        aria-hidden
        className="motion-decor absolute -right-16 bottom-10 z-[var(--z-decor)] h-72 w-72 animate-pulse-glow rounded-full bg-accent/12 blur-3xl"
      />

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
    </section>
  );
}
