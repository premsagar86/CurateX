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
    <section className="section-y relative overflow-hidden px-6">
      <span
        aria-hidden
        className="decor-numeral pointer-events-none absolute right-6 top-0 text-ghost text-home-text/[0.03]"
      >
        &ldquo;
      </span>

      <div className="relative mx-auto max-w-container">
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Clients</p>
          <h2 className="mt-4 font-display text-display-2 text-home-text">What it&apos;s like to work with us</h2>
        </div>

        <div ref={containerRef} className="grid gap-5 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <figure
              key={testimonial.id}
              data-reveal
              className={`glass motion-decor rounded-lg p-6 sm:p-8 ${index % 2 ? "md:mt-10 md:animate-float" : ""}`}
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
