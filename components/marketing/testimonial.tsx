// Testimonial — client quote/social proof. Never fabricated or paraphrased
// beyond light editing for length (§64 — explicit prohibition on
// fake/composited testimonials). PLAN.md §16.5.
import { Avatar } from "@/components/ui/avatar";
import type { Testimonial as TestimonialRow } from "@prisma/client";

export function Testimonial({ testimonial }: { testimonial: Pick<TestimonialRow, "quote" | "authorName" | "authorRole"> }) {
  return (
    <figure className="rounded-lg border border-border bg-surface p-6">
      <blockquote className="text-lg">&ldquo;{testimonial.quote}&rdquo;</blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <Avatar name={testimonial.authorName} size="sm" />
        <div>
          <p className="text-sm font-medium">{testimonial.authorName}</p>
          {testimonial.authorRole && <p className="text-xs text-text-muted">{testimonial.authorRole}</p>}
        </div>
      </figcaption>
    </figure>
  );
}
