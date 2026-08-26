"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { services } from "@/config/services";

const TIERS = ["STARTER", "GROWTH", "PREMIUM", "CUSTOM"] as const;

export function CreateProjectForm({ clientId, founders }: { clientId: string; founders: { id: string; name: string }[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const res = await fetch(`/api/admin/clients/${clientId}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(formData.get("name")),
        serviceType: String(formData.get("serviceType")),
        packageTier: String(formData.get("packageTier")),
        founderOwnerId: String(formData.get("founderOwnerId")),
      }),
    });

    setLoading(false);
    if (!res.ok) {
      setError("Could not create the project.");
      return;
    }
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2">
      <input name="name" required placeholder="Project name" className="rounded-md border border-border px-3 py-2 text-sm" />
      <select name="serviceType" required className="rounded-md border border-border px-2 py-2 text-sm">
        {services.map((s) => <option key={s.type} value={s.type}>{s.name}</option>)}
      </select>
      <select name="packageTier" required className="rounded-md border border-border px-2 py-2 text-sm">
        {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <select name="founderOwnerId" required className="rounded-md border border-border px-2 py-2 text-sm">
        {founders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
      </select>
      <Button type="submit" loading={loading} size="sm">Create project</Button>
      {error && <p className="w-full text-sm text-error">{error}</p>}
    </form>
  );
}
