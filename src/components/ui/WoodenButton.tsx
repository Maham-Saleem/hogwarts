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
    primary: "bg-gradient-to-b from-wood-light to-wood border border-wood-polish/40 text-parchment shadow-wood hover:from-wood-polish/30 hover:to-wood-light",
    secondary: "bg-transparent border border-gold/30 text-gold hover:bg-gold/10",
    ghost: "bg-transparent text-moonlight/60 hover:text-gold hover:bg-gold/5",
  };
  return (
    <motion.button
      onClick={onClick}
      className={`relative font-heading tracking-[0.15em] rounded-lg transition-all duration-300 ${sizes[size]} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
    >
      {/* Brass trim */}
      <div className="absolute inset-0 rounded-lg border border-brass/10 pointer-events-none" />
      {/* Wood grain overlay */}
      <div className="absolute inset-0 rounded-lg bg-wood-grain opacity-30 pointer-events-none" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
