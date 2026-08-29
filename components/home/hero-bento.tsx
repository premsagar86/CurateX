"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { getGsap, EASE, MOTION_OK_QUERY } from "./motion/gsap-setup";
import { useMagnetic } from "./motion/use-magnetic";

// --------------------------------------------------------------------------
// Hero has three explicit layers:
//   z-decor   — atmospheric background: one soft glow, an oversized blurred
//               serif word, thin line artwork, and a scattered stat-tile
//               field. All low-contrast, none of it crossing the headline.
//   z-decor   — a legibility wash that eases the field out under the type.
//   z-content — the headline / sub / CTAs, always fully unobstructed.
// The tile at ZOOM_INDEX still drives the scroll "becoming" moment.
// --------------------------------------------------------------------------
const HERO_TILES = [
  { stat: "150+", label: "projects shipped" },
  { stat: "4.9", label: "average rating" },
  { stat: "100%", label: "in-house team" },
  { stat: "30d", label: "typical launch" },
  { stat: "8", label: "services, one team" },
  { stat: "12yr", label: "of craft" },
  { stat: "40+", label: "active clients" },
  { stat: "24h", label: "reply time" },
  { stat: "98%", label: "retention rate" },
  { stat: "0", label: "outsourced work" },
  { stat: "200+", label: "launches shipped" },
  { stat: "1", label: "point of contact" },
];
// Top row, toward the right at every breakpoint — clear of the left-aligned
// headline while still part of the field.
const ZOOM_INDEX = 4;

// Restrained rotation / offset for the wrapper (never the GSAP-animated
// `.hero-tile`) so the loose layout and the scroll animation don't fight
// over `transform`.
const TILE_SCATTER = [
  "rotate-[-4deg] translate-y-2",
  "rotate-[3deg] -translate-y-2",
  "rotate-[-2deg] translate-y-3",
  "rotate-[4deg] translate-y-1",
  "rotate-[-3deg] -translate-y-1",
  "rotate-[2deg] translate-y-2",
];

