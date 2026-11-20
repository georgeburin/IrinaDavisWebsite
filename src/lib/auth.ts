import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_COOKIE } from "./auth-cookie";

// ---------------------------------------------------------------------------
// PLACEHOLDER SIGN-IN.
//
// "Sign in with Google" doesn't check anything yet: clicking it sets a cookie
// and you're in. Replace this file with real Google sign-in that only lets
// Irina's Gmail address through. Every admin page and admin action already
// calls requireAdmin(), so that's the only place that needs to change.
// ---------------------------------------------------------------------------

export type Admin = { name: string; email: string };

const DEMO_ADMIN: Admin = { name: "Irina Davis", email: "irina@example.com" };

export async function getAdmin(): Promise<Admin | null> {
  const session = (await cookies()).get(ADMIN_COOKIE)?.value;
  return session === "demo" ? DEMO_ADMIN : null;
}

/** Use at the top of every admin page and admin action. Sends visitors to the sign-in page. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function startDemoSession(): Promise<void> {
  (await cookies()).set(ADMIN_COOKIE, "demo", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
}
