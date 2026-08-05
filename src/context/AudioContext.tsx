import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface AudioContextValue {
  muted: boolean;
  toggleMute: () => void;
}

const Ctx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(() => localStorage.getItem("hogwarts.audio") === "true");
  useEffect(() => { localStorage.setItem("hogwarts.audio", String(muted)); }, [muted]);
  return (
    <Ctx.Provider value={{ muted, toggleMute: () => setMuted((m) => !m) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
