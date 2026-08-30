"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { getGsap, EASE } from "./motion/gsap-setup";

// The Flip scatter + depth parallax is desktop-only. On a single-column
// mobile layout the randomised offsets just fought the flow; cards render
// statically there (they already carry real content).
const DESKTOP_MOTION_QUERY = "(prefers-reduced-motion: no-preference) and (min-width: 768px)";

export interface WorkItem {
  id: string;
  slug: string;
  title: string;
  services: string[];
}

const ROTATIONS = ["md:-rotate-1", "md:rotate-1", "md:-rotate-1"];
const SPANS = ["md:col-span-3 md:row-span-2", "md:col-span-3 md:mt-12", "md:col-span-3 md:mt-4"];
// Mobile: first project full-bleed, the rest paired two-up — grouped, not
// a single stacked column.
const MOBILE_SPANS = ["col-span-2", "col-span-1", "col-span-1"];

function gradientFor(title: string) {
  const hash = [...title].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const hue = hash % 360;
  return `linear-gradient(135deg, hsl(${hue} 70% 30%), hsl(${(hue + 60) % 360} 70% 18%))`;
}

export function WorkScatter({ items }: { items: WorkItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || items.length === 0) return;
    const { gsap, ScrollTrigger, Flip } = getGsap();
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION_QUERY, () => {
        const cards = gsap.utils.toArray<HTMLElement>(".work-card", containerRef.current!);
        if (cards.length === 0) return;

        // Depth-plane parallax once settled.
        cards.forEach((card, i) => {
          gsap.to(card, {
            y: (i - 1) * -50,
            ease: "none",
            scrollTrigger: { trigger: containerRef.current, start: "top bottom", end: "bottom top", scrub: 1 },
          });
        });

        const st = ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 75%",
          once: true,
          onEnter: () => {
            const state = Flip.getState(cards);
            cards.forEach((card, i) => {
              const seed = Math.sin(i * 999) * 1000;
              gsap.set(card, {
                x: (seed % 260) - 130,
                y: (Math.sin(i * 55) * 500) % 220,
                rotate: (Math.cos(i * 33) * 180) % 40,
                scale: 0.6,
                autoAlpha: 0,
              });
            });
            Flip.from(state, {
              duration: 1.1,
              ease: EASE.elastic,
              stagger: 0.1,
              absolute: true,
              scale: true,
              onComplete: () => gsap.set(cards, { clearProps: "transform,opacity" }),
            });
          },
        });

        return () => st.kill();
      });
    }, containerRef);

    return () => ctx.revert();
  }, [items]);

  return (
    <section className="section-y relative mx-auto max-w-container px-6 [perspective:1400px]">
      <div className="mb-6 max-w-2xl md:mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Work</p>
        <h2 className="mt-3 font-display text-display-2 text-home-text">Recent projects</h2>
      </div>

      {items.length === 0 ? (
        <div className="glass flex min-h-[40vh] flex-col items-center justify-center rounded-lg px-6 text-center">
          <p className="font-display text-display-3 text-home-text">First case studies coming soon</p>
          <p className="mt-3 max-w-sm text-home-muted">
            We&apos;re just getting started — check back soon, or see our current process instead.
          </p>
        </div>
      ) : (
        <div ref={containerRef} className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-6 md:gap-6">
          {items.map((item, index) => (
            <Link
              key={item.id}
              href={`/work/${item.slug}`}
              className={`work-card group relative flex aspect-video flex-col justify-end overflow-hidden rounded-lg border border-home-border p-4 sm:p-6 ${MOBILE_SPANS[index % MOBILE_SPANS.length]} ${SPANS[index % SPANS.length]} ${ROTATIONS[index % ROTATIONS.length]}`}
              style={{ backgroundImage: gradientFor(item.title) }}
            >
              <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <h3 className="relative font-display text-lg text-white sm:text-2xl md:text-3xl">{item.title}</h3>
              {item.services.length > 0 && (
                <div className="relative mt-2 hidden flex-wrap gap-2 sm:flex">
                  {item.services.map((service) => (
                    <span key={service} className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium text-white">
                      {service}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
