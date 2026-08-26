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
          yPercent: -40,
          rotate: 25,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 0.8 },
        });
        gsap.to(shapeBRef.current, {
          yPercent: 35,
          rotate: -20,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: 1.2 },
        });
        gsap.fromTo(
          headlineRef.current,
          { scale: 0.85, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            ease: "none",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%", end: "top 30%", scrub: 0.6 },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[90svh] flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      <div
        ref={shapeARef}
        aria-hidden
        className="motion-decor absolute -left-10 top-10 h-64 w-64 rounded-[2rem] border border-primary/40 bg-home-bg/60 backdrop-blur-sm md:h-80 md:w-80"
        style={{ zIndex: 20 }}
      />
      <div
        ref={shapeBRef}
        aria-hidden
        className="motion-decor absolute -right-16 bottom-10 h-72 w-72 animate-pulse-glow rounded-full bg-accent/20 blur-3xl"
        style={{ zIndex: 0 }}
      />

      <h2 ref={headlineRef} className="relative z-10 max-w-3xl font-display text-display-1 text-home-text">
        Ready to talk about your project?
      </h2>
      <p className="relative z-10 mx-auto mt-6 max-w-md text-lg text-home-muted">
        Tell us what you&apos;re building — we&apos;ll respond within one business day.
      </p>
      <Link
        ref={ctaRef}
        href="/contact"
        className="relative z-10 mt-10 inline-flex h-16 items-center justify-center rounded-full bg-primary px-10 text-lg font-semibold text-white shadow-glow-primary hover:bg-primary-hover"
      >
        Get a quote
      </Link>
    </section>
  );
}
