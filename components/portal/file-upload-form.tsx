"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function FileUploadForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    if (!fileInput.files?.length) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const res = await fetch(`/api/projects/${projectId}/files`, { method: "POST", body: formData });

    setLoading(false);
    if (!res.ok) {
      setError("Upload failed. Try again.");
      return;
    }
    form.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border p-6">
      <input type="file" name="file" required className="text-sm" />
      {error && <p className="text-sm text-error">{error}</p>}
      <Button type="submit" loading={loading} size="sm">
        Upload
      </Button>
    </form>
  );
}
