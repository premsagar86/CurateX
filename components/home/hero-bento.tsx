"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { getGsap, EASE, MOTION_OK_QUERY } from "./motion/gsap-setup";
import { useMagnetic } from "./motion/use-magnetic";

// Decorative filler tiles for the hero cluster. They exist to give the
// scroll-to-zoom "becoming" moment a full tile wall to sit in instead of a
// lone card floating in empty space. The tile at ZOOM_INDEX is the one that
// scales up to fill the viewport.
const HERO_TILES = [
  { stat: "150+", label: "projects shipped" },
  { stat: "8", label: "services, one team" },
  { stat: "4.9", label: "average rating" },
  { stat: "100%", label: "in-house team" },
  { stat: "30d", label: "typical launch" },
  { stat: "12yr", label: "of craft" },
];
const ZOOM_INDEX = 1;

export function HeroBento() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const tileGridRef = useRef<HTMLDivElement>(null);
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

        gsap.from(".hero-tile, .hero-tile-zoom, .hero-ghost", {
          autoAlpha: 0,
          y: 40,
          scale: 0.8,
          duration: 0.9,
          ease: EASE.smooth,
          stagger: 0.06,
          delay: 0.35,
        });

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

        // Signature moment: the slanted tile wall un-slants, the filler tiles
        // clear out, and the ZOOM tile pins + rapidly scales to fill the
        // viewport, cross-fading into a preview of the next section. The
        // overlay is fully faded before the pin releases so the handoff into
        // ServicesBento is clean rather than snapping mid-animation.
        if (sectionRef.current && tileGridRef.current && tileRef.current && revealRef.current) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=180%",
              scrub: 1,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
            },
          });

          tl.to(headlineRef.current, { autoAlpha: 0, yPercent: -12, duration: 0.3 }, 0)
            .to(".hero-sub, .hero-cta", { autoAlpha: 0, y: -20, duration: 0.25 }, 0)
            .to(".hero-eyebrow", { autoAlpha: 0, y: -16, duration: 0.25 }, 0)
            .to(tileGridRef.current, { rotate: 0, x: 0, duration: 0.4, ease: EASE.smooth }, 0)
            .to(".hero-tile, .hero-ghost", { autoAlpha: 0, scale: 0.6, duration: 0.3, stagger: 0.03 }, 0.05)
            .to(
              tileRef.current,
              { scale: 22, rotate: 0, borderRadius: 0, duration: 0.7, ease: EASE.smooth },
              0.15
            )
            .to(tileRef.current.querySelector(".tile-label"), { autoAlpha: 0, duration: 0.2 }, 0.15)
            .fromTo(
              revealRef.current,
              { autoAlpha: 0, yPercent: 8 },
              { autoAlpha: 1, yPercent: 0, duration: 0.35 },
              0.42
            )
            // Clean handoff: overlay is gone before the pin releases, and a
            // trailing hold lets the scrub lag catch up so scroll never
            // "ends" mid-transition.
            .to([tileRef.current, revealRef.current], { autoAlpha: 0, duration: 0.15 }, 0.78)
            .to({}, { duration: 0.15 });
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

      <div className="relative mx-auto grid w-full max-w-container gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <p className="hero-eyebrow text-sm font-semibold uppercase tracking-[0.2em] text-primary">Forge Digital</p>
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
              className="inline-flex h-14 items-center justify-center rounded-full border border-home-border px-8 text-lg font-semibold text-home-text transition-colors hover:bg-black/5"
            >
              See our work
            </Link>
          </div>
        </div>

        <div className="relative hidden justify-self-end md:block" aria-hidden>
          <div
            ref={tileGridRef}
            className="ml-auto grid w-full max-w-[22rem] grid-cols-2 gap-4 rotate-[6deg] lg:max-w-[24rem]"
          >
            {HERO_TILES.map((tile, i) =>
              i === ZOOM_INDEX ? (
                <div key={tile.label} className="relative z-10 aspect-square">
                  {/* Background cards — same tile shape and slant as the wall,
                      stacked behind so the "main" card lifts off the grid. */}
                  <div
                    aria-hidden
                    className="hero-ghost absolute inset-0 translate-x-3 translate-y-4 rotate-2 rounded-3xl border border-home-border bg-home-surface/50"
                  />
                  <div
                    aria-hidden
                    className="hero-ghost absolute inset-0 -rotate-3 translate-x-6 translate-y-8 rounded-3xl border border-home-border bg-home-surface/30"
                  />
                  <div
                    ref={tileRef}
                    className="hero-tile-zoom glass absolute inset-0 flex flex-col items-center justify-center rounded-3xl text-center shadow-glow-accent ring-1 ring-accent/40"
                  >
                    <div className="tile-label px-4">
                      <p className="font-display text-3xl text-home-text">{tile.stat}</p>
                      <p className="mt-1 text-xs uppercase tracking-wide text-home-muted">{tile.label}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={tile.label}
                  className="hero-tile glass flex aspect-square flex-col justify-between rounded-3xl p-5"
                >
                  <p className="font-display text-3xl text-home-text">{tile.stat}</p>
                  <p className="text-xs uppercase tracking-wide text-home-muted">{tile.label}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div
        ref={revealRef}
        className="pointer-events-none fixed inset-0 z-20 flex flex-col items-center justify-center px-6 text-center opacity-0"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">What we do</p>
        <h2 className="mt-4 max-w-3xl font-display text-display-2 text-home-text">
          Eight services, one accountable team
        </h2>
      </div>
    </section>
  );
}
