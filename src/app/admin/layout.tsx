import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";

import { getAdmin } from "@/lib/auth";
import { canSave } from "@/lib/paintings-store";

import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#f3f1ec]">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 sm:px-6">
          <Link href="/admin" className="font-serif text-2xl">
            Irina Davis <span className="text-muted">· Studio</span>
          </Link>
          <div className="flex items-center gap-5 text-sm">
            <Link href="/" className="link text-muted">
              View site
            </Link>
            <Suspense fallback={null}>
              <SignedInAs />
            </Suspense>
          </div>
        </div>
      </header>

      {!canSave && (
        <div className="border-b border-[#ecd9b4] bg-[#fbf3e2]">
          <p className="mx-auto max-w-5xl px-4 py-3 text-sm sm:px-6">
            <strong className="font-medium">Demo mode.</strong> Saving is turned off on the live site until a database
            and image storage are connected. To try adding paintings, run the site on your computer with{" "}
            <code className="rounded bg-white/70 px-1">npm run dev</code>.
          </p>
        </div>
      )}

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}

async function SignedInAs() {
  const admin = await getAdmin();
  if (!admin) return null;
  return (
    <form action={signOut} className="flex items-center gap-3">
      <span className="hidden text-muted sm:inline">{admin.email}</span>
      <button type="submit" className="link">
        Sign out
      </button>
    </form>
  );
}
