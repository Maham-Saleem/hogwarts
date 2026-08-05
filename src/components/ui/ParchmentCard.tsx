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
      whileHover={onClick ? { y: -2 } : undefined}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-parchment/6 via-parchment/3 to-parchment/5 border border-parchment/8 rounded-lg" />
      <div className="relative z-10 p-5">{children}</div>
    </motion.div>
  );
}
