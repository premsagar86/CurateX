// Timeline — renders a sequence of dated/staged events. Directly renders the
// project state machine (§34) or the client-facing pipeline (§20.7) — not a
// generic free-text widget. PLAN.md §16.4.
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface TimelineStep {
  label: string;
  description?: string;
  status: "complete" | "current" | "upcoming";
}

const STATUS_BADGE: Record<TimelineStep["status"], { label: string; variant: "success" | "info" | "neutral" }> = {
  complete: { label: "Done", variant: "success" },
  current: { label: "In progress", variant: "info" },
  upcoming: { label: "Upcoming", variant: "neutral" },
};

export function Timeline({ steps, orientation = "vertical" }: { steps: TimelineStep[]; orientation?: "vertical" | "horizontal" }) {
  return (
    <ol
      className={cn(
        orientation === "vertical" ? "flex flex-col gap-6" : "flex flex-wrap gap-6"
      )}
    >
      {steps.map((step, index) => (
        <li key={step.label} className="flex items-start gap-3">
          <span
            className={cn(
              "mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
              step.status === "complete" && "bg-success text-white",
              step.status === "current" && "bg-primary text-white",
              step.status === "upcoming" && "bg-surface-elevated text-text-muted"
            )}
          >
            {index + 1}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{step.label}</p>
              <Badge variant={STATUS_BADGE[step.status].variant}>{STATUS_BADGE[step.status].label}</Badge>
            </div>
            {step.description && <p className="mt-1 text-sm text-text-muted">{step.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
