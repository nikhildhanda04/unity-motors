import { NextResponse, type NextRequest } from "next/server";

const LOGIN_PATH = "/admin/login";

/**
 * Edge guard for the admin area (Next 16 "proxy" convention, formerly middleware). Compares the session cookie against a
 * high-entropy random ADMIN_TOKEN, so a plain === is fine here (node:crypto
 * isn't available on the edge runtime anyway).
 *
 * This only gates navigation. Server actions and /api routes re-check with
 * isAuthed() — middleware alone is never the whole authorization story.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = process.env.ADMIN_TOKEN;
  const authed = Boolean(token) && req.cookies.get("um_admin")?.value === token;

  // The login page must stay reachable while logged out, or it redirects to itself.
  if (pathname === LOGIN_PATH) {
    return authed
      ? NextResponse.redirect(new URL("/admin", req.url))
      : NextResponse.next();
  }

  if (authed) return NextResponse.next();
  return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};
