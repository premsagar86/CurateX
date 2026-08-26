"use client";

// Wraps ScrollTrigger.batch for staggered directional entrances, shared by
// every grid section (services, work, pricing, testimonials) so each one
// doesn't hand-roll its own batching/stagger logic.
import { getGsap, EASE, MOTION_OK_QUERY } from "./gsap-setup";

export interface RevealOptions {
  from?: { x?: number; y?: number; rotate?: number; scale?: number };
  stagger?: number;
  duration?: number;
  ease?: string;
}

export function revealBatch(container: HTMLElement, selector: string, options: RevealOptions = {}) {
  const { gsap, ScrollTrigger } = getGsap();
  const { from = { y: 60 }, stagger = 0.08, duration = 0.9, ease = EASE.overshoot } = options;

  const mm = gsap.matchMedia();

  mm.add(MOTION_OK_QUERY, () => {
    const targets = container.querySelectorAll<HTMLElement>(selector);
    gsap.set(targets, { autoAlpha: 0, ...from });

    ScrollTrigger.batch(targets, {
      start: "top 88%",
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          duration,
          ease,
          stagger,
          overwrite: true,
        }),
    });

    return () => {
      gsap.set(targets, { clearProps: "all" });
    };
  });

  return mm;
}
