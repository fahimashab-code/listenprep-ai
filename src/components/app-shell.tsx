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
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brand } from "@/components/brand";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/tests", label: "Mock Tests", icon: ClipboardList },
  { href: "/practice", label: "Practice", icon: BookOpenCheck },
  { href: "/progress", label: "Progress", icon: BarChart3 },
  { href: "/history", label: "History", icon: History },
];

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tests": "Mock Tests",
  "/practice": "Practice",
  "/progress": "Progress",
  "/history": "History",
  "/profile": "Profile",
  "/generate": "Custom Practice",
};

function NavLink({
  href,
  label,
  icon: Icon,
  pathname,
  onClick,
}: {
  href: string;
  label: string;
  icon: typeof Home;
  pathname: string;
  onClick?: () => void;
}) {
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold",
        active
          ? "bg-primary-soft text-primary"
          : "text-muted hover:bg-[#f0f3f1] hover:text-ink",
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="size-[18px]" aria-hidden="true" />
      {label}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const rootPath = `/${pathname.split("/")[1]}`;
  const title =
    titles[rootPath] ??
    (pathname.includes("/practice/") ? "Focused Practice" : "Listenly");

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r bg-white px-4 py-6 lg:flex lg:flex-col">
        <Brand href="/dashboard" className="px-2" />
        <nav className="mt-9 space-y-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} pathname={pathname} />
          ))}
        </nav>

        <div className="mt-auto space-y-1 border-t pt-4">
          <NavLink
            href="/profile"
            label="Profile"
            icon={UserRound}
            pathname={pathname}
          />
          <NavLink
            href="/"
            label="Sign out"
            icon={LogOut}
            pathname={pathname}
          />
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
                className="grid size-10 place-items-center rounded-lg hover:bg-gray-100"
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
          </aside>
        </div>
      )}

      <div className="lg:pl-[248px]">
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
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary sm:flex">
              Target band 8.0
            </div>
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-gray-100"
            >
              <span className="grid size-8 place-items-center rounded-full bg-[#dff1e4] text-sm font-bold text-primary">
                A
              </span>
              <span className="hidden text-sm font-semibold md:inline">Alex</span>
              <ChevronDown className="hidden size-4 text-gray-500 md:inline" />
            </Link>
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
