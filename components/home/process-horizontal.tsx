"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { getGsap } from "./motion/gsap-setup";

const STEPS = [
  { title: "Discovery", copy: "Goals, audience, and a real content inventory before anything gets designed." },
  { title: "Design", copy: "Wireframes first, then visual design — reviewed and approved before a line of code ships." },
  { title: "Build", copy: "Development and QA against the approved design, not a moving target." },
  { title: "Delivery", copy: "Launch, plus a documented handoff — no black box." },
];

const PIN_QUERY = "(prefers-reduced-motion: no-preference) and (min-width: 900px)";

export function ProcessHorizontal() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(PIN_QUERY, () => {
        const track = trackRef.current!;
        // The track sits inside a centered max-w-container + px-6 wrapper, so its
        // left edge is inset from the viewport. Translating by only
        // scrollWidth - innerWidth leaves the last card clipped by that inset, so
        // add the track's own left offset plus a trailing gutter.
        const trailingGutter = 32;
        const trackLeft = track.getBoundingClientRect().left;
        const distance = track.scrollWidth - window.innerWidth + trackLeft + trailingGutter;
        if (distance <= 0) return;

        // Baseline markup is a natively-scrollable row (works with no JS at
        // all); once the pinned scrub takes over, native scroll would fight
        // the transform, so switch it off only here.
        track.style.overflow = "visible";
        track.scrollLeft = 0;
        gsap.set(".process-card", { transformOrigin: "50% 100%" });

        const tween = gsap.to(track, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${distance + window.innerHeight * 0.4}`,
            scrub: 0.6,
            pin: true,
            onUpdate: (self) => {
              if (progressRef.current) progressRef.current.style.width = `${self.progress * 100}%`;
            },
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          track.style.overflow = "";
        };
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-20 md:h-screen md:py-0">
      <div className="mx-auto flex h-full max-w-container flex-col justify-center px-6">
        <div className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">How it works</p>
          <h2 className="mt-4 font-display text-display-2 text-home-text">A process you can actually see</h2>
        </div>

        <div ref={trackRef} className="flex gap-5 overflow-x-auto pb-4" style={{ willChange: "transform" }}>
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="process-card glass flex w-[78vw] shrink-0 flex-col rounded-lg p-8 sm:w-[400px] md:w-[36vw] lg:w-[28vw]"
            >
              <span className="font-display text-6xl leading-none text-primary/45">0{index + 1}</span>
              <p className="mt-5 font-display text-2xl text-home-text">{step.title}</p>
              <p className="mt-3 leading-relaxed text-home-muted">{step.copy}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 hidden h-px w-full bg-home-border md:block">
          <div ref={progressRef} className="h-full w-0 bg-primary transition-[width]" />
        </div>

        <p className="mt-8">
          <Link
            href="/process"
            className="text-sm font-medium text-home-text underline underline-offset-4 hover:text-primary"
          >
            See the full process &rarr;
          </Link>
        </p>
      </div>
    </section>
  );
}
