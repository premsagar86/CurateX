// Process roadmap — a serpentine "roadway" infographic modelled on a classic
// milestone-road graphic: a thick charcoal road winds top-to-bottom in big
// alternating bends, layered orange badges sit on the apex of each bend, and
// the copy sits in the open space on the opposite side, vertically centred on
// its badge. The road never crosses the text and the text blocks are spaced a
// full band apart, so nothing overlaps. Same layout at every screen — the
// container just gets taller (more room per step) as it narrows, and the
// type / badge sizes step down. Marketing-only; the portal keeps <Timeline>.
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface RoadmapStep {
  label: string;
  description?: string;
  status: "complete" | "current" | "upcoming";
}

const ROAD = "#171717";
const ORANGE = "#F97316";
const ORANGE_BRIGHT = "#FF8A00";
const ORANGE_DARK = "#D95F02";
const BG = "#F5F5F5";
const PAPER = "#FFFFFF";

const STATUS_LABEL: Record<RoadmapStep["status"], string> = {
  complete: "Done",
  current: "You are here",
  upcoming: "Upcoming",
};

// Clean line icons (Lucide geometry), one per stage — cycles if there are
// more steps: search · document · flag · pen · code · check · package · cycle.
const STEP_ICONS: ReactNode[] = [
  <>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </>,
  <>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="15" y2="17" />
  </>,
  <>
    <path d="M5 21V4" />
    <path d="M5 4c3-1.5 6 1.5 9 0s5-1.5 5-1.5v9s-2 0-5 1.5-6-1.5-9 0z" />
  </>,
  <>
    <path d="m14.5 5.5 4 4" />
    <path d="M18.5 9.5 9 19l-5 1 1-5 9.5-9.5a2.83 2.83 0 0 1 4 4Z" />
  </>,
  <>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </>,
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.5 2.5 4.5-5" />
  </>,
  <>
    <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
    <path d="m3 8 9 5 9-5" />
    <path d="M12 13v8" />
    <path d="m7.5 5.5 9 5" />
  </>,
  <>
    <path d="M21 12a9 9 0 1 1-3-6.7" />
    <path d="M21 4v5h-5" />
  </>,
];

