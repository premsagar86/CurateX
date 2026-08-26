// Admin — Settings — PLAN.md §18.3, §53. Founder structure isn't
// app-managed data (§53's own note) — it's reference content here, not an
// editable form.
import { db } from "@/lib/db";

const DOMAINS = [
  { role: "Founder 1 — Business & Growth Lead", covers: "Sales, client relationships, finance, operations" },
  { role: "Founder 2 — Design & Brand Lead", covers: "Brand, UI/UX, creative direction, content/social" },
  { role: "Founder 3 — Technology & Product Lead", covers: "Engineering, architecture, platform, security" },
];

export default async function AdminSettingsPage() {
  const teamUsers = await db.user.findMany({ where: { role: "TEAM" }, orderBy: { name: "asc" } });

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-2xl">Settings</h1>

      <div>
        <h2 className="mb-3 font-display text-lg">Team</h2>
        <ul className="flex flex-col gap-2">
          {teamUsers.map((user) => (
            <li key={user.id} className="rounded-md border border-border px-4 py-2 text-sm">
              {user.name} — {user.email}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg">Founder domains</h2>
        <ul className="flex flex-col gap-2">
          {DOMAINS.map((d) => (
            <li key={d.role} className="rounded-md border border-border px-4 py-2 text-sm">
              <p className="font-medium">{d.role}</p>
              <p className="text-text-muted">{d.covers}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-3 font-display text-lg">WIP cap</h2>
        <p className="text-sm text-text-muted">
          A founder should not have more than 4 projects simultaneously in ONBOARDING through REVIEW —
          tracked as a warning on the admin dashboard, not a hard block.
        </p>
      </div>
    </div>
  );
}
