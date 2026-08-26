"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function MilestoneCreateForm({ projectId, nextOrder }: { projectId: string; nextOrder: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const res = await fetch(`/api/projects/${projectId}/milestones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: String(formData.get("name")), order: nextOrder }),
    });

    setLoading(false);
    if (!res.ok) {
      setError("Could not create the milestone.");
      return;
    }
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input name="name" required placeholder="Milestone name" className="flex-1 rounded-md border border-border px-3 py-2 text-sm" />
      <Button type="submit" loading={loading} size="sm">Add milestone</Button>
      {error && <p className="text-sm text-error">{error}</p>}
    </form>
  );
}
