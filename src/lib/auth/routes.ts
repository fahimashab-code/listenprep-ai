export const DEFAULT_AUTHENTICATED_ROUTE = "/dashboard";

const protectedRoutePrefixes = [
  "/dashboard",
  "/tests",
  "/practice",
  "/progress",
  "/history",
  "/profile",
  "/generate",
  "/test",
  "/results",
] as const;

const guestOnlyRoutePrefixes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/confirm-signup",
] as const;

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isProtectedRoute(pathname: string) {
  return protectedRoutePrefixes.some((prefix) =>
    matchesPrefix(pathname, prefix),
  );
}

export function isGuestOnlyRoute(pathname: string) {
  return guestOnlyRoutePrefixes.some((prefix) =>
    matchesPrefix(pathname, prefix),
  );
}

export function safeRedirectPath(path: string | null | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return DEFAULT_AUTHENTICATED_ROUTE;
  }

  return path;
}
