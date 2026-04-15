import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/sign-in", "/forgot-password", "/reset-password"];
const ADMIN_DASHBOARD = "/admin/dashboard";
const ACCOUNT_DASHBOARD = "/account/dashboard";

function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isAuthenticated = Boolean(token);
  const role = (token?.role as string | undefined)?.toUpperCase();
  const isAdmin = role === "ADMIN";

  /* ── 1. Already authenticated → redirect away from public pages ── */
  if (isAuthenticated && isPublicPath(pathname)) {
    const dest = isAdmin ? ADMIN_DASHBOARD : ACCOUNT_DASHBOARD;
    return NextResponse.redirect(new URL(dest, request.url));
  }

  /* ── 2. Root "/" → smart redirect ── */
  if (pathname === "/") {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    const dest = isAdmin ? ADMIN_DASHBOARD : ACCOUNT_DASHBOARD;
    return NextResponse.redirect(new URL(dest, request.url));
  }

  /* ── 3. Protected routes → require authentication ── */
  if (pathname.startsWith("/admin") || pathname.startsWith("/account")) {
    if (!isAuthenticated) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    /* ── 4. Role-based access ── */
    // Non-admins cannot access /admin/* routes
    if (pathname.startsWith("/admin") && !isAdmin) {
      return NextResponse.redirect(new URL(ACCOUNT_DASHBOARD, request.url));
    }

    // Admins cannot access /account/* routes
    if (pathname.startsWith("/account") && isAdmin) {
      return NextResponse.redirect(new URL(ADMIN_DASHBOARD, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Run middleware on all routes except:
   * - Next.js internals (_next/static, _next/image)
   * - Static public assets (favicons, images, etc.)
   * - NextAuth API routes (must be excluded or they break)
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets/|api/auth).*)",
  ],
};
