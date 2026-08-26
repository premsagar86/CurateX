// Project files — PLAN.md §20.17.
export default function ProjectFilesPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="font-display text-2xl">Files</h1>
      {/* TODO: File Uploader (upload-permitted stages only, §36.3), file list
          grouped by milestone, version indicator — PLAN.md §20.17 */}
    </div>
  );
}
