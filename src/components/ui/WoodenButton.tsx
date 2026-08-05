import { motion } from "framer-motion";

interface WoodenButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function WoodenButton({ children, onClick, className = "" }: WoodenButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-5 py-2.5 rounded cursor-pointer group ${className}`}
      style={{
        background: "linear-gradient(180deg, #3D2B1F 0%, #2A1D14 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.4)",
        border: "1px solid rgba(90,60,40,0.15)",
      }}
      whileHover={{
        background: "linear-gradient(180deg, #4A3525 0%, #332218 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.5)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4 }}
    >
      {/* Wood grain texture overlay */}
      <div
        className="absolute inset-0 rounded pointer-events-none opacity-30"
        style={{
          backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 2px, rgba(0,0,0,0.025) 2px, rgba(0,0,0,0.025) 4px)",
        }}
      />
      <span className="relative font-cinzel text-xs tracking-wider" style={{ color: "rgba(212,195,160,0.5)" }}>
        {children}
      </span>
    </motion.button>
  );
}
