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
        <span className="font-display text-xs text-moonlight/50">{label}</span>
        <span className="font-heading text-xs text-gold/80">{value}/{max}</span>
      </div>}
      <div className="relative h-2.5 bg-abyss-light rounded-full overflow-hidden border border-white/5">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}80, ${color})`,
            boxShadow: `0 0 12px ${color}40, inset 0 1px 0 rgba(255,255,255,0.15)`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        {/* Shimmer */}
        <div className="absolute inset-0 animate-shimmer rounded-full" style={{
          backgroundImage: `linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)`,
          backgroundSize: "200% 100%",
        }} />
      </div>
    </div>
  );
}
