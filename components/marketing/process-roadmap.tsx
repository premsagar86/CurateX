// Process roadmap — a serpentine "roadway" infographic. A continuous charcoal
// road winds top-to-bottom in U-bends; large orange milestone badges sit on
// the bends with a heading + blurb in the open space beside them. Flat
// vector, editorial. Marketing-only — the portal keeps the plain <Timeline>.
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
const PAPER = "#FFFFFF";

const STATUS_LABEL: Record<RoadmapStep["status"], string> = {
  complete: "Done",
  current: "You are here",
  upcoming: "Upcoming",
};

// Simple bold line icons, one per stage (cycles if there are more steps).
const STEP_ICONS: string[][] = [
  ["M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12z", "m20 20-4.2-4.2"], // discovery / search
  ["M7 3h8l4 4v14H7z", "M15 3v4h4", "M10 12h6", "M10 16h6"], // proposal / doc
  ["M6 21V4", "M6 5h12l-2.5 3.5L18 12H6"], // kickoff / flag
  ["M4 20l3.6-.8L18.4 8.4a2 2 0 0 0-2.8-2.8L4.8 16.4 4 20z", "M14.5 6.5 17.5 9.5"], // design / pencil
  ["m9 8-4 4 4 4", "m15 8 4 4-4 4"], // build / code
  ["M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12z", "M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"], // review / eye
  ["M12 3 21 8v8l-9 5-9-5V8z", "M3 8l9 5 9-5", "M12 13v8"], // delivery / package
  ["M20 11a8 8 0 0 0-14-4", "M4 5v4h4", "M4 13a8 8 0 0 0 14 4", "M20 19v-4h-4"], // retainer / cycle
];

