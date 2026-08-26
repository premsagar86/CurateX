"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function CreateProposalForm({ leads }: { leads: { id: string; name: string }[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const res = await fetch("/api/admin/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId: String(formData.get("leadId")) }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Could not create the proposal.");
      return;
    }
    router.refresh();
  }

  if (leads.length === 0) return <p className="text-sm text-text-muted">No eligible leads to draft a proposal for.</p>;

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <select name="leadId" required className="rounded-md border border-border px-2 py-2 text-sm">
        {leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.name}</option>)}
      </select>
      <Button type="submit" loading={loading} size="sm">Draft proposal</Button>
      {error && <p className="text-sm text-error">{error}</p>}
    </form>
  );
}

export function SendProposalButton({ proposalId }: { proposalId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    setLoading(true);
    await fetch(`/api/admin/proposals/${proposalId}/send`, { method: "POST" });
    setLoading(false);
    router.refresh();
  }

  return (
    <Button size="sm" variant="outline" onClick={handleSend} loading={loading}>
      Send
    </Button>
  );
}
