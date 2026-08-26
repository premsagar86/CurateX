// Sentry-backed error logger — site.md §3. Single call site so every
// feature reports errors the same way (console + Sentry).
import * as Sentry from "@sentry/nextjs";

export function logError(error: unknown, context?: Record<string, unknown>) {
  console.error(error);
  Sentry.captureException(error, { extra: context });
}
