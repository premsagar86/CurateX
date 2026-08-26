"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

export function CreateContentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title"));
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug: slugify(title),
        metaDescription: String(formData.get("metaDescription")),
        body: String(formData.get("body")),
      }),
    });

    setLoading(false);
    if (!res.ok) {
      setError("Could not create the post.");
      return;
    }
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input name="title" required placeholder="Title" className="rounded-md border border-border px-3 py-2 text-sm" />
      <input name="metaDescription" required maxLength={300} placeholder="Meta description" className="rounded-md border border-border px-3 py-2 text-sm" />
      <textarea name="body" required rows={6} placeholder="Post body" className="rounded-md border border-border px-3 py-2 text-sm" />
      <Button type="submit" loading={loading} size="sm" className="self-start">Create draft</Button>
      {error && <p className="text-sm text-error">{error}</p>}
    </form>
  );
}
