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
  { stat: "12yr", label: "of craft" },
  { stat: "40+", label: "active clients" },
  { stat: "24h", label: "reply time" },
  { stat: "98%", label: "retention rate" },
  { stat: "0", label: "outsourced work" },
  { stat: "200+", label: "launches shipped" },
  { stat: "1", label: "point of contact" },
  { stat: "3wk", label: "avg build" },
  { stat: "2", label: "revision rounds" },
  { stat: "60+", label: "brands helped" },
  { stat: "10k", label: "hours shipped" },
  { stat: "48h", label: "first draft" },
  { stat: "90d", label: "support window" },
  { stat: "1:1", label: "client comms" },
  { stat: "0", label: "surprise invoices" },
  { stat: "5★", label: "review average" },
  { stat: "100%", label: "own your code" },
  { stat: "6", label: "week max scope" },
  { stat: "24/7", label: "uptime watch" },
  { stat: "3", label: "concept routes" },
  { stat: "0", label: "hidden fees" },
  { stat: "100%", label: "responsive" },
  { stat: "15+", label: "industries" },
  // ZOOM_INDEX — the glowing card. Sits near the centre of the field so the
  // scroll zoom pushes straight into it rather than off toward a corner.
  { stat: "8", label: "services, one team" },
  { stat: "99.9%", label: "uptime" },
  { stat: "1wk", label: "design sprint" },
  { stat: "2x", label: "faster launch" },
  { stat: "7", label: "day check-ins" },
  { stat: "∞", label: "care after launch" },
  { stat: "1", label: "project lead" },
  { stat: "A+", label: "perf budget" },
  { stat: "12wk", label: "retainer min" },
  { stat: "0", label: "lock-in" },
  { stat: "3d", label: "site audit" },
  { stat: "4", label: "check-in calls" },
  { stat: "1", label: "clear invoice" },
  { stat: "2", label: "designers on it" },
  { stat: "100%", label: "mobile-first" },
  { stat: "1", label: "codebase" },
  { stat: "0", label: "ghosting" },
  { stat: "8–8", label: "support hours" },
  { stat: "30m", label: "kickoff call" },
  { stat: "100%", label: "on-brand" },
  { stat: "1", label: "team, end to end" },
];
const ZOOM_INDEX = 27;

// The scattered field + the pinned "becoming" moment are desktop-only. On
// phones the field is display:none, and pinning the section for ~2 extra
// viewport-heights just produced a large stretch of empty scroll.
const DESKTOP_MOTION_QUERY = "(prefers-reduced-motion: no-preference) and (min-width: 768px)";

// Scatter layout: each tile gets a slot on a coarse lattice that covers the
// whole hero, then a deterministic per-tile nudge in x/y plus its own
// rotation, scale and opacity — so the field fills the section and never
// reads as neat rows/columns. Seeded by index so SSR and client agree.
const SCATTER_COLS = 8;
const SCATTER_ROWS = 6;

function tileLayout(i: number) {
  const col = i % SCATTER_COLS;
  const row = Math.floor(i / SCATTER_COLS);
  const rand = (n: number) => {
    const s = Math.sin((i + 1) * 12.9898 + n * 78.233) * 43758.5453;
    return s - Math.floor(s);
  };
  const cellW = 100 / SCATTER_COLS;
  const cellH = 100 / SCATTER_ROWS;
  const clamp = (v: number) => Math.min(99, Math.max(1, v));
  return {
    x: clamp((col + 0.5) * cellW + (rand(1) - 0.5) * cellW * 1.2),
    y: clamp((row + 0.5) * cellH + (rand(2) - 0.5) * cellH * 1.2),
    rot: (rand(3) - 0.5) * 22,
    scale: 0.58 + rand(4) * 0.8,
    opacity: 0.13 + rand(5) * 0.26,
  };
}

