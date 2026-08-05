import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { StudentProfile } from "@/types";
import { studentProfile } from "@/data/mock";

interface AuthContextValue {
  user: StudentProfile;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
  updateProfile: (patch: Partial<StudentProfile>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean>(() => {
    return window.localStorage.getItem("hogwarts.auth") === "true";
  });
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const stored = window.localStorage.getItem("hogwarts.profile");
      return stored ? (JSON.parse(stored) as StudentProfile) : studentProfile;
    } catch {
      return studentProfile;
    }
  });

  const login = useCallback(async (email: string) => {
    // simulate a brief magical handshake delay
    await new Promise((r) => setTimeout(r, 1400));
    window.localStorage.setItem("hogwarts.auth", "true");
    window.localStorage.setItem("hogwarts.email", email);
    setAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.setItem("hogwarts.auth", "false");
    setAuthenticated(false);
  }, []);

  const updateProfile = useCallback((patch: Partial<StudentProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      window.localStorage.setItem("hogwarts.profile", JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: profile,
      isAuthenticated: authenticated,
      login,
      logout,
      updateProfile,
    }),
    [profile, authenticated, login, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}