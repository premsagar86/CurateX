"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface InviteInput {
  email: string;
}

export function InviteUserForm({ clientId }: { clientId: string }) {
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<InviteInput>();

  async function onSubmit(values: InviteInput) {
    setInviteUrl(null);
    const res = await fetch(`/api/admin/clients/${clientId}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      setError("root", { message: "Could not create the invite. Try again." });
      return;
    }
    const body = await res.json();
    setInviteUrl(body.inviteUrl);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="client@company.com"
          className="flex-1 rounded-md border border-border px-3 py-2 text-sm"
          {...register("email", { required: true })}
        />
        <Button type="submit" loading={isSubmitting} size="sm">Invite</Button>
      </div>
      {(errors.root || errors.email) && <p className="text-sm text-error">{errors.root?.message ?? "Enter a valid email."}</p>}
      {inviteUrl && (
        <p className="break-all rounded-md border border-border bg-surface-elevated p-3 text-xs">
          Invite link (no email transport configured yet — share this directly): <br />
          <a href={inviteUrl} className="underline">{inviteUrl}</a>
        </p>
      )}
    </form>
  );
}
