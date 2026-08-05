import { motion } from "framer-motion";

interface EnergyBarProps {
  value: number;
  max: number;
  color?: string;
  label?: string;
}

export function EnergyBar({ value, max, color = "#D4AF37", label }: EnergyBarProps) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full">
      {label && <div className="flex items-center justify-between mb-1.5">
        <span className="font-display text-xs text-moonlight/40">{label}</span>
        <span className="font-heading text-[10px] text-gold/60">{value}/{max}</span>
      </div>}
      <div className="relative h-1.5 bg-abyss-light rounded-full overflow-hidden border border-white/[0.03]">
        <motion.div className="absolute inset-y-0 left-0 rounded-full" style={{
          background: `linear-gradient(90deg, ${color}60, ${color}90)`,
          boxShadow: `0 0 8px ${color}20`,
        }} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.5, ease: "easeOut" }} />
      </div>
    </div>
  );
}
