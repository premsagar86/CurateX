// Client Portal — Settings — PLAN.md §20.19.
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileForm, PasswordForm, NotificationPrefsForm, type NotificationPrefs } from "@/components/portal/settings-forms";

const DEFAULT_PREFS: NotificationPrefs = { milestoneApproval: true, invoiceDue: true, projectComments: true };

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: headers() });
  const user = await db.user.findUniqueOrThrow({ where: { id: session!.user.id } });
  const prefs = { ...DEFAULT_PREFS, ...(user.notificationPrefs as Partial<NotificationPrefs> | null) };

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <h1 className="font-display text-2xl">Settings</h1>

      <section>
        <h2 className="mb-3 font-display text-lg">Profile</h2>
        <ProfileForm name={user.name} email={user.email} phone={user.phone} />
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg">Password</h2>
        <PasswordForm />
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg">Notifications</h2>
        <NotificationPrefsForm initial={prefs} />
      </section>
    </div>
  );
}
