# site.md — Forge Digital Technical Stack & Design System

This document reorganizes decisions from `PLAN.md` into an implementation-ready stack (with phasing for cost-sensitive infra) plus the full design system extracted from `PLAN.md` §07 and §12–17.

**Auth, error tracking, and analytics are no longer phased** — Better Auth, Sentry, and GA4 are all viable and low/no-cost from Day 0, so they're used from launch rather than being deferred behind a hand-rolled Phase 1 substitute.

**Still phased** (cost/complexity reasons per `PLAN.md` §02.3):
- **Phase 1:** MySQL, local/simple file storage, manual/offline payments.
- **Phase 2:** Cloudflare R2 (storage upgrade), Razorpay (live payment gateway), optional MySQL → PostgreSQL migration.

---

## 1. Stack Summary

| Layer | Choice | Phase |
|---|---|---|
| Frontend framework | **Next.js (App Router) + React + TypeScript** | Day 0 |
| Styling | **Tailwind CSS** | Day 0 |
| UI primitives |**Radix UI** | Day 0 |
| Backend | **Next.js Route Handlers + Server Actions**| Day 0 |
| **Database** | **MySQL** → **PostgreSQL** (optional migration) | Phase 1 → Phase 2 |
| ORM | Prisma | Day 0 |
| **Auth** | **Better Auth** | Day 0 |
| **File storage** | Local/simple storage → **Cloudflare R2** | Phase 1 → Phase 2 |
| **Payments** | Manual/offline → **Razorpay** | Phase 1 → Phase 2 |
| **Analytics** | **Google Analytics 4 (GA4)** | Day 0 |
| **Error tracking** | **Sentry** | Day 0 |
| Hosting | **Vercel** | Day 0 |
| CI/CD | **GitHub Actions + Vercel Git integration** | Day 0 |

---

## 2. Auth — Better Auth

Replaces both the hand-rolled JWT-cookie approach and Auth.js from earlier drafts. Better Auth is chosen because it ships a first-class Prisma adapter, framework-agnostic core, and built-in session management without the extra adapter/config overhead Auth.js's database-session model required — while still being self-hosted (no per-user vendor cost, consistent with `PLAN.md` §51's cost sensitivity).

### 2.1 Database schema (Prisma — Better Auth's required tables)

```prisma
// prisma/schema.prisma
datasource db {
  provider = "mysql" // "postgresql" after the Phase 2 migration (§6)
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id                String   @id @default(uuid())
  name              String
  email             String   @unique
  emailVerified     Boolean  @default(false)
  image             String?
  role              String   @default("CLIENT") // "CLIENT" | "TEAM"
  clientId          String?  // set only when role = "CLIENT", links to Client.id
  phone             String?  // added for Settings, §20.19 — not in the original schema draft
  notificationPrefs Json?    // per-notification-type Switch state, §20.19/§37.4 — added for the same reason
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  sessions Session[]
  accounts Account[]

  @@map("user")
}

model Session {
  id        String   @id @default(uuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("session")
}

model Account {
  id                    String    @id @default(uuid())
  userId                String
  accountId             String
  providerId            String    // "credential" for email/password
  password              String?   // hashed, credential provider only
  accessToken           String?
  refreshToken          String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("account")
}

model Verification {
  id         String   @id @default(uuid())
  identifier String   // email, for password-reset / email-verification tokens
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())

  @@map("verification")
}
```

### 2.2 Server configuration

```ts
// lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "mysql", // "postgresql" after §6's migration
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // Clients never self-register (PLAN.md §18.4/§31.1) — accounts are created
    // via the admin invite flow (features/auth/create-invite.ts), not this
    // endpoint directly exposed on a public signup page.
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24,       // sliding refresh once per day of activity
  },
  user: {
    additionalFields: {
      role: { type: "string", required: true, defaultValue: "CLIENT" },
      clientId: { type: "string", required: false },
    },
  },
});
```

```ts
// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
```

### 2.3 Client-side hooks

```ts
// lib/auth-client.ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
});

export const { signIn, signOut, useSession } = authClient;
```

```tsx
// components/portal/login-form.tsx (usage example)
import { signIn } from "@/lib/auth-client";

async function handleLogin(email: string, password: string) {
  const { error } = await signIn.email({ email, password });
  if (error) {
    // show inline error per PLAN.md §16.1 Input error-state spec
  }
}
```

### 2.4 Route protection

```ts
// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const PROTECTED = ["/dashboard", "/projects", "/invoices", "/settings", "/admin"];

export async function middleware(req: NextRequest) {
  const isProtected = PROTECTED.some((p) => req.nextUrl.pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.redirect(new URL("/login", req.url));

  if (req.nextUrl.pathname.startsWith("/admin") && session.user.role !== "TEAM") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/invoices/:path*",
    "/settings/:path*",
    "/admin/:path*",
  ],
};
```

---

## 3. Error Tracking — Sentry

```ts
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

```ts
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

```ts
// lib/logger.ts
import * as Sentry from "@sentry/nextjs";

export function logError(error: unknown, context?: Record<string, unknown>) {
  console.error(error);
  Sentry.captureException(error, { extra: context });
}
```

```tsx
// app/error.tsx — per PLAN.md §20.22, never expose stack traces to the user
"use client";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function ErrorPage({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong.</h2>
      <p>Our team has been notified. Please try again, or contact support if this continues.</p>
    </div>
  );
}
```

---

## 4. Analytics — Google Analytics 4 (GA4)

**Divergence note:** `PLAN.md` §23.2/§38.7/§40 originally chose Plausible specifically to avoid a cookie-consent banner and keep PII out of a third-party analytics vendor. GA4 uses cookies and cross-site identifiers, so adopting it re-introduces that requirement — a cookie-consent banner should be added (§40) if this substitution is finalized, and PII should still never be sent as an event parameter (§38.7 continues to apply regardless of provider).