function StepIcon({ index }: { index: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[46%] w-[46%] text-[#171717]"
      aria-hidden
    >
      {STEP_ICONS[index % STEP_ICONS.length]}
    </svg>
  );
}

function Badge({ index, current }: { index: number; current: boolean }) {
  return (
    <span className="relative block h-full w-full">
      {/* offset backing disc — flat "layered" depth, like the reference */}
      <span
        className="absolute inset-0 translate-x-[9%] translate-y-[9%] rounded-full"
        style={{ background: ROAD }}
      />
      {/* bright rim */}
      <span className="absolute inset-0 rounded-full" style={{ background: ORANGE_BRIGHT }} />
      {/* main disc with thick charcoal outline */}
      <span
        className="absolute inset-[6%] rounded-full border-[3.5px]"
        style={{ background: ORANGE, borderColor: ROAD }}
      />
      {/* thin inner ring */}
      <span
        className="absolute inset-[19%] rounded-full border"
        style={{ borderColor: "rgba(23,23,23,0.3)" }}
      />
      {current && (
        <span
          className="pointer-events-none absolute -inset-[13%] rounded-full border-2"
          style={{ borderColor: ORANGE_DARK }}
        />
      )}
      <span className="absolute inset-0 grid place-items-center">
        <StepIcon index={index} />
      </span>
    </span>
  );
}

export function ProcessRoadmap({ steps }: { steps: RoadmapStep[] }) {
  const n = steps.length;
  const currentIndex = steps.findIndex((s) => s.status === "current");
  const travelled = currentIndex >= 0 ? (currentIndex + 0.5) / n : 1;

  // Road geometry — stretch-to-fit viewBox, 100 units per step, plus a short
  // lead-in at the top. Wide amplitude + an outward overshoot on the control
  // handles gives the pronounced hook-shaped bends of the reference graphic.
  const RIGHT_X = 76;
  const LEFT_X = 24;
  const OVER = 12;
  const LEAD = 62;
  const H = LEAD + n * 100;
  const nodes = steps.map((_, i) => ({
    x: i % 2 === 0 ? RIGHT_X : LEFT_X,
    y: LEAD + 50 + i * 100,
    right: i % 2 === 0,
  }));
  const pct = (y: number) => `${(y / H) * 100}%`;

  // Enters top-left, sweeps across to the first milestone, then hooks
  // alternately left / right past every node.
  let d = `M ${LEFT_X} 0 C ${LEFT_X} ${nodes[0].y * 0.5} ${nodes[0].x} ${nodes[0].y * 0.32} ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < n; i++) {
    const a = nodes[i - 1];
    const b = nodes[i];
    const gap = b.y - a.y;
    d += ` C ${a.x + (a.right ? OVER : -OVER)} ${a.y + gap * 0.5} ${b.x + (b.right ? OVER : -OVER)} ${b.y - gap * 0.5} ${b.x} ${b.y}`;
  }
  d += ` L ${nodes[n - 1].x} ${H}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border" style={{ background: BG }}>
      <div className="px-4 py-8 sm:px-8 sm:py-12">
        {/* Taller (relative to width) as the screen narrows, so each step keeps
            room even when the copy wraps. Tuned for ~8 steps. */}
        <div className="relative mx-auto w-full [--road-w:22px] aspect-[10/56] sm:[--road-w:30px] sm:aspect-[10/38] md:[--road-w:40px] md:aspect-[10/27] lg:[--road-w:54px] lg:aspect-[10/19] xl:[--road-w:62px] xl:aspect-[10/16]">
          <svg
            viewBox={`0 0 100 ${H}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            <defs>
              <linearGradient id="roadmap-progress" x1="0" y1="0" x2="0" y2="1">
                <stop offset={travelled} stopColor={ORANGE} />
                <stop offset={travelled} stopColor={ORANGE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <path
              d={d}
              fill="none"
              stroke={ROAD}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeWidth: "var(--road-w)" }}
            />
            <path
              d={d}
              fill="none"
              stroke="url(#roadmap-progress)"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ strokeWidth: "var(--road-w)" }}
            />
            <path
              d={d}
              fill="none"
              stroke={PAPER}
              strokeWidth={2.5}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="1.3 1.9"
            />
          </svg>

          {/* badges */}
          {steps.map((step, i) => (
            <span
              key={`b-${step.label}`}
              className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 sm:h-[5rem] sm:w-[5rem] md:h-[6.25rem] md:w-[6.25rem] lg:h-[7.5rem] lg:w-[7.5rem]"
              style={{ left: `${nodes[i].x}%`, top: pct(nodes[i].y) }}
            >
              <Badge index={i} current={step.status === "current"} />
            </span>
          ))}

          {/* copy — opposite side of each badge, centred on it. Both edges are
              pinned so a block can never spill past the card. */}
          {steps.map((step, i) => (
            <div
              key={`t-${step.label}`}
              className={cn(
                "absolute -translate-y-1/2",
                nodes[i].right
                  ? "left-0 right-[46%] pr-3 text-right sm:right-[47%] sm:pr-5 lg:right-[46%]"
                  : "left-[46%] right-0 pl-3 text-left sm:left-[47%] sm:pl-5 lg:left-[46%]"
              )}
              style={{ top: pct(nodes[i].y) }}
            >
              <p
                className="text-[0.55rem] font-bold uppercase tracking-[0.16em] sm:text-[0.65rem] md:text-xs"
                style={{ color: step.status === "upcoming" ? "rgba(23,23,23,0.45)" : ORANGE_DARK }}
              >
                Step {i + 1} · {STATUS_LABEL[step.status]}
              </p>
              <h3 className="mt-1 line-clamp-2 break-words text-[0.85rem] font-bold uppercase leading-[1.08] tracking-[0.02em] text-[#171717] sm:text-lg md:text-xl lg:text-2xl">
                {step.label}
              </h3>
              {step.description && (
                <p className="mt-1.5 line-clamp-2 break-words text-[0.68rem] leading-relaxed text-[#171717]/65 sm:line-clamp-3 sm:text-[0.8rem] md:text-sm">
                  {step.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
