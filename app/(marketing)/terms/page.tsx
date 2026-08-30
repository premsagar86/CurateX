// Terms of Service — PLAN.md §20.24. Structural placement only; the actual
// legal content requires professional review before publishing (explicit
// note in PLAN.md §20.24) — this is intentionally not real legal copy.
const SECTIONS = [
  "Acceptance of terms",
  "Services & scope",
  "Payment terms",
  "Revisions & change orders",
  "Intellectual property",
  "Limitation of liability",
  "Termination",
  "Governing law",
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl">Terms of Service</h1>

      <div className="mt-3 rounded-md border border-warning/40 bg-warning/10 p-4 text-sm">
        <strong>Placeholder — requires professional legal review before publishing.</strong> The
        sections below establish the page&apos;s structure and placement in the sitemap only; the
        actual legal text must be drafted or reviewed by a qualified professional.
      </div>

      <nav className="mt-6 rounded-md border border-border p-4 text-sm">
        <p className="mb-2 font-medium">Contents</p>
        <ol className="list-inside list-decimal">
          {SECTIONS.map((section) => (
            <li key={section}>{section}</li>
          ))}
        </ol>
      </nav>

      <div className="mt-6 flex flex-col gap-5">
        {SECTIONS.map((section) => (
          <section key={section}>
            <h2 className="font-display text-lg">{section}</h2>
            <p className="mt-2 text-sm text-text-muted">[Placeholder — pending legal review.]</p>
          </section>
        ))}
      </div>
    </div>
  );
}