function StepIcon({ index, className }: { index: number; className?: string }) {
  const paths = STEP_ICONS[index % STEP_ICONS.length];
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

function Badge({ index, size }: { index: number; size: "sm" | "lg" }) {
  const px = size === "lg" ? "h-20 w-20" : "h-16 w-16";
  const inner = size === "lg" ? "h-[4.25rem] w-[4.25rem]" : "h-[3.4rem] w-[3.4rem]";
  const ring = size === "lg" ? "h-[3.4rem] w-[3.4rem]" : "h-[2.7rem] w-[2.7rem]";
  const icon = size === "lg" ? "h-8 w-8" : "h-6 w-6";
  return (
    <span className={cn("relative grid place-items-center", px)}>
      <span className="absolute inset-0 rounded-full" style={{ background: ORANGE_BRIGHT }} />
      <span
        className={cn("absolute inset-0 m-auto rounded-full border-[3px]", inner)}
        style={{ background: ORANGE, borderColor: ROAD }}
      />
      <span
        className={cn("absolute inset-0 m-auto rounded-full border", ring)}
        style={{ borderColor: "rgba(23,23,23,0.22)" }}
      />
      <StepIcon index={index} className={cn("relative", icon)} />
    </span>
  );
}

function StepText({ step, index, align }: { step: RoadmapStep; index: number; align: "left" | "right" }) {
  return (
    <div className={align === "right" ? "text-right" : "text-left"}>
      <p
        className="text-[0.68rem] font-bold uppercase tracking-[0.14em]"
        style={{ color: step.status === "upcoming" ? "rgba(23,23,23,0.45)" : ORANGE_DARK }}
      >
        Step {index + 1} · {STATUS_LABEL[step.status]}
      </p>
      <h3 className="mt-1 text-lg font-bold uppercase leading-tight tracking-[0.04em] text-[#171717] sm:text-xl">
        {step.label}
      </h3>
      {step.description && (
        <p className="mt-1.5 text-sm leading-relaxed text-[#171717]/65">{step.description}</p>
      )}
    </div>
  );
}

export function ProcessRoadmap({ steps }: { steps: RoadmapStep[] }) {
  const n = steps.length;
  const currentIndex = steps.findIndex((s) => s.status === "current");
  const travelled = currentIndex >= 0 ? (currentIndex + 0.5) / n : 1;

  // --- desktop serpentine geometry (SVG user units) -----------------------
  const VB_W = 1000;
  const BAND = 210;
  const H = n * BAND;
  const LEFT_X = 205;
  const RIGHT_X = VB_W - 205;
  const nodes = steps.map((_, i) => ({
    x: i % 2 === 0 ? LEFT_X : RIGHT_X,
    y: BAND / 2 + i * BAND,
    left: i % 2 === 0,
  }));

  let d = `M ${nodes[0].x} 0 L ${nodes[0].x} ${nodes[0].y}`;
  for (let i = 1; i < n; i++) {
    const a = nodes[i - 1];
    const b = nodes[i];
    const my = (a.y + b.y) / 2;
    d += ` C ${a.x} ${my} ${b.x} ${my} ${b.x} ${b.y}`;
  }
  d += ` L ${nodes[n - 1].x} ${H}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border" style={{ background: PAPER }}>
      {/* ------------------------------ mobile ----------------------------- */}
      <ol className="relative space-y-9 px-5 py-8 pl-[6.5rem] md:hidden">
        <span className="absolute bottom-6 left-9 top-6 w-9 rounded-full" style={{ background: ROAD }} />
        <span
          className="absolute left-9 top-6 w-9 rounded-full"
          style={{ background: ORANGE, height: `calc(${travelled * 100}% - 3rem)` }}
        />
        <span
          aria-hidden
          className="absolute bottom-8 left-[3.35rem] top-8 w-[3px]"
          style={{ background: `repeating-linear-gradient(${PAPER} 0 13px, transparent 13px 28px)` }}
        />
        {steps.map((step, i) => (
          <li key={step.label} className="relative">
            <span className="absolute -left-[5.05rem] top-0 grid place-items-center">
              <Badge index={i} size="sm" />
              {step.status === "current" && (
                <span
                  className="pointer-events-none absolute inset-0 m-auto h-[4.6rem] w-[4.6rem] rounded-full border-2"
                  style={{ borderColor: ORANGE_DARK }}
                />
              )}
            </span>
            <StepText step={step} index={i} align="left" />
          </li>
        ))}
      </ol>

      {/* ------------------------------ desktop --------------------------- */}
      <div className="relative hidden px-8 py-10 md:block">
        <div className="relative mx-auto w-full" style={{ aspectRatio: `${VB_W} / ${H}` }}>
          <svg viewBox={`0 0 ${VB_W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
            <path d={d} fill="none" stroke={ROAD} strokeWidth={74} strokeLinecap="round" strokeLinejoin="round" />
            <path
              d={d}
              fill="none"
              stroke={ORANGE}
              strokeWidth={74}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1 - travelled}
            />
            <path
              d={d}
              fill="none"
              stroke={PAPER}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray="16 24"
            />
          </svg>

          {nodes.map((node, i) => (
            <div
              key={`node-${steps[i].label}`}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(node.x / VB_W) * 100}%`, top: `${(node.y / H) * 100}%` }}
            >
              <span className="relative grid place-items-center">
                <Badge index={i} size="lg" />
                {steps[i].status === "current" && (
                  <span
                    className="pointer-events-none absolute inset-0 m-auto h-24 w-24 rounded-full border-2"
                    style={{ borderColor: ORANGE_DARK }}
                  />
                )}
              </span>
            </div>
          ))}

          {nodes.map((node, i) => (
            <div
              key={`text-${steps[i].label}`}
              className="absolute -translate-y-1/2"
              style={{
                top: `${(node.y / H) * 100}%`,
                width: "33%",
                left: node.left ? `${((node.x + 155) / VB_W) * 100}%` : "auto",
                right: node.left ? "auto" : `${((VB_W - (node.x - 155)) / VB_W) * 100}%`,
              }}
            >
              <StepText step={steps[i]} index={i} align={node.left ? "left" : "right"} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
