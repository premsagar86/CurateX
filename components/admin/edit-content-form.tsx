"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { updateContentPostSchema } from "@/lib/validation/content-post";

const formSchema = updateContentPostSchema.required({ title: true, metaDescription: true, body: true });
type FormInput = { title: string; metaDescription: string; body: string };

export function EditContentForm({
  postId,
  title,
  body,
  metaDescription,
  published,
}: {
  postId: string;
  title: string;
  body: string;
  metaDescription: string;
  published: boolean;
}) {
  const router = useRouter();
  const [isPublished, setIsPublished] = useState(published);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    resolver: zodResolver(formSchema),
    defaultValues: { title, metaDescription, body },
  });

  async function onSubmit(values: FormInput) {
    setSaved(false);
    const res = await fetch(`/api/admin/content/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      setSaved(true);
      router.refresh();
    }
  }

  async function togglePublished(next: boolean) {
    setIsPublished(next);
    await fetch(`/api/admin/content/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: next }),
    });
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between rounded-md border border-border px-4 py-3">
        <span className="text-sm font-medium">Published</span>
        <Switch checked={isPublished} onCheckedChange={togglePublished} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <input className="rounded-md border border-border px-3 py-2 text-sm" {...register("title")} />
        <input maxLength={300} className="rounded-md border border-border px-3 py-2 text-sm" {...register("metaDescription")} />
        <textarea rows={12} className="rounded-md border border-border px-3 py-2 text-sm" {...register("body")} />
        <Button type="submit" loading={isSubmitting} size="sm" className="self-start">Save changes</Button>
        {(errors.title || errors.metaDescription || errors.body) && (
          <p className="text-sm text-error">{errors.title?.message ?? errors.metaDescription?.message ?? errors.body?.message}</p>
        )}
        {saved && <p className="text-sm text-success">Saved.</p>}
      </form>
    </div>
  );
}
