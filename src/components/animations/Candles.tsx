import { motion } from "framer-motion";
import { cn } from "@/utils";

interface CandlesProps {
  count?: number;
  className?: string;
}

function Candle({ delay, color }: { delay: number; color: string }) {
  const flicker = { duration: 1.6 + Math.random() * 1.4, delay, repeat: Infinity, ease: "easeInOut" as const };
  return (
    <div className="flex h-24 w-4 flex-col items-center justify-end">
      <motion.div
        className="h-6 w-3 rounded-t-full rounded-b-[3px]"
        style={{
          background: `radial-gradient(circle at 50% 20%, #FFE9A8, ${color} 60%, ${color} 100%)`,
          boxShadow: `0 0 18px ${color}, 0 0 36px ${color}88`,
        }}
        animate={{ opacity: [1, 0.6, 0.9, 0.5, 1] }}
        transition={flicker}
      />
      <div className="h-10 w-2 rounded-t-sm rounded-b-md bg-gradient-to-b from-beige-100 via-beige-200 to-ink-700" />
      <div className="h-1 w-6 rounded bg-ink-900" />
      <div className="h-4 w-5 rounded-b-lg bg-gradient-to-b from-gold-500 to-gold-600" />
    </div>
  );
}

export function Candles({ count = 5, className }: CandlesProps) {
  const colors = ["#D4AF37", "#E8A33D", "#F4C34C", "#C9972F", "#E8B54A"];
  return (
    <div className={cn("pointer-events-none flex items-end gap-3", className)} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <Candle key={i} delay={i * 0.4} color={colors[i % colors.length]} />
      ))}
    </div>
  );
}