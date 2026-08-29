"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "listenly-theme";
const ThemeContext = createContext<{
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (theme: ThemePreference) => void;
}>({
  preference: "system",
  resolvedTheme: "light",
  setPreference: () => undefined,
});

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: ResolvedTheme) {
  document.documentElement.dataset.theme = theme;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>("light");
  const resolvedTheme = preference === "system" ? systemTheme : preference;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initial = saved === "light" || saved === "dark" ? saved : "system";
    const timer = window.setTimeout(() => {
      const currentSystemTheme = getSystemTheme();
      setPreferenceState(initial);
      setSystemTheme(currentSystemTheme);
      applyTheme(initial === "system" ? currentSystemTheme : initial);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    applyTheme(resolvedTheme);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => setSystemTheme(getSystemTheme());
    if (preference !== "system") return;
    media.addEventListener("change", handleSystemChange);
    return () => media.removeEventListener("change", handleSystemChange);
  }, [preference, resolvedTheme]);

  function setPreference(theme: ThemePreference) {
    const nextTheme = theme === "system" ? getSystemTheme() : theme;
    setPreferenceState(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(nextTheme);
  }

  return (
    <ThemeContext.Provider value={{ preference, resolvedTheme, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
