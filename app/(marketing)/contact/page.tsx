// Contact — PLAN.md §20.9. The form itself is the page's single CTA — no
// additional CTA block here (§16.5's "exactly one CTA per page" rule).
import { Section } from "@/components/ui/section";
import { ContactForm } from "@/components/marketing/contact-form";

export default function ContactPage() {
  return (
    <Section heading="Tell us about your project" body="We'll respond within one business day.">
      <div className="grid gap-12 md:grid-cols-2">
        <ContactForm />
        <div className="rounded-lg border border-border p-6">
          <p className="font-medium">Prefer not to use a form?</p>
          <p className="mt-2 text-sm text-text-muted">
            Email us directly at{" "}
            <a href="mailto:hello@forgedigital.in" className="underline">
              hello@forgedigital.in
            </a>{" "}
            or reach us on WhatsApp Business.
          </p>
        </div>
      </div>
    </Section>
  );
}
