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
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-cormorant text-xs" style={{ color: "rgba(160,150,130,0.35)" }}>{label}</span>
          <span className="font-cinzel text-[10px]" style={{ color: "rgba(184,134,11,0.4)" }}>{value}/{max}</span>
        </div>
      )}
      <div
        className="relative h-1 rounded-full overflow-hidden"
        style={{
          background: "rgba(30,28,26,0.6)",
          border: "0.5px solid rgba(60,56,52,0.15)",
        }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${color}40, ${color}70)`,
            boxShadow: `0 0 8px ${color}15`,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
