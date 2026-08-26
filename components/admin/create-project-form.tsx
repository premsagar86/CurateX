"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { services } from "@/config/services";
import { createProjectSchema, type CreateProjectInput } from "@/lib/validation/create-project";

const TIERS = ["STARTER", "GROWTH", "PREMIUM", "CUSTOM"] as const;

export function CreateProjectForm({ clientId, founders }: { clientId: string; founders: { id: string; name: string }[] }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectInput>({ resolver: zodResolver(createProjectSchema) });

  async function onSubmit(payload: CreateProjectInput) {
    const res = await fetch(`/api/admin/clients/${clientId}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setError("root", { message: "Could not create the project." });
      return;
    }
    reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-2">
      <input placeholder="Project name" className="rounded-md border border-border px-3 py-2 text-sm" {...register("name")} />
      <select className="rounded-md border border-border px-2 py-2 text-sm" {...register("serviceType")}>
        {services.map((s) => <option key={s.type} value={s.type}>{s.name}</option>)}
      </select>
      <select className="rounded-md border border-border px-2 py-2 text-sm" {...register("packageTier")}>
        {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>
      <select className="rounded-md border border-border px-2 py-2 text-sm" {...register("founderOwnerId")}>
        {founders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
      </select>
      <Button type="submit" loading={isSubmitting} size="sm">Create project</Button>
      {(errors.root || errors.name) && (
        <p className="w-full text-sm text-error">{errors.root?.message ?? errors.name?.message}</p>
      )}
    </form>
  );
}