```tsx
// app/layout.tsx
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { anonymize_ip: true });
          `}
        </Script>
      </body>
    </html>
  );
}
```

```ts
// lib/analytics.ts
export function trackEvent(name: string, params?: Record<string, string | number>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", name, params);
  }
}
```

```ts
// components/marketing/contact-form.tsx (usage example, per PLAN.md §21.9's analytics spec)
import { trackEvent } from "@/lib/analytics";

trackEvent("contact_form_submitted", {
  service: values.service,
  budget_range: values.budgetRange,
  // no name/email here — PII never goes into analytics properties (§38.7)
});
```

---

## 5. Phase 1 — Database, Storage, Payments

### 5.1 Database: MySQL

```bash
# .env
DATABASE_URL="mysql://user:password@host:3306/forge_digital"
```

See §2.1 above for the full Prisma schema (Better Auth tables); business-domain tables (`Client`, `Project`, `Milestone`, `Invoice`, etc.) follow the same `datasource` and are added to the same `schema.prisma`.

### 5.2 File storage: local disk (dev) / simple bucket (prod)

```ts
// lib/storage.ts (Phase 1)
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "uploads");

export async function saveFile(buffer: Buffer, key: string) {
  await mkdir(path.dirname(path.join(UPLOAD_DIR, key)), { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, key), buffer);
  return `/uploads/${key}`;
}

export async function getFileUrl(key: string) {
  return `/uploads/${key}`;
}
```

### 5.3 Payments: manual/offline

```ts
// features/invoices/mark-paid.ts (Phase 1)
import { db } from "@/lib/db";

export async function markInvoicePaidManually(invoiceId: string, reference: string) {
  return db.invoice.update({
    where: { id: invoiceId },
    data: { status: "PAID", paidAt: new Date(), paymentReference: reference },
  });
}
```

---

## 6. Phase 2 — Scale-up Infra

### 6.1 File storage: Cloudflare R2

```ts
// lib/storage.ts (Phase 2 — same function signatures as §5.2)
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function saveFile(buffer: Buffer, key: string, contentType: string) {
  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }));
  return key;
}

