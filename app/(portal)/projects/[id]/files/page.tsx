// Client Portal — Files — PLAN.md §20.17.
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProjectDetail } from "@/features/projects/get";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { FileUploadForm } from "@/components/portal/file-upload-form";

export default async function ProjectFilesPage({ params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: headers() });
  const project = await getProjectDetail(params.id);

  if (!project) notFound();
  const isOwner = session!.user.role === "TEAM" || project.clientId === session!.user.clientId;
  if (!isOwner) notFound();

  // Client upload permission is stage-gated (§36.3) — restricted to
  // ACTIVE/REVIEW, the stages a client would actually have something to share.
  const canUpload = project.state === "ACTIVE" || project.state === "REVIEW";

  const grouped = new Map<string, typeof project.files>();
  for (const file of project.files) {
    const key = file.milestoneId ?? "General";
    grouped.set(key, [...(grouped.get(key) ?? []), file]);
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl">Files — {project.name}</h1>

      {canUpload && <FileUploadForm projectId={project.id} />}

      {project.files.length === 0 ? (
        <EmptyState title="No files yet" />
      ) : (
        Array.from(grouped.entries()).map(([groupKey, files]) => {
          const milestone = project.milestones.find((m) => m.id === groupKey);
          return (
            <div key={groupKey}>
              <h2 className="mb-2 font-medium">{milestone ? milestone.name : "General"}</h2>
              <ul className="flex flex-col gap-2">
                {files.map((file) => (
                  <li key={file.id} className="flex items-center justify-between rounded-md border border-border px-4 py-2 text-sm">
                    <div>
                      <a href={file.storageKey} download className="underline">
                        {file.name}
                      </a>
                      <p className="text-xs text-text-muted">
                        {file.uploadedBy.name} · {file.createdAt.toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    {file.version > 1 && <Badge variant="info">v{file.version}</Badge>}
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
}
