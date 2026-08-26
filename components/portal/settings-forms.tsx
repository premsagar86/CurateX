// Settings — profile, password, and notification-preference forms.
// PLAN.md §20.19, §37.4.
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { changePassword } from "@/lib/auth-client";

export function ProfileForm({ name, email, phone }: { name: string; email: string; phone: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSaved(false);
    const formData = new FormData(event.currentTarget);
    const res = await fetch("/api/settings/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: String(formData.get("name")), phone: String(formData.get("phone") || "") }),
    });
    setLoading(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Name</label>
        <input id="name" name="name" defaultValue={name} required className="mt-1 w-full rounded-md border border-border px-3 py-2" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input id="email" value={email} readOnly className="mt-1 w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-text-muted" />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
        <input id="phone" name="phone" defaultValue={phone ?? ""} className="mt-1 w-full rounded-md border border-border px-3 py-2" />
      </div>
      <Button type="submit" loading={loading} size="sm" className="self-start">Save</Button>
      {saved && <p className="text-sm text-success">Saved.</p>}
    </form>
  );
}

export function PasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const currentPassword = String(formData.get("currentPassword"));
    const newPassword = String(formData.get("newPassword"));

    const { error: changeError } = await changePassword({ currentPassword, newPassword, revokeOtherSessions: true });

    setLoading(false);
    if (changeError) {
      setError("Could not change your password. Check your current password and try again.");
      return;
    }
    setSuccess(true);
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium">Current password</label>
        <input id="currentPassword" name="currentPassword" type="password" required className="mt-1 w-full rounded-md border border-border px-3 py-2" />
      </div>
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium">New password</label>
        <input id="newPassword" name="newPassword" type="password" required minLength={8} className="mt-1 w-full rounded-md border border-border px-3 py-2" />
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
      {success && <p className="text-sm text-success">Password updated.</p>}
      <Button type="submit" loading={loading} size="sm" className="self-start">Change password</Button>
    </form>
  );
}

export interface NotificationPrefs {
  milestoneApproval: boolean;
  invoiceDue: boolean;
  projectComments: boolean;
}

const PREF_LABELS: { key: keyof NotificationPrefs; label: string }[] = [
  { key: "milestoneApproval", label: "A milestone needs my approval" },
  { key: "invoiceDue", label: "An invoice is due" },
  { key: "projectComments", label: "New project messages" },
];

export function NotificationPrefsForm({ initial }: { initial: NotificationPrefs }) {
  const [prefs, setPrefs] = useState(initial);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  async function toggle(key: keyof NotificationPrefs, value: boolean) {
    const next = { ...prefs, [key]: value };
    setPrefs(next);
    setSavingKey(key);
    await fetch("/api/settings/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setSavingKey(null);
  }

  return (
    <div className="flex flex-col gap-4">
      {PREF_LABELS.map(({ key, label }) => (
        <div key={key} className="flex items-center justify-between">
          <span className="text-sm">{label}</span>
          <Switch checked={prefs[key]} loading={savingKey === key} onCheckedChange={(checked) => toggle(key, checked)} />
        </div>
      ))}
    </div>
  );
}
