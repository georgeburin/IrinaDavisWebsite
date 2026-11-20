import { NextResponse, type NextRequest } from "next/server";

import { ADMIN_COOKIE } from "@/lib/auth-cookie";

// Quick check before admin pages load: no session cookie means "go to sign-in".
// This is only a shortcut. Every admin page and action still checks the session itself.
export function proxy(request: NextRequest) {
  if (!request.cookies.has(ADMIN_COOKIE)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
