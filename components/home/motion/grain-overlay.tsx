// Single fixed film-grain layer shared by every homepage section — gives the
// whole page one textured identity instead of each card faking its own noise.
const GRAIN_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
      <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter>
      <rect width='100%' height='100%' filter='url(#n)'/>
    </svg>`
  );

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[999] opacity-[0.05] mix-blend-overlay"
      style={{ backgroundImage: `url("${GRAIN_SVG}")`, backgroundSize: "160px 160px" }}
    />
  );
}
