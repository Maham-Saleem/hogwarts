import type { ReactNode } from "react";
import { cn } from "@/utils";

type Tone = "gold" | "wine" | "emerald" | "silver" | "neutral" | "beige";

const TONES: Record<Tone, string> = {
  gold: "border-gold/40 bg-gold/10 text-gold-200",
  wine: "border-wine-300/40 bg-wine-300/10 text-wine-300",
  emerald: "border-emerald2-200/40 bg-emerald2-200/10 text-emerald2-200",
  silver: "border-silver-400/30 bg-silver-400/10 text-silver-300",
  neutral: "border-silver/20 bg-ink-700 text-beige-200",
  beige: "border-beige-200/30 bg-beige-200/10 text-beige-200",
};

export function Badge({ children, tone = "gold", className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide", TONES[tone], className)}>
      {children}
    </span>
  );
}