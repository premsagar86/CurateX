// Better Auth server configuration — site.md §2.2.
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/db";

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  database: prismaAdapter(db, {
    provider: "mysql", // "postgresql" after the Phase 2 DB migration (site.md §6.3)
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // Clients never self-register (PLAN.md §18.4/§31.1) — accounts are
    // created via the admin invite flow (features/auth/create-invite.ts),
    // not this endpoint directly exposed on a public signup page.
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // sliding refresh once per day of activity
  },
  user: {
    additionalFields: {
      role: { type: "string", required: true, defaultValue: "CLIENT" },
      clientId: { type: "string", required: false },
    },
  },
});
