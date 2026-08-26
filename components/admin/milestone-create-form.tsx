"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { createMilestoneSchema } from "@/lib/validation/milestone";

const nameOnlySchema = createMilestoneSchema.pick({ name: true });
type NameOnlyInput = { name: string };

export function MilestoneCreateForm({ projectId, nextOrder }: { projectId: string; nextOrder: number }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<NameOnlyInput>({ resolver: zodResolver(nameOnlySchema) });

  async function onSubmit(values: NameOnlyInput) {
    const res = await fetch(`/api/projects/${projectId}/milestones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: values.name, order: nextOrder }),
    });

    if (!res.ok) {
      setError("root", { message: "Could not create the milestone." });
      return;
    }
    reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <input placeholder="Milestone name" className="flex-1 rounded-md border border-border px-3 py-2 text-sm" {...register("name")} />
      <Button type="submit" loading={isSubmitting} size="sm">Add milestone</Button>
      {(errors.root || errors.name) && <p className="text-sm text-error">{errors.root?.message ?? errors.name?.message}</p>}
    </form>
  );
}