export async function getFileUrl(key: string) {
  const command = new GetObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key });
  return getSignedUrl(r2, command, { expiresIn: 3600 });
}
```

### 6.2 Payments: Razorpay

```ts
// lib/payments/razorpay.ts
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createOrder(amountInRupees: number, invoiceId: string) {
  return razorpay.orders.create({
    amount: amountInRupees * 100,
    currency: "INR",
    receipt: invoiceId,
  });
}
```

```ts
// app/api/webhooks/razorpay/route.ts
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  if (event.event === "payment.captured") {
    await db.invoice.update({
      where: { razorpayOrderId: event.payload.payment.entity.order_id },
      data: {
        status: "PAID",
        paidAt: new Date(),
        razorpayPaymentId: event.payload.payment.entity.id,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
```

### 6.3 Database: migrate MySQL → PostgreSQL (evaluated, not automatic)

```prisma
// prisma/schema.prisma (Phase 2 — provider swap only, models unchanged)
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

```bash
npx prisma migrate deploy
pgloader mysql://user:pass@host/forge_digital postgresql://user:pass@host/forge_digital
```

---

## 7. Migration Checklist (Phase 1 → Phase 2)

| Item | Change | Data/code impact |
|---|---|---|
| Storage | `lib/storage.ts` local-disk impl → R2 impl | Same function signatures; existing `File.storageKey` rows get a one-time backfill script |
| Payments | Manual marking → Razorpay | `Invoice.status`/`paidAt` already match; add `razorpayOrderId`/`razorpayPaymentId` columns |
| Database | MySQL → PostgreSQL | Full data migration (pgloader) + provider string change in `schema.prisma` |

---

# Design System (extracted from `PLAN.md` §07, §13–17)

## 8. Service Architecture (`PLAN.md` §07)

### 8.1 Launch Services (Day 0)

| # | Service | Maps to Segment Need |
|---|---|---|
| L1 | Website Design & Development | S1, S2, S3, S4 (core need, all segments) |
| L2 | UI/UX Design | S4 (app-adjacent), general |
| L3 | Branding & Visual Identity | S2, S3, S4 |
| L4 | Graphic Design & Marketing Creatives | All segments |
| L5 | Social Media Management & Strategy | S1, S2 (highest recurring value) |
| L6 | Content Creation | S1, S2, S5 |
| L7 | SEO (on-page + local) | S2, S3 |
| L8 | E-commerce Builds (subtype of L1) | S1 |

| Service | Delivery Time | Primary Tools | Recurring Potential | Base Margin Target |
|---|---|---|---|---|
| L1 Website | 2-4 weeks | Next.js/Tailwind, Figma | Medium | 55-65% |
| L2 UI/UX Design | 1-3 weeks | Figma | Low standalone | 60-70% |
| L3 Branding | 2-3 weeks | Figma, Illustrator | Low standalone, high as prerequisite | 60-70% |
| L4 Graphic Design | 2-5 days/batch | Figma, Photoshop/Illustrator | Medium | 65-75% |
| L5 Social Media Mgmt | Ongoing monthly | Canva/Figma, scheduling tool | High — primary MRR driver | 50-60% |
| L6 Content Creation | Ongoing/batch | Docs, Canva, AI-assisted drafting | Medium-High | 55-65% |
| L7 SEO | Ongoing (min. 3mo) | Search Console, Ahrefs/Ubersuggest | High | 50-60% |
| L8 E-commerce | 3-6 weeks | L1 stack + payment gateway | Medium-High | 50-60% |

**L1 — Website Design & Development:** Process: Discovery → sitemap/IA → wireframe → visual design (Figma) → client approval → development → QA → launch. Risks: scope creep (mitigated by explicit page-count limits), client content delays. Must pass the Definition of Done (performance budget, accessibility baseline, cross-device QA) before delivery.

**L5 — Social Media Management:** Process: monthly content calendar → client approval → production → scheduled publishing → monthly report. Dependencies: brand guidelines (L3) and content pillar strategy must exist before month-1 content. Risk: follower/sales-growth guarantees must be explicitly excluded from scope.

**L7 — SEO:** Process: technical audit → keyword/local-pack strategy → on-page implementation → monthly content/link-building → monthly report. Never guarantees specific rankings or timelines.

### 8.2 Phase 2 Services (Month 4-6)

| Service | Why deferred | Trigger |
|---|---|---|
| Web Applications (custom) | Needs deeper backend capacity than launch bandwidth allows | First 2-3 website clients delivered smoothly; qualified lead requests it |
| Video Editing & Motion Graphics | Needs dedicated skill/contractor | Production-ready quality demonstrated, or 3+ leads request it |
| Digital Marketing / Paid Media (managed) | Ad-spend liability requires a real process | SOP exists + platform certification/experience |
| Automation & Light Custom Software | Valuable upsell, too open-ended to sell cold | First inbound requests from existing retainer clients |
| AI-Assisted Service Add-ons | Internal AI workflow must be proven first | Internal AI workflow running reliably 2+ months |

### 8.3 Phase 3 Services (Year 2+)

| Service | Why deferred | Trigger |
|---|---|---|
| Mobile Applications | High build/QA/maintenance cost, needs platform skill | Mobile-capable hire/contractor + genuine native requirement |
| 3D Modeling / Visualization | Specialized tooling/skill, niche demand | Demonstrated recurring demand from D2C/product clients |
| Productized/SaaS layer | Needs a stable, profitable service business first | Service revenue stable/retainer-funded for 2+ consecutive quarters |

### 8.4 Services To Avoid (indefinitely)

- Large-scale enterprise custom software builds
- Guaranteed-ranking SEO or guaranteed-sales marketing
- Print production & physical fulfillment
- Managing client ad spend without a dedicated, qualified process
- Unlimited-revision packages

---

## 9. Color System (`PLAN.md` §13)

Semantic tokens are used everywhere instead of raw hex — enables theming (light/dark), keeps a single source of truth for the brand palette, and documents *intent* (`--color-error`) independent of its current visual value.

### 9.1 Brand Palette

| Token | Hex | RGB | HSL | Role |
|---|---|---|---|---|
| `--color-primary` | `#D9622B` | `217, 98, 43` | `19°, 70%, 51%` | Ember — primary CTAs, links, brand accents |
| `--color-primary-hover` | `#C1531F` | `193, 83, 31` | `19°, 72%, 44%` | Primary hover/active state |
| `--color-secondary` | `#3D4A52` | `61, 74, 82` | `203°, 15%, 28%` | Steel — secondary buttons, headers on dark sections |
| `--color-accent` | `#F2A93B` | `242, 169, 59` | `36°, 88%, 59%` | Spark — highlights, badges, sparingly used |
| `--color-success` | `#2F8F5B` | `47, 143, 91` | `148°, 51%, 37%` | Success states, positive metrics |
| `--color-warning` | `#D98C0F` | `217, 140, 15` | `37°, 87%, 45%` | Warning states |
| `--color-error` | `#C93B3B` | `201, 59, 59` | `0°, 57%, 51%` | Error states, destructive actions |
| `--color-info` | `#2E6FB0` | `46, 111, 176` | `210°, 59%, 44%` | Informational states |

### 9.2 Contrast Findings (WCAG 2.1 AA target)

- `--color-text` (`#1A1815`) on `--color-background` (`#FAFAF8`): **≈16.95:1** (exceeds AAA).
- White text on `--color-primary` (`#D9622B`): **≈3.67:1** — meets AA for large text (≥18px, or ≥14px bold) but **not** small body text. **Rule:** primary-filled buttons must use ≥16px semibold text (never small body-sized text on the primary background).

### 9.3 Light Theme Tokens (default)

| Token | Hex | HSL |
|---|---|---|
| `--color-background` | `#FAFAF8` | `60°, 17%, 98%` |
| `--color-surface` | `#FFFFFF` | `0°, 0%, 100%` |
| `--color-surface-elevated` | `#F4F3EF` | `48°, 19%, 95%` |
| `--color-text` | `#1A1815` | `36°, 11%, 9%` |
| `--color-text-muted` | `#6B655C` | `36°, 8%, 39%` |
| `--color-border` | `#E4E1D9` | `44°, 17%, 87%` |

### 9.4 Dark Theme Tokens

| Token | Hex | HSL |
|---|---|---|
| `--color-background` | `#15130F` | `40°, 17%, 7%` |
| `--color-surface` | `#1C1A16` | `40°, 12%, 10%` |
| `--color-surface-elevated` | `#242019` | `38°, 18%, 12%` |
| `--color-text` | `#F2F0EA` | `45°, 24%, 93%` |
| `--color-text-muted` | `#A8A296` | `40°, 9%, 62%` |
| `--color-border` | `#33302A` | `40°, 10%, 18%` |

Brand colors (`--color-primary`, `--color-secondary`, `--color-accent`, and the 4 status colors) stay the same hex in both themes — only the neutral scale inverts. Dark mode is architected via tokens but **not required for MVP** (light-theme-only ships first).

```css
/* app/globals.css */
:root {
  --color-primary: #D9622B;
  --color-primary-hover: #C1531F;
  --color-secondary: #3D4A52;
  --color-accent: #F2A93B;
  --color-success: #2F8F5B;
  --color-warning: #D98C0F;
  --color-error: #C93B3B;
  --color-info: #2E6FB0;

  --color-background: #FAFAF8;
  --color-surface: #FFFFFF;
  --color-surface-elevated: #F4F3EF;
  --color-text: #1A1815;
  --color-text-muted: #6B655C;
  --color-border: #E4E1D9;
}

[data-theme="dark"] {
  --color-background: #15130F;
  --color-surface: #1C1A16;
  --color-surface-elevated: #242019;
  --color-text: #F2F0EA;
  --color-text-muted: #A8A296;
  --color-border: #33302A;
}
```

---

## 10. Typography System (`PLAN.md` §14)

### 10.1 Typefaces

| Role | Typeface | Why |
|---|---|---|
| Display (headlines, hero) | **Fraunces** (variable serif) | Warmth/craft character matching the "forge" brand metaphor |
| UI & Body | **Inter** (variable sans) | Legible at small sizes, strong tabular figures for pricing/invoices |
| Code (rare) | **IBM Plex Mono** | Distinct from display/UI, pairs cleanly with Inter |

Both Fraunces and Inter are variable fonts — one font file per family instead of per-weight files (performance).

### 10.2 Type Scale

1.25 modular scale, base 16px.

| Token | Size | Line Height | Use |
|---|---|---|---|
| `--font-size-xs` | 0.75rem / 12px | 1.5 | Fine print, timestamps, badges |
| `--font-size-sm` | 0.875rem / 14px | 1.5 | Secondary UI text, form hints |
| `--font-size-base` | 1rem / 16px | 1.6 | Body text, default |
| `--font-size-lg` | 1.25rem / 20px | 1.5 | Lead paragraphs, card titles |
| `--font-size-xl` | 1.5625rem / 25px | 1.4 | h4 |
| `--font-size-2xl` | 1.953rem / 31px | 1.3 | h3 |
| `--font-size-3xl` | 2.441rem / 39px | 1.2 | h2 |
| `--font-size-4xl` | 3.052rem / 49px | 1.1 | h1 / hero |
| `--font-size-5xl` | 3.815rem / 61px | 1.05 | Homepage hero, desktop only |

### 10.3 Weights

| Token | Weight | Use |
|---|---|---|
| `--font-weight-regular` | 400 | Body text |
| `--font-weight-medium` | 500 | UI labels, emphasized body text |
| `--font-weight-semibold` | 600 | Buttons, card titles, nav items |
| `--font-weight-bold` | 700 | Headings |

### 10.4 Rules

- Minimum readable UI text: 14px anywhere; body copy defaults to 16px.
- Buttons: `--font-weight-semibold`, minimum 14px; primary-filled buttons specifically use 16px+ (contrast rule, §9.2).
- Display headings (`--font-size-3xl`+) use `--tracking-tight: -0.02em`.
- `--font-size-4xl`/`--font-size-5xl` scale down via `clamp()` at the `sm` breakpoint, not fixed overrides.

```ts
// app/layout.tsx (Next.js font loading)
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: "400", variable: "--font-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

---

## 11. Design Tokens (`PLAN.md` §15)

Three layers: **primitive** (raw values, rarely referenced directly) → **semantic** (named by role, e.g. `--color-text`, what components use) → **component** (narrow overrides for a single component with a stated reason).

### 11.1 Spacing (base unit 4px)

| Token | Value | Use |
|---|---|---|
| `--space-1` | 4px | Icon-to-label gap |
| `--space-2` | 8px | Tight internal padding |
| `--space-3` | 12px | Form field internal padding |
| `--space-4` | 16px | Default card/section padding |
| `--space-6` | 24px | Gap between related components |
| `--space-8` | 32px | Gap between distinct sections |
| `--space-12` | 48px | Section vertical padding (mobile) |
| `--space-16` | 64px | Section vertical padding (desktop) |
| `--space-24` | 96px | Major page-section separation (desktop) |

### 11.2 Radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 4px | Badges, small chips |
| `--radius-md` | 8px | Buttons, inputs, cards (default) |
| `--radius-lg` | 16px | Modals, large panels |
| `--radius-full` | 9999px | Avatars, pill badges |

### 11.3 Shadows

| Token | Value | Use |
|---|---|---|
| `--shadow-sm` | `0 1px 2px rgba(26,24,21,0.06)` | Cards at rest |
| `--shadow-md` | `0 4px 12px rgba(26,24,21,0.10)` | Dropdowns, popovers |
| `--shadow-lg` | `0 12px 32px rgba(26,24,21,0.16)` | Modals |

### 11.4 Borders

| Token | Value |
|---|---|
| `--border-width-default` | 1px |
| `--border-width-focus` | 2px |
| `--border-color-default` | `var(--color-border)` |
| `--border-color-focus` | `var(--color-primary)` |

### 11.5 Z-Index Scale

| Token | Value | Use |
|---|---|---|
| `--z-base` | 0 | Default document flow |
| `--z-dropdown` | 100 | Dropdowns, select menus |
| `--z-sticky` | 200 | Sticky headers |
| `--z-overlay` | 300 | Modal/drawer backdrop |
| `--z-modal` | 400 | Modal/drawer content |
| `--z-toast` | 500 | Toast notifications |

### 11.6 Motion Tokens

| Token | Value | Use |
|---|---|---|
| `--duration-fast` | 120ms | Micro-interactions (hover, focus) |
| `--duration-base` | 200ms | Standard transitions |
| `--duration-slow` | 320ms | Modal/drawer enter-exit |
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default easing |
| `--ease-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Entrances |
| `--ease-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | Exits |

### 11.7 Breakpoints & Container Widths

| Token | Value | Notes |
|---|---|---|
| `--bp-xs` | 375px | Small phones |
| `--bp-sm` | 640px | Large phones |
| `--bp-md` | 768px | Tablets |
| `--bp-lg` | 1024px | Small laptops |
| `--bp-xl` | 1280px | Desktops |
| `--bp-2xl` | 1440px | Large desktops |
| `--container-max` | 1200px | Max content width at `xl`+ |

### 11.8 Tailwind mapping

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-elevated": "var(--color-surface-elevated)",
        text: "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
        border: "var(--color-border)",
      },
      spacing: {
        1: "4px", 2: "8px", 3: "12px", 4: "16px",
        6: "24px", 8: "32px", 12: "48px", 16: "64px", 24: "96px",
      },
      borderRadius: {
        sm: "4px", md: "8px", lg: "16px", full: "9999px",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
} satisfies Config;
```

---

## 12. Design System — Components (`PLAN.md` §16)

**Conventions applied to every component:** primitives at `components/ui/<name>.tsx`, composites at `components/marketing|portal|admin/<name>.tsx`; semantic tokens only (no raw hex/px, enforced via ESLint); visible focus ring, full keyboard operability, correct ARIA, 44×44px min touch target; render + interaction tests; built on Radix UI primitives where non-trivial accessible behavior (focus trap, portal rendering) is needed.

### 12.1 Form Controls

| Component | Variants | Notes |
|---|---|---|
| Button | primary, secondary, outline, ghost, destructive | Primary variant enforces min. 16px/semibold text (contrast rule, §9.2) |
| Input | text, email, password (toggle), search (clear icon) | Error state always pairs with `aria-describedby` text — never color alone |
| Textarea | fixed-height, auto-grow | Auto-grow caps at 8 lines then scrolls |
| Select | native-backed (mobile) / Radix searchable (desktop, >8 options) | Search only activates above 8 options |
| Checkbox | single, group w/ indeterminate | Indeterminate used for admin table bulk-select |
| Radio | standard, card-style | Card-style used for package-tier selection |
| Switch | default | Instant-effect only — distinct from Checkbox (staged until submit) |
| Form | — | React Hook Form + Zod, schema shared client/server |
| File Uploader | drag-and-drop, click-to-browse | Per-file progress, retry on error |

### 12.2 Overlays

| Component | Purpose | Note |
|---|---|---|
| Modal | Blocking task | Focus-trapped, closes on Escape/backdrop unless unsaved state exists |
| Drawer | Non-blocking side panel | Used when underlying page context still matters |
| Dropdown | Contextual action menu | Auto-flips placement to stay in viewport |
| Tooltip | Supplementary hint | Never the *only* copy of essential info |

### 12.3 Feedback

| Component | Purpose | Note |
|---|---|---|
| Toast | Transient system feedback | Highest z-index (`--z-toast`), 4s auto-dismiss |
| Alert | Persistent inline message | Distinguished from Toast by persistence |
| Empty State | "No data yet" | Every list/table defines its own copy |
| Loading State | Skeleton / spinner | Skeleton preferred for >300ms predictable-layout loads |
| Error State | Failed fetch/action | Must always offer a recovery action |
| Success State | Confirms completion | Restates what happens next |

### 12.4 Content Display

| Component | Purpose | Note |
|---|---|---|
| Card | Generic container | Never nests a Card inside a Card |
| Badge | Status/category label | Max 2 words |
| Avatar | Person representation | Deterministic initials-fallback tint |
| Table | Structured data (admin) | Horizontal scroll inside its own container |
| Pagination | numbered / load-more | Numbered for admin tables, load-more for content browsing |
| Breadcrumb | Hierarchical location | Only shown 2+ levels deep |
| Tabs | Switch related views | Inactive tab content unmounted, not just hidden |
| Accordion | Progressive disclosure (FAQ) | Single-open for FAQ, multi-open for filterable specs |
| Timeline | Sequence of dated events | Directly renders the project state machine |

### 12.5 Marketing & Composite Components

| Component | Key fields | Notes |
|---|---|---|
| Hero | Headline, subhead, primary/secondary CTA, visual | Layout component, not a copy template |
| Section | Eyebrow, heading, body | Owns consistent section rhythm (`--space-16`/`--space-24`) |
| Service Card | Icon, name, description, "starting at" price, link | Price always shown (transparent pricing) |
| Pricing Card | Tier, price, cadence, inclusions, exclusions, CTA | Exclusions always present, even if collapsed |
| Project Card | Cover image, name, service tags, link | Tags link back to the relevant service page |
| Testimonial | Quote, name, role/company, photo | Never fabricated/paraphrased beyond light edits |
| CTA block | Heading, support text, primary button | Exactly one per page |

### 12.6 Navigation

| Component | Behavior |
|---|---|
| Navigation (header) | Marketing: sticky, hamburger+Drawer below `md`. Portal: sidebar desktop, bottom-tabs mobile |
| Footer | Marketing site only |

```tsx
// components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary-hover text-base",
        secondary: "bg-secondary text-white hover:opacity-90",
        outline: "border border-border bg-transparent hover:bg-surface-elevated",
        ghost: "bg-transparent hover:bg-surface-elevated",
        destructive: "bg-error text-white hover:opacity-90",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4",
        lg: "h-12 px-6 text-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? "…" : children}
    </button>
  )
);
Button.displayName = "Button";
```

---

## 13. Responsive Design (`PLAN.md` §17)

Defined by **behavior change**, not just resizing.

### 13.1 Breakpoint Behavior

| Breakpoint | Width | Navigation | Grid | Cards |
|---|---|---|---|---|
| Base/`xs` | 320-639px | Hamburger + full-screen Drawer | Single column | Full-width, stacked |
| `sm` | 640-767px | Hamburger, Drawer narrows to 320px | 2-column | 2-up grid |
| `md` | 768-1023px | Hamburger persists; portal sidebar → icon-rail | 2-3 column | 2-3 up grid |
| `lg` | 1024-1279px | Full horizontal nav; portal sidebar expanded | 3-column | 3-up grid |
| `xl` | 1280-1439px | Same as `lg`, content capped at `--container-max` | 3-4 column | 3-4 up grid |
| `2xl`+ | 1440px+ | Same — no further nav change | Same columns, more whitespace | Same count, more whitespace |

### 13.2 Navigation Detail

- **< `md`:** hamburger → full-screen Drawer, ≥44px tap targets.
- **`md`:** marketing site still uses hamburger (touch remains primary input at tablet width).
- **≥ `lg`:** full horizontal nav with dropdown for secondary items.
- **Portal sidebar:** below `md`, collapses to a 5-item max bottom tab bar (Dashboard, Projects, Files, Messages, Account), not a hamburger.

### 13.3 Grid & Content Rules

- Card grids use CSS Grid `auto-fit`/`minmax(280px, 1fr)` rather than fixed breakpoint column counts.
- Content reordering happens in exactly two documented cases: homepage hero visual moves below the CTA on mobile; the Pricing page's "Growth" tier reorders to first position on mobile single-column layout.
- Images use responsive `srcset`/Next.js `<Image>`, with art-directed crops for the hero (portrait below `sm`, landscape above).
- Video uses a static poster-frame + tap-to-play on mobile (no autoplay).
- Below `md`, all interactive elements meet the 44×44px minimum touch target via invisible padding, not inflated visuals.

```css
/* Example: auto-fit card grid per §13.3 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-6);
}
```

```ts
// tailwind.config.ts — screens matching §11.7 breakpoints
export default {
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
    },
  },
};
```

---

## 14. Database Schema Design (`PLAN.md` §29)

Design principles carried over from `PLAN.md` §29.1: every table exists because a named page/feature needs it (no speculative tables); normalized to 3NF; soft-delete (`deletedAt`) for business/audit-relevant records (Lead, Client, Project, File, Invoice), hard-delete only where retention has no value (expired sessions — see §2.1's `Session` model).

### 14.1 Entity Relationship Overview

```text
User ──< belongs to (nullable) >── Client ──< has many >── Project ──< has many >── Milestone
  │                                    │                        │                       │
  │                                    │                        ├─< has many >── File    │
  │                                    │                        ├─< has many >── Comment  │
  │                                    ├─< has many >── Invoice ─┘ (Invoice can link to    │
  │                                    │        └─< has many >── InvoiceLineItem  Project) │
  │                                    ├─< has many >── Retainer                            │
  │                                    └─< has many >── Testimonial                          │
  ├─< has many >── Notification
  ├─< has many >── Session, Account (Better Auth, §2.1)
  └─< creates >── ContentPost, CaseStudy (as author, TEAM role only)

Lead ──(on conversion)──> Client
Proposal ──belongs to── Lead or Client
CaseStudy ──optionally links── Testimonial, Client
AuditLog ──references── any entity (polymorphic, append-only)
```

### 14.2 Enums

```prisma
// prisma/schema.prisma

enum UserRole {
  CLIENT
  TEAM
}

enum ServiceType {
  WEBSITE
  UI_UX_DESIGN
  BRANDING
  GRAPHIC_DESIGN
  SOCIAL_MEDIA
  CONTENT_CREATION
  SEO
  ECOMMERCE
}

enum BudgetRange {
  UNDER_25K
  RANGE_25K_75K
  RANGE_75K_2L
  OVER_2L
  NOT_SURE
}

enum TimelineUrgency {
  ASAP
  ONE_MONTH
  ONE_TO_THREE_MONTHS
  FLEXIBLE
}

enum LeadStatus {
  NEW
  CONTACTED
  QUALIFIED
  DISQUALIFIED
  CONVERTED
}

enum AcquisitionSource {
  REFERRAL
  OUTREACH
  INBOUND
  PARTNER
}

enum PackageTier {
  STARTER
  GROWTH
  PREMIUM
  CUSTOM
}

// Project entity tracks ONBOARDING through CLOSED; LEAD through WON are
// tracked on the Lead entity via LeadStatus above (PLAN.md §34.1 note).
enum ProjectState {
  ONBOARDING
  ACTIVE
  REVIEW
  APPROVED
  DELIVERED
  CLOSED
}

enum MilestoneStatus {
  UPCOMING
  IN_PROGRESS
  AWAITING_APPROVAL
  APPROVED
  DELIVERED
}

enum InvoiceStatus {
  DRAFT
  SENT
  PAID
  OVERDUE
  CANCELLED
}

enum ProposalStatus {
  DRAFT
  SENT
  ACCEPTED
  DECLINED
  EXPIRED
}
```

### 14.3 `Lead`

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| name | text | not null |
| email | text | not null |
| company | text | nullable |
| service | enum(ServiceType) | not null |
| budgetRange | enum(BudgetRange) | not null |
| timeline | enum(TimelineUrgency) | not null |
| message | text | nullable |
| internalNotes | text | nullable |
| status | enum(LeadStatus) | not null, default NEW |
| convertedClientId | uuid | FK → Client.id, nullable |
| createdAt | timestamptz | not null, default now() |
| deletedAt | timestamptz | nullable (soft-delete on explicit request only) |

```prisma
model Lead {
  id                 String      @id @default(uuid())
  name               String
  email              String
  company            String?
  service            ServiceType
  budgetRange        BudgetRange
  timeline           TimelineUrgency
  message            String?     @db.Text
  internalNotes      String?     @db.Text
  status             LeadStatus  @default(NEW)
  convertedClientId  String?
  convertedClient    Client?     @relation(fields: [convertedClientId], references: [id])
  createdAt          DateTime    @default(now())
  deletedAt          DateTime?

  @@index([status])
  @@index([createdAt])
  @@map("lead")
}
```

### 14.4 `Client`

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| companyName | text | not null |
| industry | text | nullable |
| source | enum(AcquisitionSource) | not null |
| notes | text | nullable (internal-only, never exposed to CLIENT-role sessions) |
| createdAt | timestamptz | not null |
| deletedAt | timestamptz | nullable (soft-delete only) |

```prisma
model Client {
  id          String            @id @default(uuid())
  companyName String
  industry    String?
  source      AcquisitionSource
  notes       String?           @db.Text
  createdAt   DateTime          @default(now())
  deletedAt   DateTime?

  users        User[]
  leads        Lead[]
  projects     Project[]
  invoices     Invoice[]
  retainers    Retainer[]
  testimonials Testimonial[]
  proposals    Proposal[]
  caseStudies  CaseStudy[]

  @@map("client")
}
```

### 14.5 `User` (extends the Better Auth `User` model, §2.1)

The `role` and `clientId` columns shown in §2.1 already carry the constraints below — restated here with the relation wiring to the business-domain tables.

```prisma
model User {
  id            String   @id @default(uuid())
  name          String
  email         String   @unique
  emailVerified Boolean  @default(false)
  image         String?
  role          UserRole @default(CLIENT) // must be non-null clientId when CLIENT, null when TEAM — app-level constraint (features/auth/)
  clientId      String?
  client        Client?  @relation(fields: [clientId], references: [id])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime?

  sessions      Session[]
  accounts      Account[]
  projectsOwned Project[]      @relation("ProjectOwner")
  files         File[]
  comments      Comment[]
  notifications Notification[]
  contentPosts  ContentPost[]

  @@index([clientId])
  @@map("user")
}
```

### 14.6 `Project`

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| clientId | uuid | FK → Client.id, not null |
| name | text | not null |
| serviceType | enum(ServiceType) | not null |
| packageTier | enum(PackageTier) | not null |
| state | enum(ProjectState) | not null, default ONBOARDING |
| founderOwnerId | uuid | FK → User.id (role=TEAM), not null |
| startDate | date | nullable |
| targetDeliveryDate | date | nullable |
| createdAt / updatedAt | timestamptz | not null |
| deletedAt | timestamptz | nullable (soft-delete) |

```prisma
model Project {
  id                 String       @id @default(uuid())
  clientId           String
  client             Client       @relation(fields: [clientId], references: [id])
  name               String
  serviceType        ServiceType
  packageTier        PackageTier
  state              ProjectState @default(ONBOARDING)
  founderOwnerId     String
  founderOwner       User         @relation("ProjectOwner", fields: [founderOwnerId], references: [id])
  startDate          DateTime?    @db.Date
  targetDeliveryDate DateTime?    @db.Date
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt
  deletedAt          DateTime?

  milestones Milestone[]
  files      File[]
  comments   Comment[]
  invoices   Invoice[]

  @@index([clientId])
  @@index([state])
  @@index([founderOwnerId])
  @@map("project")
}
```

### 14.7 `Milestone`

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| projectId | uuid | FK → Project.id, not null |
| name | text | not null |
| description | text | nullable |
| order | integer | not null |
| status | enum(MilestoneStatus) | not null, default UPCOMING |
| dueDate | date | nullable |
| completedAt | timestamptz | nullable |

```prisma
model Milestone {
  id          String          @id @default(uuid())
  projectId   String
  project     Project         @relation(fields: [projectId], references: [id])
  name        String
  description String?         @db.Text
  order       Int
  status      MilestoneStatus @default(UPCOMING)
  dueDate     DateTime?       @db.Date
  completedAt DateTime?

  files    File[]
  comments Comment[]

  @@index([projectId, order])
  @@map("milestone")
}
```

### 14.8 `File`

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| projectId | uuid | FK → Project.id, not null |
| milestoneId | uuid | FK → Milestone.id, nullable |
| uploadedByUserId | uuid | FK → User.id, not null |
| name | text | not null |
| storageKey | text | not null (R2/local object key, §5.2/§6.1) |
| size | integer | not null (bytes) |
| mimeType | text | not null |
| version | integer | not null, default 1 |
| supersedesFileId | uuid | FK → File.id (self-relation), nullable |
| createdAt | timestamptz | not null |
| deletedAt | timestamptz | nullable (row soft-deleted; underlying object retained 30 days) |

```prisma
model File {
  id                String    @id @default(uuid())
  projectId         String
  project           Project   @relation(fields: [projectId], references: [id])
  milestoneId       String?
  milestone         Milestone? @relation(fields: [milestoneId], references: [id])
  uploadedByUserId  String
  uploadedBy        User      @relation(fields: [uploadedByUserId], references: [id])
  name              String
  storageKey        String
  size              Int
  mimeType          String
  version           Int       @default(1)
  supersedesFileId  String?
  supersedes        File?     @relation("FileVersion", fields: [supersedesFileId], references: [id])
  supersededBy      File[]    @relation("FileVersion")
  createdAt         DateTime  @default(now())
  deletedAt         DateTime?

  @@index([projectId])
  @@index([milestoneId])
  @@map("file")
}
```

### 14.9 `Comment`

| Column | Type | Constraints |
|---|---|---|
| id | uuid | PK |
| projectId | uuid | FK → Project.id, not null |
| milestoneId | uuid | FK → Milestone.id, nullable |
| authorUserId | uuid | FK → User.id, not null |
| body | text | not null |
| createdAt | timestamptz | not null |

```prisma
model Comment {
  id            String     @id @default(uuid())
  projectId     String
  project       Project    @relation(fields: [projectId], references: [id])
  milestoneId   String?
  milestone     Milestone? @relation(fields: [milestoneId], references: [id])
  authorUserId  String
  author        User       @relation(fields: [authorUserId], references: [id])
  body          String     @db.Text
  createdAt     DateTime   @default(now())

  @@index([projectId, createdAt])
  @@map("comment")
}
```

### 14.10 `Invoice` & `InvoiceLineItem`

| Table | Key columns | Notes |
|---|---|---|
| `Invoice` | id, clientId (FK), projectId (FK, nullable — retainer invoices), number, amountTotal, currency, status, dueDate, paidAt, paymentReference (Phase 1 manual, §5.3), razorpayOrderId/razorpayPaymentId (Phase 2, §6.2) | Card/bank details are never stored — Razorpay references only |
| `InvoiceLineItem` | id, invoiceId (FK), description, quantity, unitAmount | Structured line items render both the PDF and the portal detail view |

```prisma
model Invoice {
  id                 String        @id @default(uuid())
  clientId           String
  client             Client        @relation(fields: [clientId], references: [id])
  projectId          String?
  project            Project?      @relation(fields: [projectId], references: [id])
  number             String        @unique
  amountTotal        Decimal       @db.Decimal(10, 2)
  currency           String        @default("INR")
  status             InvoiceStatus @default(DRAFT)
  dueDate            DateTime      @db.Date
  paidAt             DateTime?
  paymentReference   String?       // Phase 1 — manual payment (UTR/UPI ref, §5.3)
  razorpayOrderId    String?       @unique // Phase 2, §6.2
  razorpayPaymentId  String?                // Phase 2, §6.2
  createdAt          DateTime      @default(now())

  lineItems InvoiceLineItem[]

  @@index([clientId])
  @@index([status])
  @@map("invoice")
}

model InvoiceLineItem {
  id          String  @id @default(uuid())
  invoiceId   String
  invoice     Invoice @relation(fields: [invoiceId], references: [id])
  description String
  quantity    Int     @default(1)
  unitAmount  Decimal @db.Decimal(10, 2)

  @@map("invoice_line_item")
}
```

### 14.11 Remaining Tables

| Table | Purpose | Key relationships |
|---|---|---|
| `Retainer` | Active recurring engagement (social/SEO/maintenance) | belongs to Client; generates monthly `Invoice` rows via a scheduled job |
| `Proposal` | Sent proposal pre-conversion | belongs to Lead or Client; on acceptance creates/links a Project |
| `Notification` | In-app notification record | belongs to User; `type` + `payload` (JSON) drive rendering |
| `ContentPost` | Blog posts | authored by a TEAM User; SEO fields as first-class columns |
| `CaseStudy` | Portfolio case studies | optionally linked to Client and Testimonial |
| `Testimonial` | Client quotes | belongs to Client; `approvedAt` records explicit consent |
| `AuditLog` | Append-only sensitive-action log | polymorphic `entityType` + `entityId`, never updated/deleted |

```prisma
model Retainer {
  id              String   @id @default(uuid())
  clientId        String
  client          Client   @relation(fields: [clientId], references: [id])
  serviceType     ServiceType
  monthlyAmount   Decimal  @db.Decimal(10, 2)
  status          String   @default("ACTIVE") // ACTIVE | PAUSED | CANCELLED
  startDate       DateTime @db.Date
  billingDay      Int      @default(1) // day of month the scheduled job generates an Invoice
  createdAt       DateTime @default(now())

  @@index([clientId])
  @@map("retainer")
}

model Proposal {
  id          String         @id @default(uuid())
  leadId      String?
  lead        Lead?          @relation(fields: [leadId], references: [id])
  clientId    String?
  client      Client?        @relation(fields: [clientId], references: [id])
  status      ProposalStatus @default(DRAFT)
  documentUrl String?
  sentAt      DateTime?
  acceptedAt  DateTime?
  createdAt   DateTime       @default(now())

  @@index([leadId])
  @@index([clientId])
  @@map("proposal")
}

model Notification {
  id        String    @id @default(uuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  type      String    // e.g. "MILESTONE_AWAITING_APPROVAL", "INVOICE_DUE"
  payload   Json
  readAt    DateTime?
  createdAt DateTime  @default(now())

  @@index([userId, readAt])
  @@map("notification")
}

model ContentPost {
  id              String    @id @default(uuid())
  authorId        String
  author          User      @relation(fields: [authorId], references: [id])
  title           String
  slug            String    @unique
  body            String    @db.Text
  metaDescription String
  publishedAt     DateTime?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@map("content_post")
}

model CaseStudy {
  id            String       @id @default(uuid())
  clientId      String?
  client        Client?      @relation(fields: [clientId], references: [id])
  testimonialId String?
  testimonial   Testimonial? @relation(fields: [testimonialId], references: [id])
  title         String
  slug          String       @unique
  challenge     String       @db.Text
  approach      String       @db.Text
  outcome       String       @db.Text
  publishedAt   DateTime?
  createdAt     DateTime     @default(now())

  @@map("case_study")
}

model Testimonial {
  id          String      @id @default(uuid())
  clientId    String
  client      Client      @relation(fields: [clientId], references: [id])
  quote       String      @db.Text
  authorName  String
  authorRole  String?
  approvedAt  DateTime?
  createdAt   DateTime    @default(now())

  caseStudies CaseStudy[]

  @@map("testimonial")
}

model AuditLog {
  id           String   @id @default(uuid())
  actorUserId  String?
  entityType   String   // e.g. "Invoice", "Project", "User"
  entityId     String
  action       String   // e.g. "STATE_CHANGED", "ROLE_CHANGED", "INVOICE_EDITED"
  metadata     Json?
  createdAt    DateTime @default(now())

  @@index([entityType, entityId])
  @@map("audit_log")
}
```

### 14.12 Data Lifecycle & Retention

| Data category | Retention approach | Reasoning |
|---|---|---|
| Business/financial records (Invoice, Project, Client) | Soft-delete, retained indefinitely by default | Legal/audit value — PROFESSIONAL REVIEW REQUIRED for an exact retention period |
| Communication (Comment) | Retained with the Project (soft-deleted together) | Project history integrity |
| Disqualified/stale Leads | Retained, soft-deletable on request | Pipeline-conversion-rate reporting value |
| Sessions/Verification | Hard-deleted on expiry (scheduled cleanup) | No retention value once expired |
| Files (object storage) | Soft-deleted row, object retained 30 days then purged | Balances accidental-deletion recovery against storage cost |

```ts
// scripts/cleanup-expired-sessions.ts — scheduled job (Phase 1: manual cron / Phase 2: Vercel Cron)
import { db } from "@/lib/db";

export async function cleanupExpiredSessions() {
  await db.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
}
```
