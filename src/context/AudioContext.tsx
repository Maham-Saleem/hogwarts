import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface AudioContextValue {
  muted: boolean;
  toggleMute: () => void;
  playAmbient: (type: string) => void;
  stopAmbient: () => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(() => {
    return localStorage.getItem("hogwarts.audio-muted") === "true";
  });

  useEffect(() => {
    localStorage.setItem("hogwarts.audio-muted", String(muted));
  }, [muted]);

  const toggleMute = () => setMuted((m) => !m);
  const playAmbient = (_type: string) => {};
  const stopAmbient = () => {};

  return (
    <AudioCtx.Provider value={{ muted, toggleMute, playAmbient, stopAmbient }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
