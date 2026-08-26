"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STATUSES = ["UPCOMING", "IN_PROGRESS", "AWAITING_APPROVAL", "APPROVED", "DELIVERED"] as const;

export function MilestoneStatusSelect({ projectId, milestoneId, status }: { projectId: string; milestoneId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: string) {
    setValue(next);
    setSaving(true);
    await fetch(`/api/projects/${projectId}/milestones/${milestoneId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <select value={value} disabled={saving} onChange={(e) => handleChange(e.target.value)} className="rounded-md border border-border px-2 py-1 text-xs">
      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
