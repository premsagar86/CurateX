// Signup — invite-token gated only (PLAN.md §20.13, §31.1). Not linked
// publicly anywhere; reached only via a founder-sent invite email.
"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";

// signupSchema (lib/validation/signup.ts) also validates `token`/`email`,
// which aren't user-entered here (they come from the invite link) — mirror
// its password-match refinement locally for just the fields this form owns.
const signupFormSchema = z
  .object({
    name: z.string().min(1).max(100),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
type SignupFormInput = z.infer<typeof signupFormSchema>;

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
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormInput>({ resolver: zodResolver(signupFormSchema) });

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

  async function onSubmit(values: SignupFormInput) {
    setError(null);
    const res = await fetch("/api/auth/complete-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email, ...values }),
    });

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

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
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
          <input id="name" maxLength={100} className="mt-1 w-full rounded-md border border-border px-3 py-2" {...register("name")} />
          {errors.name && <p className="mt-1 text-sm text-error">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input id="password" type="password" className="mt-1 w-full rounded-md border border-border px-3 py-2" {...register("password")} />
          {errors.password && <p className="mt-1 text-sm text-error">{errors.password.message}</p>}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium">
            Confirm password
          </label>
          <input id="confirmPassword" type="password" className="mt-1 w-full rounded-md border border-border px-3 py-2" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="mt-1 text-sm text-error">{errors.confirmPassword.message}</p>}
        </div>
        {error && <p className="text-sm text-error">{error}</p>}
        <Button type="submit" loading={isSubmitting}>
          Set password &amp; continue
        </Button>
      </form>
    </main>
  );
}
