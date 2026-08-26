// Contact form — full field spec PLAN.md §21.9. Client validation mirrors
// lib/validation/lead.ts; server re-validates the same shape (§30.2).
"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

const SERVICES = [
  ["WEBSITE", "Website"],
  ["UI_UX_DESIGN", "UI/UX Design"],
  ["BRANDING", "Branding"],
  ["GRAPHIC_DESIGN", "Graphic Design"],
  ["SOCIAL_MEDIA", "Social Media"],
  ["CONTENT_CREATION", "Content Creation"],
  ["SEO", "SEO"],
  ["ECOMMERCE", "E-commerce"],
] as const;

const BUDGETS = [
  ["UNDER_25K", "Under ₹25,000"],
  ["RANGE_25K_75K", "₹25,000 – ₹75,000"],
  ["RANGE_75K_2L", "₹75,000 – ₹2,00,000"],
  ["OVER_2L", "Over ₹2,00,000"],
  ["NOT_SURE", "Not sure yet"],
] as const;

const TIMELINES = [
  ["ASAP", "ASAP"],
  ["ONE_MONTH", "Within 1 month"],
  ["ONE_TO_THREE_MONTHS", "1–3 months"],
  ["FLEXIBLE", "Flexible"],
] as const;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrors({});

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setStatus("success");
      trackEvent("contact_form_submitted", {
        service: String(payload.service),
        budget_range: String(payload.budgetRange),
      });
      return;
    }

    const body = await res.json().catch(() => null);
    setErrors(body?.error?.fields ?? {});
    setStatus("error");
  }

  if (status === "success") {
    return <p className="text-lg">Thanks — we&apos;ll respond within one business day.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Honeypot — invisible to real users, PLAN.md §21.9 spam prevention */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />

      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input id="name" name="name" required maxLength={100} className="mt-1 w-full rounded-md border border-border px-3 py-2" />
        {errors.name && <p className="mt-1 text-sm text-error">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input id="email" name="email" type="email" required className="mt-1 w-full rounded-md border border-border px-3 py-2" />
        {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium">
          Company <span className="text-text-muted">(optional)</span>
        </label>
        <input id="company" name="company" className="mt-1 w-full rounded-md border border-border px-3 py-2" />
      </div>

      <div>
        <label htmlFor="service" className="block text-sm font-medium">
          Service interested in
        </label>
        <select id="service" name="service" required className="mt-1 w-full rounded-md border border-border px-3 py-2">
          {SERVICES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="budgetRange" className="block text-sm font-medium">
          Budget range
        </label>
        <select id="budgetRange" name="budgetRange" required className="mt-1 w-full rounded-md border border-border px-3 py-2">
          {BUDGETS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="timeline" className="block text-sm font-medium">
          Timeline
        </label>
        <select id="timeline" name="timeline" required className="mt-1 w-full rounded-md border border-border px-3 py-2">
          {TIMELINES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Message <span className="text-text-muted">(optional)</span>
        </label>
        <textarea id="message" name="message" rows={4} className="mt-1 w-full rounded-md border border-border px-3 py-2" />
      </div>

      <Button type="submit" loading={status === "loading"}>
        Send inquiry
      </Button>
    </form>
  );
}
