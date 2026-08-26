// Signup — invite-token gated only (PLAN.md §20.13, §31.1). Not linked
// publicly anywhere; reached only via a founder-sent invite email.
export default function SignupPage({ searchParams }: { searchParams: { token?: string } }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <span className="font-display text-lg tracking-tight">forge</span>
      <h1 className="mt-6 font-display text-2xl">Set your password</h1>
      {/* TODO: validate searchParams.token, pre-fill email, name + password +
          confirm fields, "Set password & continue" -> /dashboard — PLAN.md §20.13 */}
      <p className="mt-4 text-sm text-text-muted">Invite token: {searchParams.token ?? "missing"}</p>
    </main>
  );
}
