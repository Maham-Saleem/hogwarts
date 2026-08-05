import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeMode = "dark" | "gold" | "wine" | "aurora";

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  reducedMotion: boolean;
  setReducedMotion: (v: boolean) => void;
  contentDensity: "comfortable" | "compact";
  setContentDensity: (d: "comfortable" | "compact") => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_CSS: Record<ThemeMode, string> = {
  dark: "",
  gold: "accent-gold",
  wine: "accent-wine",
  aurora: "accent-aurora",
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = window.localStorage.getItem("hogwarts.theme");
    return (saved as ThemeMode) || "dark";
  });
  const [reducedMotion, setReducedMotion] = useState(() => {
    const pref = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return pref;
  });
  const [contentDensity, setContentDensity] = useState<"comfortable" | "compact">("comfortable");

  useEffect(() => {
    window.localStorage.setItem("hogwarts.theme", mode);
    Object.values(THEME_CSS).filter(Boolean).forEach(cls => document.documentElement.classList.remove(cls));
    if (THEME_CSS[mode]) document.documentElement.classList.add(THEME_CSS[mode]);
  }, [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      setMode: setModeState,
      reducedMotion,
      setReducedMotion,
      contentDensity,
      setContentDensity,
    }),
    [mode, reducedMotion, contentDensity]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}