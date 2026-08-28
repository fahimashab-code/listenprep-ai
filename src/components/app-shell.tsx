"use client";

import {
  BarChart3,
  BookOpenCheck,
  ChevronDown,
  ClipboardList,
  History,
  Home,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Sun,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Brand } from "@/components/brand";
import { useTheme } from "@/components/theme-provider";
import { logoutUser } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/tests", label: "Mock Tests", icon: ClipboardList },
  { href: "/practice", label: "Practice", icon: BookOpenCheck },
  { href: "/generate", label: "Create Practice", icon: Sparkles },
  { href: "/history", label: "History", icon: History },
];

const titles: Record<string, string> = {
  "/dashboard": "Home",
  "/tests": "Mock Tests",
  "/practice": "Practice",
  "/progress": "Progress",
  "/history": "History",
  "/profile": "Profile",
  "/generate": "Create Custom Practice",
};

function NavLink({
  href,
  label,
  icon: Icon,
  pathname,
  onClick,
  collapsed = false,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  pathname: string;
  onClick?: () => void;
  collapsed?: boolean;
}) {
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold",
        collapsed && "justify-center px-0",
        active
          ? "bg-primary-soft text-primary"
          : "text-muted hover:bg-surface-subtle hover:text-ink",
      )}
      aria-current={active ? "page" : undefined}
      aria-label={collapsed ? label : undefined}
      title={collapsed ? label : undefined}
    >
      <Icon className="size-[18px] shrink-0" aria-hidden="true" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}

export function AppShell({
  children,
  userName,
  userEmail,
}: {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { preference, setPreference } = useTheme();
  const darkTheme = preference === "dark";
  const rootPath = `/${pathname.split("/")[1]}`;
  const title =
    titles[rootPath] ??
    (pathname.includes("/practice/") ? "Focused Practice" : "Listenly");
  const displayName = userName || userEmail;
  const initial = displayName.trim().charAt(0).toUpperCase() || "U";

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem("listenly-demo-auth");
      router.replace("/login");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden border-r bg-white py-6 transition-[width] duration-200 lg:flex lg:flex-col",
          sidebarCollapsed ? "w-20 px-3" : "w-[248px] px-4",
        )}
      >
        <div className={cn("flex", sidebarCollapsed ? "justify-center" : "px-2")}>
          <Brand href="/dashboard" compact={sidebarCollapsed} />
        </div>
        <button
          type="button"
          onClick={() => setSidebarCollapsed((value) => !value)}
          className="absolute -right-4 top-7 grid size-8 place-items-center rounded-full border bg-white text-muted shadow-sm hover:bg-surface-subtle hover:text-ink"
          aria-label={
            sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
          }
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </button>
        <nav className="mt-9 space-y-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              pathname={pathname}
              collapsed={sidebarCollapsed}
            />
          ))}
        </nav>

        <div
          className={cn(
            "mt-auto rounded-xl bg-surface-subtle",
            sidebarCollapsed ? "grid place-items-center p-2" : "p-4",
          )}
          title={sidebarCollapsed ? `${displayName} · ${userEmail}` : undefined}
        >
          {sidebarCollapsed ? (
            <span className="grid size-9 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">
              {initial}
            </span>
          ) : (
            <>
              <p className="truncate text-sm font-bold">{displayName}</p>
              <p className="mt-1 truncate text-xs text-muted">{userEmail}</p>
            </>
          )}
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            className="absolute inset-0 bg-[#17201a]/35"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
          />
          <aside className="relative h-full w-[280px] bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <Brand href="/dashboard" />
              <button
                className="grid size-10 place-items-center rounded-lg hover:bg-surface-subtle"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="mt-8 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  {...item}
                  pathname={pathname}
                  onClick={() => setMobileOpen(false)}
                />
              ))}
            </nav>
            <div className="mt-6 space-y-1 border-t pt-4">
              <NavLink
                href="/progress"
                label="Progress"
                icon={BarChart3}
                pathname={pathname}
                onClick={() => setMobileOpen(false)}
              />
              <NavLink
                href="/profile"
                label="Profile"
                icon={UserRound}
                pathname={pathname}
                onClick={() => setMobileOpen(false)}
              />
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted hover:bg-surface-subtle hover:text-ink disabled:opacity-50"
              >
                <LogOut className="size-[18px]" aria-hidden="true" />
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </aside>
        </div>
      )}

      <div
        className={cn(
          "transition-[padding] duration-200",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-[248px]",
        )}
      >
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="grid size-10 place-items-center rounded-lg border lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="text-lg font-bold sm:text-xl">{title}</h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPreference(darkTheme ? "light" : "dark")}
              className="grid size-10 place-items-center rounded-lg text-muted hover:bg-surface-subtle hover:text-ink"
              aria-label={darkTheme ? "Use light theme" : "Use dark theme"}
              title={darkTheme ? "Use light theme" : "Use dark theme"}
            >
              {darkTheme ? (
                <Sun className="size-5" />
              ) : (
                <Moon className="size-5" />
              )}
            </button>
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-surface-subtle"
                onClick={() => setUserOpen((value) => !value)}
                aria-expanded={userOpen}
                aria-haspopup="menu"
              >
                <span className="grid size-8 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                  {initial}
                </span>
                <span className="hidden max-w-36 truncate text-sm font-semibold md:inline">
                  {displayName}
                </span>
                <ChevronDown
                  className={cn(
                    "hidden size-4 text-muted transition-transform md:inline",
                    userOpen && "rotate-180",
                  )}
                />
              </button>
              {userOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl border bg-white p-1.5 shadow-lg"
                  role="menu"
                >
                {[
                  { href: "/progress", label: "Progress", icon: BarChart3 },
                  { href: "/profile", label: "Profile", icon: UserRound },
                ].map(({ href, label, icon: Icon }) => (
                  <Link
                    key={label}
                    href={href}
                    role="menuitem"
                    onClick={() => setUserOpen(false)}
                    className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted hover:bg-surface-subtle hover:text-ink"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                  </Link>
                ))}
                <button
                  type="button"
                  role="menuitem"
                  disabled={signingOut}
                  onClick={handleSignOut}
                  className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-semibold text-muted hover:bg-surface-subtle hover:text-ink disabled:opacity-50"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  {signingOut ? "Signing out…" : "Sign out"}
                </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1280px] px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-white px-1 pb-[max(6px,env(safe-area-inset-bottom))] pt-1 lg:hidden"
        aria-label="Mobile navigation"
      >
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              href={href}
              key={href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-md py-2 text-[11px] font-semibold leading-4",
                active ? "text-primary" : "text-muted",
              )}
            >
              <Icon className="size-5" aria-hidden="true" />
              {label === "Mock Tests" ? "Tests" : label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
