import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { domains } from "@/lib/nav";

const ADMIN = "ADMIN";
const SUPPORT = "SUPPORT";
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
  const host = req.headers.get("host") ?? "";
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;
  const role = (token?.role as string | undefined) ?? undefined;

  if (host.includes("nikmohaseb.com")) {
    const url = new URL(req.nextUrl.pathname, domains.primary);
    url.search = req.nextUrl.search;
    return NextResponse.redirect(url, 301);
  }

  if (pathname === "/library/terms-and-conditions" || pathname === "/library/terms-and-conditions/") {
    const cat = req.nextUrl.searchParams.get("category");
    const target = cat
      ? new URL(`/library/categories/${cat}`, req.url)
      : new URL("/library", req.url);
    return NextResponse.redirect(target, 301);
  }
  const tncMatch = pathname.match(/^\/library\/terms-and-conditions\/([^/]+)(?:\/([^/]+))?\/?$/);
  if (tncMatch) {
    const lawSlug = tncMatch[1];
    const articleSlug = tncMatch[2];
    const target = articleSlug
      ? new URL(`/library/laws/${lawSlug}/articles/${articleSlug}`, req.url)
      : new URL(`/library/laws/${lawSlug}`, req.url);
    return NextResponse.redirect(target, 301);
  }
  if (pathname === "/library" && req.nextUrl.searchParams.has("category")) {
    const slug = req.nextUrl.searchParams.get("category")!;
    return NextResponse.redirect(new URL(`/library/categories/${slug}`, req.url), 301);
  }

  if (authRoutes.includes(pathname)) {
    if (isLoggedIn && (role === ADMIN || role === SUPPORT)) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isTicketRoute = pathname.startsWith("/admin/tickets");

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return redirectTo("/login", req);
    }
    if (role === SUPPORT) {
      if (!isTicketRoute) {
        return NextResponse.redirect(new URL("/admin/tickets", req.url));
      }
      return NextResponse.next();
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
