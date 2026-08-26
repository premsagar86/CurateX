"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { createContentPostSchema } from "@/lib/validation/content-post";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

const formSchema = createContentPostSchema.omit({ slug: true });
type FormInput = { title: string; metaDescription: string; body: string };

export function CreateContentForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({ resolver: zodResolver(formSchema) });

  async function onSubmit(values: FormInput) {
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, slug: slugify(values.title) }),
    });

    if (!res.ok) {
      setError("root", { message: "Could not create the post." });
      return;
    }
    reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <input placeholder="Title" className="rounded-md border border-border px-3 py-2 text-sm" {...register("title")} />
      <input maxLength={300} placeholder="Meta description" className="rounded-md border border-border px-3 py-2 text-sm" {...register("metaDescription")} />
      <textarea rows={6} placeholder="Post body" className="rounded-md border border-border px-3 py-2 text-sm" {...register("body")} />
      <Button type="submit" loading={isSubmitting} size="sm" className="self-start">Create draft</Button>
      {(errors.root || errors.title || errors.metaDescription || errors.body) && (
        <p className="text-sm text-error">
          {errors.root?.message ?? errors.title?.message ?? errors.metaDescription?.message ?? errors.body?.message}
        </p>
      )}
    </form>
  );
}
