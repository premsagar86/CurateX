// Privacy Policy — PLAN.md §20.24. Structural placement only; the actual
// legal content requires professional review before publishing (explicit
// note in PLAN.md §20.24) — this is intentionally not real legal copy.
const SECTIONS = [
  "Information we collect",
  "How we use your information",
  "Cookies & analytics",
  "Data sharing & third parties",
  "Data retention",
  "Your rights",
  "Contact us",
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl">Privacy Policy</h1>

      <div className="mt-4 rounded-md border border-warning/40 bg-warning/10 p-4 text-sm">
        <strong>Placeholder — requires professional legal review before publishing.</strong> The
        sections below establish the page&apos;s structure and placement in the sitemap only; the
        actual legal text must be drafted or reviewed by a qualified professional.
      </div>

      <nav className="mt-8 rounded-md border border-border p-4 text-sm">
        <p className="mb-2 font-medium">Contents</p>
        <ol className="list-inside list-decimal">
          {SECTIONS.map((section) => (
            <li key={section}>{section}</li>
          ))}
        </ol>
      </nav>

      <div className="mt-8 flex flex-col gap-6">
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
