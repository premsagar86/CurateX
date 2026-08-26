"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { createProposalSchema, type CreateProposalInput } from "@/lib/validation/proposal";

export function CreateProposalForm({ leads }: { leads: { id: string; name: string }[] }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateProposalInput>({ resolver: zodResolver(createProposalSchema) });

  async function onSubmit(payload: CreateProposalInput) {
    const res = await fetch("/api/admin/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setError("root", { message: "Could not create the proposal." });
      return;
    }
    router.refresh();
  }

  if (leads.length === 0) return <p className="text-sm text-text-muted">No eligible leads to draft a proposal for.</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <select className="rounded-md border border-border px-2 py-2 text-sm" {...register("leadId")}>
        {leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.name}</option>)}
      </select>
      <Button type="submit" loading={isSubmitting} size="sm">Draft proposal</Button>
      {errors.root && <p className="text-sm text-error">{errors.root.message}</p>}
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
