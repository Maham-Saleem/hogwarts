import { motion } from "framer-motion";

interface ParchmentCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function ParchmentCard({ children, className = "", onClick }: ParchmentCardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={`relative rounded-lg overflow-hidden ${onClick ? "cursor-pointer" : ""} ${className}`}
      whileHover={onClick ? { scale: 1.02, y: -3 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {/* Parchment background */}
      <div className="absolute inset-0 bg-gradient-to-br from-parchment/8 via-parchment/4 to-parchment/6 border border-parchment/10 rounded-lg" />
      {/* Aged texture */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")` }} />
      {/* Content */}
      <div className="relative z-10 p-5">{children}</div>
    </motion.div>
  );
}
