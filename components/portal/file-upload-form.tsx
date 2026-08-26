"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface FileFormInput {
  file: FileList;
}

export function FileUploadForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FileFormInput>();

  async function onSubmit(values: FileFormInput) {
    const file = values.file?.[0];
    if (!file) return;

    setError(null);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/projects/${projectId}/files`, { method: "POST", body: formData });

    if (!res.ok) {
      setError("Upload failed. Try again.");
      return;
    }
    reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-border p-6">
      <input type="file" className="text-sm" {...register("file", { required: true })} />
      {error && <p className="text-sm text-error">{error}</p>}
      <Button type="submit" loading={isSubmitting} size="sm">
        Upload
      </Button>
    </form>
  );
}
