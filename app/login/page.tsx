// Login — PLAN.md §20.12. Minimal chrome, no marketing nav, no public
// signup link (accounts are invite-only, §18.4).
"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth-client";

interface LoginInput {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>();

  async function onSubmit(values: LoginInput) {
    const { error: signInError } = await signIn.email(values);

    if (signInError) {
      setError("root", { message: "Invalid email or password." });
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <span className="font-display text-lg tracking-tight">forge</span>
      <h1 className="mt-6 font-display text-2xl">Log in</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input id="email" type="email" className="mt-1 w-full rounded-md border border-border px-3 py-2" {...register("email", { required: true })} />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <input id="password" type="password" className="mt-1 w-full rounded-md border border-border px-3 py-2" {...register("password", { required: true })} />
        </div>
        {(errors.root || errors.email || errors.password) && (
          <p className="text-sm text-error">{errors.root?.message ?? "Enter your email and password."}</p>
        )}
        <Button type="submit" loading={isSubmitting}>
          Log in
        </Button>
      </form>
      {/* No public "sign up" link — accounts are invite-only, PLAN.md §18.4 */}
    </main>
  );
}
