// Admin — Content Edit — PLAN.md §18.3.
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { EditContentForm } from "@/components/admin/edit-content-form";

export default async function AdminContentEditPage({ params }: { params: { id: string } }) {
  const post = await db.contentPost.findUnique({ where: { id: params.id } });
  if (!post) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h1 className="font-display text-2xl">Edit post</h1>
      <EditContentForm postId={post.id} title={post.title} body={post.body} metaDescription={post.metaDescription} published={!!post.publishedAt} />
    </div>
  );
}
