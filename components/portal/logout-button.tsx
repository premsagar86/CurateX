"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await signOut();
        router.push("/login");
        router.refresh();
      }}
      // Portal keeps the plain underlined-link look; admin passes its own
      // button styling.
      className={className ?? "mt-2 text-text-muted underline"}
    >
      Log out
    </button>
  );
}
