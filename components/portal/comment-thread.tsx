"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { commentSchema, type CommentInput } from "@/lib/validation/comment";

export interface CommentData {
  id: string;
  body: string;
  createdAt: string;
  author: { name: string };
}

export function CommentThread({ projectId, comments }: { projectId: string; comments: CommentData[] }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CommentInput>({ resolver: zodResolver(commentSchema) });

  async function onSubmit(payload: CommentInput) {
    const res = await fetch(`/api/projects/${projectId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setError("root", { message: "Could not post your message. Try again." });
      return;
    }
    reset();
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

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <textarea rows={3} placeholder="Write a message about this project…" className="w-full rounded-md border border-border px-3 py-2" {...register("body")} />
        {(errors.root || errors.body) && <p className="text-sm text-error">{errors.root?.message ?? errors.body?.message}</p>}
        <Button type="submit" loading={isSubmitting} size="sm" className="self-start">
          Post
        </Button>
      </form>
    </div>
  );
}
