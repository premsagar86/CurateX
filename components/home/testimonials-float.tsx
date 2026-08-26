"use client";

import { useEffect, useRef } from "react";
import { Avatar } from "@/components/ui/avatar";
import { revealBatch } from "./motion/reveal-batch";

export interface TestimonialItem {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string | null;
}

export function TestimonialsFloat({ testimonials }: { testimonials: TestimonialItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const mm = revealBatch(containerRef.current, "[data-reveal]", { from: { y: 50, scale: 0.94 }, stagger: 0.12 });
    return () => mm.revert();
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="relative overflow-hidden px-6 py-24 md:py-32">
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-8 -translate-x-1/2 select-none font-display text-ghost text-white/[0.04]"
      >
        &ldquo;
      </span>

      <div className="relative mx-auto max-w-container">
        <div className="mb-12 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Clients</p>
          <h2 className="mt-3 font-display text-display-2 text-home-text">What it&apos;s like to work with us</h2>
        </div>

        <div ref={containerRef} className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <figure
              key={testimonial.id}
              data-reveal
              className={`glass motion-decor rounded-[2rem] p-8 ${index % 2 ? "animate-float md:mt-10" : ""}`}
            >
              <blockquote className="font-display text-xl text-home-text md:text-2xl">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar name={testimonial.authorName} size="sm" />
                <div>
                  <p className="text-sm font-medium text-home-text">{testimonial.authorName}</p>
                  {testimonial.authorRole && <p className="text-xs text-home-muted">{testimonial.authorRole}</p>}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
