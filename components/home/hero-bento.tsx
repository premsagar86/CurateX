"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { getGsap, EASE, MOTION_OK_QUERY } from "./motion/gsap-setup";
import { useMagnetic } from "./motion/use-magnetic";

export function HeroBento() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const blobARef = useRef<HTMLDivElement>(null);
  const blobBRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useMagnetic(ctaRef as React.RefObject<HTMLElement>, 0.3);

  useEffect(() => {
    const { gsap, ScrollTrigger, SplitText } = getGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK_QUERY, () => {
        if (headlineRef.current) {
          const split = new SplitText(headlineRef.current, { type: "lines,words" });
          gsap.set(split.words, { yPercent: 130, rotate: 6, autoAlpha: 0 });
          gsap.to(split.words, {
            yPercent: 0,
            rotate: 0,
            autoAlpha: 1,
            duration: 1.1,
            ease: EASE.overshoot,
            stagger: 0.045,
            delay: 0.15,
          });
        }

        gsap.fromTo(
          [blobARef.current, blobBRef.current],
          { scale: 0.6, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 1.4, ease: EASE.smooth, stagger: 0.15 }
        );

        gsap.to(blobARef.current, {
          yPercent: -20,
          xPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 0.6 },
        });
        gsap.to(blobBRef.current, {
          yPercent: 14,
          xPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.1 },
        });

        // Signature moment: the small stat tile pins and rapidly scales to
        // fill the viewport, cross-fading into a preview of the next
        // section before releasing scroll — a tiny bento card "becoming"
        // the full-screen section beneath it.
        if (sectionRef.current && tileRef.current && revealRef.current) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=140%",
              scrub: 0.8,
              pin: true,
              pinSpacing: true,
            },
          });

          tl.to(headlineRef.current, { autoAlpha: 0, yPercent: -12, duration: 0.3 }, 0)
            .to(".hero-sub, .hero-cta", { autoAlpha: 0, y: -20, duration: 0.25 }, 0)
            .to(
              tileRef.current,
              {
                scale: 26,
                borderRadius: 0,
                duration: 0.7,
                ease: EASE.smooth,
              },
              0.15
            )
            .to(tileRef.current.querySelector(".tile-label"), { autoAlpha: 0, duration: 0.2 }, 0.15)
            .fromTo(
              revealRef.current,
              { autoAlpha: 0, scale: 0.85 },
              { autoAlpha: 1, scale: 1, duration: 0.35 },
              0.45
            )
            .to(revealRef.current, { autoAlpha: 0, duration: 0.2 }, 0.85);
        }

        return () => {
          ScrollTrigger.getAll().forEach((st) => st.kill());
        };
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative isolate flex min-h-[100svh] items-center overflow-clip px-6">
      <div
        ref={blobARef}
        aria-hidden
        className="motion-decor absolute -left-24 top-10 h-[26rem] w-[26rem] animate-float rounded-full bg-primary/25 blur-[100px]"
      />
      <div
        ref={blobBRef}
        aria-hidden
        className="motion-decor absolute -right-16 bottom-0 h-[22rem] w-[22rem] animate-drift rounded-full bg-accent/20 blur-[110px]"
      />

      <div className="relative mx-auto grid w-full max-w-container gap-10 md:grid-cols-[1.4fr_1fr] md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Forge Digital</p>
          <h1 ref={headlineRef} className="mt-4 font-display text-display-1 text-home-text">
            Built to last.
          </h1>
          <p className="hero-sub mt-6 max-w-lg text-lg text-home-muted">
            We build the digital presence your business has earned — designed with craft, delivered with process,
            maintained as a partner, not a vendor.
          </p>
          <div className="hero-cta mt-8 flex flex-wrap gap-4">
            <Link
              ref={ctaRef}
              href="/contact"
              className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-lg font-semibold text-white shadow-glow-primary transition-colors hover:bg-primary-hover"
            >
              Get a quote
            </Link>
            <Link
              href="/work"
              className="inline-flex h-14 items-center justify-center rounded-full border border-home-border px-8 text-lg font-semibold text-home-text transition-colors hover:bg-white/5"
            >
              See our work
            </Link>
          </div>
        </div>

        <div className="relative hidden justify-self-end md:block">
          <div
            ref={tileRef}
            className="glass relative z-10 flex h-40 w-40 -rotate-3 flex-col items-center justify-center rounded-3xl text-center shadow-glow-accent"
          >
            <div className="tile-label px-4">
              <p className="font-display text-3xl text-home-text">8</p>
              <p className="mt-1 text-xs uppercase tracking-wide text-home-muted">services, one team</p>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={revealRef}
        className="pointer-events-none fixed inset-0 z-20 flex flex-col items-center justify-center text-center opacity-0"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">What we do</p>
        <h2 className="mt-4 max-w-3xl font-display text-display-2 text-home-text">
          Eight services, one accountable team
        </h2>
      </div>
    </section>
  );
}
