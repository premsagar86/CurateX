// Loads the Sentry server/edge config via Next.js's instrumentation hook,
// per @sentry/nextjs v8's recommended setup (avoids the build-time warning
// telling you to do exactly this). site.md §3.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
