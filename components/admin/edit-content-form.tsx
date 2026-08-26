"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

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
  const [loading, setLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(published);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSaved(false);
    const formData = new FormData(event.currentTarget);
    const res = await fetch(`/api/admin/content/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: String(formData.get("title")),
        metaDescription: String(formData.get("metaDescription")),
        body: String(formData.get("body")),
      }),
    });
    setLoading(false);
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="title" defaultValue={title} required className="rounded-md border border-border px-3 py-2 text-sm" />
        <input name="metaDescription" defaultValue={metaDescription} required maxLength={300} className="rounded-md border border-border px-3 py-2 text-sm" />
        <textarea name="body" defaultValue={body} required rows={12} className="rounded-md border border-border px-3 py-2 text-sm" />
        <Button type="submit" loading={loading} size="sm" className="self-start">Save changes</Button>
        {saved && <p className="text-sm text-success">Saved.</p>}
      </form>
    </div>
  );
}
