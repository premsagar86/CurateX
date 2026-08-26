// Settings — profile, password, and notification-preference forms.
// PLAN.md §20.19, §37.4.
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { changePassword } from "@/lib/auth-client";
import { profileSchema, type ProfileInput } from "@/lib/validation/settings";

export function ProfileForm({ name, email, phone }: { name: string; email: string; phone: string | null }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name, phone: phone ?? "" },
  });

  async function onSubmit(values: ProfileInput) {
    setSaved(false);
    const res = await fetch("/api/settings/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">Name</label>
        <input id="name" className="mt-1 w-full rounded-md border border-border px-3 py-2" {...register("name")} />
        {errors.name && <p className="mt-1 text-sm text-error">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">Email</label>
        <input id="email" value={email} readOnly className="mt-1 w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-text-muted" />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
        <input id="phone" className="mt-1 w-full rounded-md border border-border px-3 py-2" {...register("phone")} />
      </div>
      <Button type="submit" loading={isSubmitting} size="sm" className="self-start">Save</Button>
      {saved && <p className="text-sm text-success">Saved.</p>}
    </form>
  );
}

interface PasswordFormInput {
  currentPassword: string;
  newPassword: string;
}

export function PasswordForm() {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormInput>();

  async function onSubmit(values: PasswordFormInput) {
    setSuccess(false);
    const { error: changeError } = await changePassword({ ...values, revokeOtherSessions: true });

    if (changeError) {
      setError("root", { message: "Could not change your password. Check your current password and try again." });
      return;
    }
    setSuccess(true);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label htmlFor="currentPassword" className="block text-sm font-medium">Current password</label>
        <input
          id="currentPassword"
          type="password"
          className="mt-1 w-full rounded-md border border-border px-3 py-2"
          {...register("currentPassword", { required: true })}
        />
      </div>
      <div>
        <label htmlFor="newPassword" className="block text-sm font-medium">New password</label>
        <input
          id="newPassword"
          type="password"
          className="mt-1 w-full rounded-md border border-border px-3 py-2"
          {...register("newPassword", { required: true, minLength: 8 })}
        />
        {errors.newPassword && <p className="mt-1 text-sm text-error">Password must be at least 8 characters.</p>}
      </div>
      {errors.root && <p className="text-sm text-error">{errors.root.message}</p>}
      {success && <p className="text-sm text-success">Password updated.</p>}
      <Button type="submit" loading={isSubmitting} size="sm" className="self-start">Change password</Button>
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

// Each toggle saves instantly on change (no submit step), so this stays
// plain controlled state rather than an RHF register/handleSubmit form.
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
