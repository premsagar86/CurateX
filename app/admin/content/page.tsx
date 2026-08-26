// Admin — Content — PLAN.md §18.3.
import Link from "next/link";
import { listContentPosts } from "@/features/content/list";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { CreateContentForm } from "@/components/admin/create-content-form";

export default async function AdminContentPage() {
  const posts = await listContentPosts();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl">Content</h1>

      <div>
        <p className="mb-2 text-sm font-medium">New post</p>
        <CreateContentForm />
      </div>

      {posts.length === 0 ? (
        <EmptyState title="No posts yet" />
      ) : (
        <ul className="flex flex-col gap-2">
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/admin/content/${post.id}`} className="flex items-center justify-between rounded-md border border-border px-4 py-3 text-sm hover:bg-surface-elevated">
                <span>{post.title}</span>
                <Badge variant={post.publishedAt ? "success" : "neutral"}>{post.publishedAt ? "Published" : "Draft"}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
