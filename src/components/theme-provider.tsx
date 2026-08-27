"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "listenly-theme";
const ThemeContext = createContext<{
  preference: ThemePreference;
  setPreference: (theme: ThemePreference) => void;
}>({ preference: "system", setPreference: () => undefined });

function applyTheme(preference: ThemePreference) {
  const dark = preference === "dark" || (preference === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.theme = dark ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initial = saved === "light" || saved === "dark" ? saved : "system";
    const timer = window.setTimeout(() => setPreferenceState(initial), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    applyTheme(preference);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => applyTheme("system");
    if (preference !== "system") return;
    media.addEventListener("change", handleSystemChange);
    return () => media.removeEventListener("change", handleSystemChange);
  }, [preference]);

  function setPreference(theme: ThemePreference) {
    setPreferenceState(theme);
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
  }

  return <ThemeContext.Provider value={{ preference, setPreference }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
