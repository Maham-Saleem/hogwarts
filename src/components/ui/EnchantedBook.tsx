import { motion } from "framer-motion";

interface EnchantedBookProps {
  title: string;
  author?: string;
  children: React.ReactNode;
  color?: string;
}

export function EnchantedBook({ title, author, children, color = "#D4AF37" }: EnchantedBookProps) {
  return (
    <motion.div className="group cursor-pointer" whileHover={{ scale: 1.02, y: -3 }}>
      <div className="relative bg-gradient-to-br from-wood/80 to-wood-dark border border-wood-polish/20 rounded-lg overflow-hidden shadow-wood">
        {/* Book spine */}
        <div className="absolute left-0 top-0 bottom-0 w-2" style={{ background: `linear-gradient(180deg, ${color}40, ${color}20)` }} />
        {/* Content */}
        <div className="pl-5 pr-4 py-4">
          <h4 className="font-heading text-sm tracking-wider" style={{ color }}>{title}</h4>
          {author && <p className="font-display text-xs text-moonlight/40 mt-1">by {author}</p>}
          <div className="font-display text-sm text-moonlight/60 mt-2 leading-relaxed">{children}</div>
        </div>
        {/* Glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 50%, ${color}08, transparent 70%)` }} />
      </div>
    </motion.div>
  );
}
