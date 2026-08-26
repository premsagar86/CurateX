// Process — PLAN.md §20.7.
import { Section } from "@/components/ui/section";
import { Timeline, type TimelineStep } from "@/components/ui/timeline";
import { CtaBlock } from "@/components/marketing/cta-block";

const STEPS: TimelineStep[] = [
  { label: "Discovery", description: "We learn your goals, audience, and scope before anything is designed.", status: "complete" },
  { label: "Proposal", description: "A clear, written scope and price — no surprise invoices later.", status: "complete" },
  { label: "Kickoff", description: "Your portal is set up and milestones are scheduled.", status: "complete" },
  { label: "Design", description: "Concepts, then your approval before we build.", status: "complete" },
  { label: "Development / Production", description: "The actual build — tracked milestone by milestone in your portal.", status: "current" },
  { label: "Review", description: "You review the final delivery against the agreed scope.", status: "upcoming" },
  { label: "Delivery", description: "Final files and invoice, and a conversation about ongoing support if useful.", status: "upcoming" },
  { label: "Ongoing Retainer (optional)", description: "Maintenance, SEO, or social management, if it makes sense for you.", status: "upcoming" },
];

export default function ProcessPage() {
  return (
    <>
      <Section heading="Our process" body="A visible, step-by-step process — not a black box between kickoff and delivery.">
        <Timeline steps={STEPS} />
      </Section>

      <Section
        heading="See it while it's happening"
        body="Every active project lives in a client portal — track milestones, approve deliverables, and message your team directly, without waiting on a status-update email."
      >
        <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-border bg-surface-elevated text-sm text-text-muted">
          Portal preview
        </div>
      </Section>

      <CtaBlock />
    </>
  );
}
