// Marketing site shell — nav + footer. PLAN.md §16.6, §25.1.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-[var(--z-sticky)] border-b border-border bg-surface px-6 py-4">
        <nav className="mx-auto flex max-w-container items-center justify-between">
          <span className="font-display text-lg tracking-tight">forge</span>
          {/* TODO: full nav per PLAN.md §16.6 / §17.2 */}
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border px-6 py-8 text-sm text-text-muted">
        {/* TODO: full footer per PLAN.md §16.6 */}
        <p className="mx-auto max-w-container">© {new Date().getFullYear()} Forge Digital</p>
      </footer>
    </div>
  );
}
