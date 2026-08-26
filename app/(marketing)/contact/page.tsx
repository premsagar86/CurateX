// Contact — PLAN.md §20.9. Full field spec §21.9.
import { ContactForm } from "@/components/marketing/contact-form";

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <h1 className="font-display text-3xl">Tell us about your project</h1>
      <div className="mt-8">
        <ContactForm />
      </div>
    </section>
  );
}
