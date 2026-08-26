// 404 page — PLAN.md §20.21.
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="font-display text-3xl">Page not found</h1>
      <p className="text-text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="text-primary underline">
        Go to homepage
      </Link>
    </main>
  );
}
