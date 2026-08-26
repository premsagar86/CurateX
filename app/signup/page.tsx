// Signup — invite-token gated only (PLAN.md §20.13, §31.1). Not linked
// publicly anywhere; reached only via a founder-sent invite email.
"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!token || !email) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
        <span className="font-display text-lg tracking-tight">forge</span>
        <h1 className="mt-6 font-display text-2xl">Invalid invite link</h1>
        <p className="mt-4 text-sm text-text-muted">
          This signup link is missing or incomplete. Ask your Forge Digital contact to resend your invite.
        </p>
      </main>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const res = await fetch("/api/auth/complete-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        email,
        name: String(formData.get("name")),
        password: String(formData.get("password")),
        confirmPassword: String(formData.get("confirmPassword")),
      }),
    });

    setLoading(false);
    if (!res.ok) {
      const body: { error?: { message?: string; fields?: Record<string, string[]> } } | null = await res
        .json()
        .catch(() => null);
      const firstFieldError = Object.values(body?.error?.fields ?? {})[0]?.[0];
      setError(body?.error?.message ?? firstFieldError ?? "Something went wrong.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <span className="font-display text-lg tracking-tight">forge</span>
      <h1 className="mt-6 font-display text-2xl">Set your password</h1>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input id="email" value={email} readOnly className="mt-1 w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-text-muted" />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Name
          </label>
          <input id="name" name="name" required maxLength={100} className="mt-1 w-full rounded-md border border-border px-3 py-2" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input id="password" name="password" type="password" required minLength={8} className="mt-1 w-full rounded-md border border-border px-3 py-2" />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium">
            Confirm password
          </label>
          <input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} className="mt-1 w-full rounded-md border border-border px-3 py-2" />
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
        <Button type="submit" loading={loading}>
          Set password &amp; continue
        </Button>
      </form>
    </main>
  );
}
