"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function ApproveMilestoneButton({ projectId, milestoneId }: { projectId: string; milestoneId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/projects/${projectId}/milestones/${milestoneId}/approve`, { method: "POST" });
    setLoading(false);
    if (!res.ok) {
      setError("Could not approve this milestone. Try again.");
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <Button onClick={handleApprove} loading={loading}>
        Approve
      </Button>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </div>
  );
}