export function HeroBento() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const tileGridRef = useRef<HTMLDivElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const focalCellRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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

      // Type + atmosphere: every screen (reduced-motion aside).
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

        // Mobile-only stat chips (see markup) — settle in after the headline.
        gsap.from(".hero-mobile-tile", {
          autoAlpha: 0,
          y: 24,
          scale: 0.9,
          duration: 0.7,
          ease: EASE.smooth,
          stagger: 0.08,
          delay: 0.35,
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
      });

      // Scattered tile field + the pinned "becoming" moment: desktop only.
      mm.add(DESKTOP_MOTION_QUERY, () => {
        gsap.from(".hero-tile, .hero-tile-zoom, .hero-ghost", {
          autoAlpha: 0,
          y: 28,
          scale: 0.8,
          duration: 0.8,
          ease: EASE.smooth,
          stagger: { each: 0.012, from: "random" },
          delay: 0.3,
        });

        // Signature moment: one unbroken, scroll-driven push-in aimed at the
        // highlighted "8 / services, one team" tile. The field scales toward
        // that card for the whole pin — it never stops — and the card's words
        // cross-dissolve into the "Eight services, one accountable team"
        // section title, which is what you land on. No hard cut.
        if (
          sectionRef.current &&
          tileGridRef.current &&
          tileRef.current &&
          focalCellRef.current &&
          contentRef.current &&
          revealRef.current
        ) {
          // Aim the zoom at the focal cell — the field container fills the
          // section, so the cell's centre as a fraction of it is the origin.
          const gridRect = tileGridRef.current.getBoundingClientRect();
          const cellRect = focalCellRef.current.getBoundingClientRect();
          const originX = (((cellRect.left + cellRect.width / 2) - gridRect.left) / gridRect.width) * 100;
          const originY = (((cellRect.top + cellRect.height / 2) - gridRect.top) / gridRect.height) * 100;
          gsap.set(tileGridRef.current, { transformOrigin: `${originX}% ${originY}%` });
          gsap.set(contentRef.current, { transformOrigin: "50% 50%" });
          gsap.set(focalCellRef.current, { transformOrigin: "50% 50%" });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=170%",
              scrub: 1,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // Continuous zoom: linear scale across the whole pin so it tracks
          // the scrollbar 1:1 and never eases to a halt mid-move. The field
          // scale flings the (now tiny, denser) tiles off-screen; the focal
          // cell takes an extra scale of its own so it still fills the frame
          // exactly as before despite being a quarter the size.
          tl.to(tileGridRef.current, { scale: 11, ease: "none", duration: 1 }, 0)
            .to(focalCellRef.current, { scale: 2.4, ease: "none", duration: 1 }, 0)
            .to(contentRef.current, { scale: 1.5, autoAlpha: 0, ease: "power1.in", duration: 0.4 }, 0)
            .to([washRef.current, glowRef.current, ghostRef.current], { autoAlpha: 0, duration: 0.35 }, 0)
            .to(".hero-tile, .hero-ghost", { autoAlpha: 0, duration: 0.3, stagger: 0.02 }, 0.04)
            // The focal card sheds its frame so no giant panel edge sweeps the
            // screen — it just becomes the space we move into.
            .to(
              tileRef.current,
              {
                backgroundColor: "rgba(0,0,0,0)",
                borderColor: "rgba(0,0,0,0)",
                boxShadow: "0px 0px 0px rgba(0,0,0,0)",
                duration: 0.3,
              },
              0.16
            )
            // Reveal strengthens while the card is still growing (overlap, no
            // gap); the card's own label fades on the same stretch so the
            // wording is continuous rather than swapped.
            .fromTo(
              revealRef.current,
              { autoAlpha: 0, scale: 1.08 },
              { autoAlpha: 1, scale: 1, ease: "none", duration: 0.5 },
              0.28
            )
            .to(".tile-label", { autoAlpha: 0, duration: 0.32 }, 0.3)
            // Field keeps scaling under the reveal, then clears; reveal hands
            // straight off to the real Services header on unpin.
            .to(tileGridRef.current, { autoAlpha: 0, duration: 0.25 }, 0.72)
            .to(revealRef.current, { autoAlpha: 0, duration: 0.13 }, 0.9);
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
      className="relative isolate flex min-h-[calc(100svh_-_var(--nav-h))] items-center overflow-clip px-6 py-10 sm:py-12 md:py-16"
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

        {/* Scattered stat-tile field — desktop only. Tiles are absolutely
            placed on a jittered lattice (see tileLayout) so the field fills
            the whole hero instead of forming rows/columns. */}
        <div ref={tileGridRef} className="absolute inset-0 hidden md:block">
          {HERO_TILES.map((tile, i) => {
            const L = tileLayout(i);
            const place = { left: `${L.x}%`, top: `${L.y}%` } as const;

            if (i === ZOOM_INDEX) {
              return (
                <div
                  key={`${tile.label}-${i}`}
                  ref={focalCellRef}
                  className="absolute z-[1] w-[7rem] lg:w-[8.5rem]"
                  style={{ ...place, transform: "translate(-50%, -50%) rotate(-2deg)" }}
                >
                  <div className="relative aspect-square">
                    <div
                      aria-hidden
                      className="hero-ghost absolute inset-0 translate-x-1 translate-y-1 rotate-1 rounded-md border border-home-border bg-home-surface/30"
                    />
                    <div
                      ref={tileRef}
                      className="hero-tile-zoom glass absolute inset-0 flex flex-col items-center justify-center rounded-md text-center shadow-glow-accent ring-1 ring-accent/45"
                    >
                      <div className="tile-label px-1">
                        <p className="font-display text-sm leading-none text-home-text">{tile.stat}</p>
                        <p className="mt-0.5 text-[0.5rem] uppercase tracking-wide text-home-muted">{tile.label}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={`${tile.label}-${i}`}
                className="absolute w-[4rem] lg:w-[5rem]"
                style={{
                  ...place,
                  transform: `translate(-50%, -50%) rotate(${L.rot}deg) scale(${L.scale})`,
                }}
              >
                <div
                  className={`motion-decor ${i % 2 ? "animate-drift" : "animate-float"}`}
                  style={{
                    animationDelay: `${(i % 7) * -1.9}s`,
                    animationDuration: `${10 + (i % 5)}s`,
                  }}
                >
                  <div
                    className="hero-tile decor-panel flex aspect-square w-full flex-col justify-between rounded-md p-1.5 blur-[0.6px]"
                    style={{ opacity: L.opacity }}
                  >
                    <p className="font-display text-[0.72rem] leading-none text-home-text">{tile.stat}</p>
                    <p className="text-[0.46rem] uppercase leading-none tracking-wide text-home-muted">{tile.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
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
      <div ref={contentRef} className="relative z-[var(--z-content)] mx-auto w-full max-w-container">
        <div className="max-w-xl">
          <p className="hero-eyebrow text-sm font-semibold uppercase tracking-[0.22em] text-primary">
            Forge Digital
          </p>
          <h1
            ref={headlineRef}
            className="mt-4 max-w-[12ch] text-balance font-display text-display-1 text-home-text"
          >
            Built to last.
          </h1>
          <p className="hero-sub mt-4 max-w-md text-lg leading-relaxed text-home-muted">
            We build the digital presence your business has earned — designed with craft, delivered with
            process, maintained as a partner, not a vendor.
          </p>
          <div className="hero-cta mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
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

          {/* Mobile interface texture — the scattered field above is
              desktop-only decoration; small screens get a compact, floating
              version so the hero doesn't read as a bare headline on a big
              empty canvas. */}
          <ul className="mt-8 grid grid-cols-2 gap-3 md:hidden" aria-hidden>
            {HERO_TILES.slice(0, 4).map((tile) => (
              <li
                key={tile.label}
                className="hero-mobile-tile decor-card flex flex-col gap-1 p-4"
              >
                <span className="font-display text-2xl leading-none text-home-text">{tile.stat}</span>
                <span className="text-[0.62rem] uppercase tracking-wide text-home-muted">{tile.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Scroll "becoming" overlay — laid out to match the Services section
          header (same container, left edge, type) so the zoom resolves onto
          it seamlessly instead of jumping from a centered card. */}
      <div
        ref={revealRef}
        className="pointer-events-none fixed inset-0 z-[var(--z-section-overlay)] opacity-0"
      >
        <div className="mx-auto flex h-full max-w-container flex-col justify-center px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">What we do</p>
          <h2 className="mt-4 max-w-2xl font-display text-display-2 text-home-text">
            Eight services, one accountable team
          </h2>
        </div>
      </div>
    </section>
  );
}
