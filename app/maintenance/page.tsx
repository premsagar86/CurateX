// Maintenance Page — PLAN.md §20.23. Static page only; no maintenance-mode
// toggle/middleware wiring.
export default function MaintenancePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-6 text-center">
      <span className="font-display text-lg tracking-tight">forge</span>
      <h1 className="mt-6 font-display text-2xl">We&apos;ll be back shortly</h1>
      <p className="mt-4 text-sm text-text-muted">
        Forge Digital is temporarily unavailable while we make some updates. We expect to be back online
        shortly — thanks for your patience.
      </p>
      <p className="mt-6 text-sm">
        Urgent? Email us at{" "}
        <a href="mailto:hello@forgedigital.in" className="underline">
          hello@forgedigital.in
        </a>
      </p>
    </main>
  );
}
