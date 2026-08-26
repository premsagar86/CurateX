"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export function InviteUserForm({ clientId }: { clientId: string }) {
  const [loading, setLoading] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setInviteUrl(null);

    const formData = new FormData(event.currentTarget);
    const res = await fetch(`/api/admin/clients/${clientId}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: String(formData.get("email")) }),
    });

    setLoading(false);
    if (!res.ok) {
      setError("Could not create the invite. Try again.");
      return;
    }
    const body = await res.json();
    setInviteUrl(body.inviteUrl);
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input type="email" name="email" required placeholder="client@company.com" className="flex-1 rounded-md border border-border px-3 py-2 text-sm" />
        <Button type="submit" loading={loading} size="sm">Invite</Button>
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
      {inviteUrl && (
        <p className="break-all rounded-md border border-border bg-surface-elevated p-3 text-xs">
          Invite link (no email transport configured yet — share this directly): <br />
          <a href={inviteUrl} className="underline">{inviteUrl}</a>
        </p>
      )}
    </form>
  );
}
