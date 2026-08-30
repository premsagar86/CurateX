// Roadmap view of the engagement — a marked path with a filled track up to
// "you are here" and dimmed milestones after. Marketing-only; the portal
// keeps the plain <Timeline> primitive.
import { cn } from "@/lib/utils";

export interface RoadmapStep {
  label: string;
  description?: string;
  status: "complete" | "current" | "upcoming";
}

const CHIP: Record<RoadmapStep["status"], { text: string; className: string }> = {
  complete: { text: "Done", className: "bg-primary/10 text-primary" },
  current: { text: "You are here", className: "bg-primary text-white" },
  upcoming: { text: "Upcoming", className: "bg-surface-elevated text-text-muted" },
};

export function ProcessRoadmap({ steps }: { steps: RoadmapStep[] }) {
  const currentIndex = steps.findIndex((s) => s.status === "current");
  const active = currentIndex >= 0 ? steps[currentIndex] : undefined;
  // Rough fill target: the centre of the current node.
  const fillPct = currentIndex >= 0 ? ((currentIndex + 0.5) / steps.length) * 100 : 100;

  return (
    <div>
      {active && (
        <div className="mb-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-lg border border-primary/30 bg-primary/[0.04] px-4 py-3">
          <span className="text-sm font-semibold text-primary">
            Step {currentIndex + 1} of {steps.length}
          </span>
          <span className="font-display text-base">{active.label}</span>
        </div>
      )}

      <ol className="relative pl-10 sm:pl-12">
        {/* the road */}
        <span aria-hidden className="absolute bottom-3 left-[13px] top-3 w-0.5 rounded-full bg-border sm:left-[15px]" />
        <span
          aria-hidden
          className="absolute left-[13px] top-3 w-0.5 rounded-full bg-primary sm:left-[15px]"
          style={{ height: `${fillPct}%` }}
        />

        {steps.map((step, i) => {
          const chip = CHIP[step.status];
          return (
            <li key={step.label} className="relative pb-9 last:pb-0">
              {/* milestone marker */}
              <span
                className={cn(
                  "absolute -left-10 top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 font-display text-sm font-semibold sm:-left-12 sm:h-9 sm:w-9",
                  step.status === "complete" && "border-primary bg-primary text-white",
                  step.status === "current" && "border-primary bg-surface text-primary ring-4 ring-primary/20",
                  step.status === "upcoming" && "border-border bg-surface text-text-muted"
                )}
              >
                {step.status === "complete" ? "✓" : i + 1}
              </span>

              <div
                className={cn(
                  "rounded-lg border p-4 sm:p-5",
                  step.status === "current"
                    ? "border-primary/40 bg-primary/[0.05] shadow-sm"
                    : "border-border bg-surface",
                  step.status === "upcoming" && "opacity-90"
                )}
              >
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h3 className="font-display text-lg leading-tight">{step.label}</h3>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wide",
                      chip.className
                    )}
                  >
                    {chip.text}
                  </span>
                </div>
                {step.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{step.description}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
