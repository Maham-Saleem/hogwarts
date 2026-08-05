import { motion } from "framer-motion";

interface WoodenButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function WoodenButton({ children, onClick, className = "", variant = "primary", size = "md" }: WoodenButtonProps) {
  const sizes = { sm: "px-4 py-1.5 text-xs", md: "px-6 py-2.5 text-sm", lg: "px-8 py-3.5 text-base" };
  const variants = {
    primary: "bg-gradient-to-b from-wood-light to-wood border border-wood-polish/30 text-parchment shadow-wood hover:brightness-110",
    secondary: "bg-transparent border border-gold/20 text-gold/80 hover:border-gold/40 hover:text-gold",
    ghost: "bg-transparent text-moonlight/50 hover:text-moonlight/80",
  };
  return (
    <motion.button
      onClick={onClick}
      className={`relative font-heading tracking-[0.15em] rounded-lg transition-all duration-500 ${sizes[size]} ${variants[variant]} ${className}`}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="absolute inset-0 rounded-lg border border-brass/8 pointer-events-none" />
      <div className="absolute inset-0 rounded-lg bg-wood-grain opacity-20 pointer-events-none" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
