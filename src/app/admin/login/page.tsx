import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getAdmin } from "@/lib/auth";

import { signIn } from "../actions";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await getAdmin()) redirect("/admin");

  return (
    <div className="mx-auto max-w-sm py-8 sm:py-14">
      <div className="rounded-xl border border-line bg-white p-8 text-center shadow-sm">
        <h1 className="font-serif text-3xl">Studio sign-in</h1>
        <p className="mt-2 text-sm text-muted">This area is only for Irina, to add and manage paintings.</p>

        <form action={signIn} className="mt-8">
          <button type="submit" className="btn w-full border border-line bg-white hover:bg-panel">
            <span aria-hidden className="grid size-5 place-items-center rounded-full bg-ink text-[11px] font-semibold text-paper">
              G
            </span>
            Sign in with Google
          </button>
        </form>

        <p className="mt-6 rounded-md bg-panel px-3 py-2 text-xs leading-relaxed text-muted">
          Placeholder: this button doesn&apos;t check anything yet. Real Google sign-in, limited to Irina&apos;s Gmail
          address, comes later.
        </p>
      </div>
      <p className="mt-6 text-center text-sm">
        <Link href="/" className="link text-muted">
          ← Back to the site
        </Link>
      </p>
    </div>
  );
}
