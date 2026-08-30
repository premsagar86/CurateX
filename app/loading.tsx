// Root loading UI — shown while the first route streams (and on subsequent
// navigations that suspend). CSS-only and dependency-free so it paints
// instantly.
//
// Motion design: restraint over spectacle. Two beats only — a warm glow that
// breathes and an indeterminate sweep — on slow, standard easing so a wait
// reads as calm, not frantic. The glow + "forge" wordmark echo the hero, so
// the handoff to the real page feels like one continuous moment. Fully
// static under prefers-reduced-motion.
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center overflow-hidden bg-[#0d0b09]"
    >
      {/* Breathing warm glow — same language as the hero's atmospheric blob. */}
      <div
        aria-hidden
        className="pointer-events-none absolute h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-[120px] animate-loader-breathe motion-decor"
      />

      <div className="relative flex flex-col items-center gap-7 animate-loader-rise">
        <span className="font-display text-5xl font-bold tracking-tight text-primary">forge</span>

        {/* Indeterminate track — a single lit segment sweeping across a hairline. */}
        <span className="loader-track relative block h-px w-40 overflow-hidden rounded-full bg-white/10">
          <span className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-primary animate-loader-sweep" />
        </span>

        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
}
