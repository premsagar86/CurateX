// Google Analytics 4 event wrapper — site.md §4. GA4 script itself is
// loaded once in app/layout.tsx; this wrapper is the single call site
// every feature uses, so swapping providers later changes one file.
export function trackEvent(name: string, params?: Record<string, string | number>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", name, params);
  }
}
