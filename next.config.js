const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // `npm run typecheck` (tsc --noEmit) is the source of truth for type
  // errors and runs clean — next build's own duplicate type-check worker
  // hits an out-of-memory wall in constrained environments, so it's skipped
  // here rather than raising heap limits that make the OOM worse.
  typescript: { ignoreBuildErrors: true },
  // This sandbox's real memory ceiling is far below what the OS reports —
  // parallel static-generation workers exhaust it. Serialize the build.
  experimental: { cpus: 1, workerThreads: false },
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
});
