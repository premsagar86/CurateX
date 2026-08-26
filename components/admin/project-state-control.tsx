"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const NEXT_STATES: Record<string, string[]> = {
  ONBOARDING: ["ACTIVE"],
  ACTIVE: ["REVIEW"],
  REVIEW: ["APPROVED", "ACTIVE"],
  APPROVED: ["DELIVERED"],
  DELIVERED: ["CLOSED"],
  CLOSED: [],
};

export function ProjectStateControl({ projectId, state }: { projectId: string; state: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const options = NEXT_STATES[state] ?? [];

  if (options.length === 0) return null;

  async function handleTransition(nextState: string) {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/projects/${projectId}/state`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: nextState }),
    });
    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setError(body?.error?.message ?? "Could not change state.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {options.map((next) => (
        <button
          key={next}
          disabled={loading}
          onClick={() => handleTransition(next)}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-surface-elevated disabled:opacity-50"
        >
          Move to {next}
        </button>
      ))}
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
