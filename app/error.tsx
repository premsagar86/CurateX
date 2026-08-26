// Global error boundary — PLAN.md §20.22 (never expose stack traces to the
// user); site.md §3 (reports to Sentry).
"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="font-display text-3xl">Something went wrong.</h1>
      <p className="text-text-muted">
        Our team has been notified. Please try again, or contact support if this continues.
      </p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
