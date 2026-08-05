import { motion } from "framer-motion";

interface ParchmentCardProps {
  children: React.ReactNode;
  className?: string;
}

export function ParchmentCard({ children, className = "" }: ParchmentCardProps) {
  return (
    <motion.div
      className={`relative rounded-sm overflow-hidden ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(232,220,196,0.04), rgba(232,220,196,0.02))",
        border: "1px solid rgba(139,105,20,0.08)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.3), inset 0 0 30px rgba(139,105,20,0.02)",
      }}
    >
      {/* Parchment texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.005) 2px, rgba(0,0,0,0.005) 3px)",
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
