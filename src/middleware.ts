import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN = "ADMIN";
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|uploads|.*\\..+).*)",
  ],
};

function redirectTo(url: string, req: NextRequest) {
  const destination = `${url}${req.nextUrl.search ? `&cb=${encodeURIComponent(req.nextUrl.pathname)}` : `?cb=${encodeURIComponent(req.nextUrl.pathname)}`}`;
  return NextResponse.redirect(new URL(destination, req.url));
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;
  const role = (token?.role as string | undefined) ?? undefined;

  if (authRoutes.includes(pathname)) {
    if (isLoggedIn && role === ADMIN) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return redirectTo("/login", req);
    }
    if (role !== ADMIN) {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    return NextResponse.next();
  }

  if (isDashboardRoute) {
    if (!isLoggedIn) {
      return redirectTo("/login", req);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}
