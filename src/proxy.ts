import { NextResponse, type NextRequest } from "next/server";
import { hasServerAuthSession } from "@/lib/auth/server";
import {
  DEFAULT_AUTHENTICATED_ROUTE,
  isGuestOnlyRoute,
  isProtectedRoute,
} from "@/lib/auth/routes";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const response = NextResponse.next();

  if (!isProtectedRoute(pathname) && !isGuestOnlyRoute(pathname)) {
    return response;
  }

  const authenticated = await hasServerAuthSession(request, response);

  if (!authenticated && isProtectedRoute(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (authenticated && isGuestOnlyRoute(pathname)) {
    return NextResponse.redirect(
      new URL(DEFAULT_AUTHENTICATED_ROUTE, request.url),
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tests/:path*",
    "/practice/:path*",
    "/progress/:path*",
    "/history/:path*",
    "/profile/:path*",
    "/generate/:path*",
    "/test/:path*",
    "/results/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/confirm-signup",
  ],
};
