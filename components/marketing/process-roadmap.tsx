// Process roadmap — a serpentine "roadway" infographic modelled on a classic
// milestone-road graphic: a thick charcoal road winds top-to-bottom in big
// alternating bends, layered orange badges sit on the apex of each bend, and
// the copy sits in the open space on the opposite side, vertically centred on
// its badge. The road never crosses the text and the text blocks are spaced a
// full band apart, so nothing overlaps. Same layout at every screen — the
// container just gets taller (more room per step) as it narrows, and the
// type / badge sizes step down. Marketing-only; the portal keeps <Timeline>.
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

// Simple bold line icons, one per stage (cycles if there are more steps).
const STEP_ICONS: string[][] = [
  ["M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12z", "m20 20-4.2-4.2"],
  ["M7 3h8l4 4v14H7z", "M15 3v4h4", "M10 12h6", "M10 16h6"],
  ["M6 21V4", "M6 5h12l-2.5 3.5L18 12H6"],
  ["M4 20l3.6-.8L18.4 8.4a2 2 0 0 0-2.8-2.8L4.8 16.4 4 20z", "M14.5 6.5 17.5 9.5"],
  ["m9 8-4 4 4 4", "m15 8 4 4-4 4"],
  ["M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z", "M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"],
  ["M12 3 21 8v8l-9 5-9-5V8z", "M3 8l9 5 9-5", "M12 13v8"],
  ["M20 11a8 8 0 0 0-14-4", "M4 5v4h4", "M4 13a8 8 0 0 0 14 4", "M20 19v-4h-4"],
];

function StepIcon({ index }: { index: number }) {
  const paths = STEP_ICONS[index % STEP_ICONS.length];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[42%] w-[42%] text-[#171717]"
      aria-hidden
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

function Badge({ index, current }: { index: number; current: boolean }) {
  return (
    <span className="relative block h-full w-full">
      {/* offset backing ring — flat "layered" depth */}
      <span
        className="absolute inset-0 translate-x-[7%] translate-y-[7%] rounded-full border-2"
        style={{ borderColor: ROAD, background: BG }}
      />
      <span className="absolute inset-0 rounded-full" style={{ background: ORANGE_BRIGHT }} />
      <span
        className="absolute inset-[7%] rounded-full border-[3px]"
        style={{ background: ORANGE, borderColor: ROAD }}
      />
      <span
        className="absolute inset-[20%] rounded-full border"
        style={{ borderColor: "rgba(23,23,23,0.28)" }}
      />
      {current && (
        <span
          className="pointer-events-none absolute -inset-[12%] rounded-full border-2"
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
  // lead-in at the top so the first milestone isn't jammed against the edge.
  const RIGHT_X = 72;
  const LEFT_X = 28;
  const LEAD = 60;
  const H = LEAD + n * 100;
  const nodes = steps.map((_, i) => ({
    x: i % 2 === 0 ? RIGHT_X : LEFT_X,
    y: LEAD + 50 + i * 100,
    right: i % 2 === 0,
  }));
  const pct = (y: number) => `${(y / H) * 100}%`;

  // Enters top-left, curves across to the first milestone, then alternates.
  let d = `M ${LEFT_X} 0 C ${LEFT_X} ${nodes[0].y * 0.6} ${nodes[0].x} ${nodes[0].y * 0.4} ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < n; i++) {
    const a = nodes[i - 1];
    const b = nodes[i];
    const my = (a.y + b.y) / 2;
    d += ` C ${a.x} ${my} ${b.x} ${my} ${b.x} ${b.y}`;
  }
  d += ` L ${nodes[n - 1].x} ${H}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border" style={{ background: BG }}>
      <div className="px-4 py-8 sm:px-8 sm:py-12">
        {/* Taller (relative to width) as the screen narrows, so each step keeps
            room even when the copy wraps. Tuned for ~8 steps. */}
        <div className="relative mx-auto w-full [--road-w:22px] aspect-[10/56] sm:[--road-w:28px] sm:aspect-[10/38] md:[--road-w:34px] md:aspect-[10/28] lg:[--road-w:40px] lg:aspect-[10/22] xl:aspect-[10/18]">
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
              className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 sm:h-[4.75rem] sm:w-[4.75rem] md:h-[5.5rem] md:w-[5.5rem]"
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
                  ? "left-0 right-[46%] pr-3 text-right sm:right-[48%] sm:pr-4"
                  : "left-[46%] right-0 pl-3 text-left sm:left-[48%] sm:pl-4"
              )}
              style={{ top: pct(nodes[i].y) }}
            >
              <p
                className="text-[0.55rem] font-bold uppercase tracking-[0.14em] sm:text-[0.65rem] md:text-xs"
                style={{ color: step.status === "upcoming" ? "rgba(23,23,23,0.45)" : ORANGE_DARK }}
              >
                Step {i + 1} · {STATUS_LABEL[step.status]}
              </p>
              <h3 className="mt-1 line-clamp-2 break-words text-[0.82rem] font-bold uppercase leading-tight tracking-[0.03em] text-[#171717] sm:text-base md:text-lg lg:text-xl">
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