export function HeroBento() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const tileGridRef = useRef<HTMLDivElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  useMagnetic(ctaRef as React.RefObject<HTMLElement>, 0.25);

  useEffect(() => {
    const { gsap, ScrollTrigger, SplitText } = getGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK_QUERY, () => {
        if (headlineRef.current) {
          const split = new SplitText(headlineRef.current, { type: "lines,words" });
          gsap.set(split.words, { yPercent: 120, rotate: 5, autoAlpha: 0 });
          gsap.to(split.words, {
            yPercent: 0,
            rotate: 0,
            autoAlpha: 1,
            duration: 1,
            ease: EASE.overshoot,
            stagger: 0.04,
            delay: 0.12,
          });
        }

        gsap.fromTo(
          glowRef.current,
          { scale: 0.7, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 1.4, ease: EASE.smooth }
        );

        gsap.from(".hero-tile, .hero-tile-zoom, .hero-ghost", {
          autoAlpha: 0,
          y: 32,
          scale: 0.85,
          duration: 0.9,
          ease: EASE.smooth,
          stagger: 0.05,
          delay: 0.3,
        });

        // Gentle parallax on the atmospheric layer only.
        gsap.to(glowRef.current, {
          yPercent: -14,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 0.8 },
        });
        gsap.to(ghostRef.current, {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1.2 },
        });

        // Signature moment: the slanted tile field un-slants, the filler tiles
        // clear out, and the ZOOM tile pins + scales to fill the viewport,
        // cross-fading into a preview of the next section. Overlay is fully
        // gone before the pin releases so the handoff is clean.
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
            .to([washRef.current, ghostRef.current, glowRef.current], { autoAlpha: 0, duration: 0.3 }, 0)
            .to(tileGridRef.current, { rotate: 0, x: 0, duration: 0.4, ease: EASE.smooth }, 0)
            .to(".hero-tile, .hero-ghost", { autoAlpha: 0, scale: 0.6, duration: 0.3, stagger: 0.03 }, 0.05)
            .to(
              tileRef.current,
              { scale: 30, rotate: 0, borderRadius: 0, duration: 0.7, ease: EASE.smooth },
              0.15
            )
            .to(tileRef.current.querySelector(".tile-label"), { autoAlpha: 0, duration: 0.2 }, 0.15)
            .fromTo(
              revealRef.current,
              { autoAlpha: 0, yPercent: 8 },
              { autoAlpha: 1, yPercent: 0, duration: 0.35 },
              0.42
            )
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
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[calc(100svh_-_var(--nav-h))] items-center overflow-clip px-6 py-24 md:py-28"
    >
      {/* ---- Atmospheric background layer (z-decor) ---------------------- */}
      <div className="pointer-events-none absolute inset-0 z-[var(--z-decor)]" aria-hidden>
        {/* One soft warm glow — no competing second blob. */}
        <div
          ref={glowRef}
          className="motion-decor absolute -left-32 top-0 h-[30rem] w-[30rem] rounded-full bg-primary/15 blur-[120px] md:h-[36rem] md:w-[36rem]"
        />

        {/* Oversized blurred serif word — atmospheric, discoverable, never
            readable duplicate copy. Kept low and right so it never crosses
            the headline. */}
        <span
          ref={ghostRef}
          className="decor-numeral absolute -bottom-[6vw] right-[-2vw] whitespace-nowrap text-ghost text-home-text/[0.035] blur-[3px] md:blur-[5px]"
        >
          forge
        </span>

        {/* Thin line artwork — far right, only where the layout is wide enough
            that it stays well clear of the primary heading. */}
        <svg
          className="absolute right-[-9rem] top-1/2 hidden h-[38rem] w-[38rem] -translate-y-1/2 text-home-border xl:block"
          viewBox="0 0 400 400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <circle cx="300" cy="210" r="150" opacity="0.45" />
          <circle cx="300" cy="210" r="108" opacity="0.3" />
          <path d="M200 40 L380 300" opacity="0.25" />
          <path d="M240 380 L400 150" opacity="0.2" />
        </svg>

        {/* Scattered stat-tile field — desktop only; a reduced, low-contrast
            interface texture that the user discovers on a second look. */}
        <div className="absolute inset-0 hidden items-center justify-center md:flex">
          <div
            ref={tileGridRef}
            className="grid w-full max-w-[120rem] grid-cols-4 gap-4 rotate-[5deg] px-4 lg:grid-cols-6 lg:gap-5"
          >
            {HERO_TILES.map((tile, i) =>
              i === ZOOM_INDEX ? (
                <div key={`${tile.label}-${i}`} className="relative z-[1] aspect-square">
                  <div
                    aria-hidden
                    className="hero-ghost absolute inset-0 translate-x-2 translate-y-2 rotate-2 rounded-2xl border border-home-border bg-home-surface/30"
                  />
                  <div
                    ref={tileRef}
                    className="hero-tile-zoom glass absolute inset-0 flex flex-col items-center justify-center rounded-2xl text-center shadow-glow-accent ring-1 ring-accent/25"
                  >
                    <div className="tile-label px-2">
                      <p className="font-display text-2xl text-home-text">{tile.stat}</p>
                      <p className="mt-1 text-[0.65rem] uppercase tracking-wide text-home-muted">{tile.label}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={`${tile.label}-${i}`}
                  className={`aspect-square ${TILE_SCATTER[i % TILE_SCATTER.length]}`}
                >
                  <div
                    className={`motion-decor h-full w-full ${i % 2 ? "animate-drift" : "animate-float"}`}
                    style={{
                      animationDelay: `${(i % 5) * -2.1}s`,
                      animationDuration: `${11 + (i % 4)}s`,
                    }}
                  >
                    <div className="hero-tile decor-panel flex h-full w-full flex-col justify-between rounded-2xl p-3 opacity-[0.32] blur-[0.6px]">
                      <p className="font-display text-lg leading-none text-home-text">{tile.stat}</p>
                      <p className="text-[0.6rem] uppercase tracking-wide text-home-muted">{tile.label}</p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Legibility wash (z-decor, above the field) — eases the texture out
          under the headline column without hiding it. */}
      <div
        ref={washRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[var(--z-decor)]"
        style={{
          background:
            "radial-gradient(60% 60% at 28% 48%, color-mix(in srgb, var(--home-bg) 88%, transparent) 0%, color-mix(in srgb, var(--home-bg) 40%, transparent) 42%, transparent 70%)",
        }}
      />

      {/* ---- Foreground content (z-content) ---------------------------- */}
      <div className="relative z-[var(--z-content)] mx-auto w-full max-w-container">
        <div className="max-w-xl">
          <p className="hero-eyebrow text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Forge Digital
          </p>
          <h1
            ref={headlineRef}
            className="mt-5 max-w-[12ch] text-balance font-display text-display-1 text-home-text"
          >
            Built to last.
          </h1>
          <p className="hero-sub mt-6 max-w-md text-lg leading-relaxed text-home-muted">
            We build the digital presence your business has earned — designed with craft, delivered with
            process, maintained as a partner, not a vendor.
          </p>
          <div className="hero-cta mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Link
              ref={ctaRef}
              href="/contact"
              className="btn-pill btn-pill-lg btn-pill-primary is-magnetic w-full sm:w-auto"
            >
              Get a quote
            </Link>
            <Link href="/work" className="btn-pill btn-pill-lg btn-pill-secondary w-full sm:w-auto">
              See our work
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll "becoming" overlay — below the header, above the section. */}
      <div
        ref={revealRef}
        className="pointer-events-none fixed inset-0 z-[var(--z-section-overlay)] flex flex-col items-center justify-center px-6 text-center opacity-0"
      >
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">What we do</p>
        <h2 className="mt-4 max-w-3xl font-display text-display-2 text-home-text">
          Eight services, one accountable team
        </h2>
      </div>
    </section>
  );
}
