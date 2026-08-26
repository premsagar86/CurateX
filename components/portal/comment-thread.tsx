"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export interface CommentData {
  id: string;
  body: string;
  createdAt: string;
  author: { name: string };
}

export function CommentThread({ projectId, comments }: { projectId: string; comments: CommentData[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const res = await fetch(`/api/projects/${projectId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: String(formData.get("body")) }),
    });

    setLoading(false);
    if (!res.ok) {
      setError("Could not post your message. Try again.");
      return;
    }
    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.length === 0 ? (
        <p className="text-sm text-text-muted">No messages yet — start the conversation below.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-md border border-border p-3 text-sm">
              <p className="font-medium">{comment.author.name}</p>
              <p className="mt-1">{comment.body}</p>
              <p className="mt-1 text-xs text-text-muted">{new Date(comment.createdAt).toLocaleString("en-IN")}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea name="body" required rows={3} placeholder="Write a message about this project…" className="w-full rounded-md border border-border px-3 py-2" />
        {error && <p className="text-sm text-error">{error}</p>}
        <Button type="submit" loading={loading} size="sm" className="self-start">
          Post
        </Button>
      </form>
    </div>
  );
}
