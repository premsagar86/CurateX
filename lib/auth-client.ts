// Better Auth client-side hooks — site.md §2.3.
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // The auth API is same-origin (/api/auth/*), so in the browser the real
  // origin is always correct — and avoids the build-time-inlined
  // NEXT_PUBLIC_APP_URL shipping a stale localhost value to production.
  // The env value is only a fallback for SSR of this module.
  baseURL:
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL,
});

export const { signIn, signOut, signUp, changePassword, useSession } = authClient;
