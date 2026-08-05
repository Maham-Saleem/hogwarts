import { motion } from "framer-motion";

interface EnchantedBookProps {
  title: string;
  author?: string;
  children: React.ReactNode;
  color?: string;
}

export function EnchantedBook({ title, author, children, color = "#D4AF37" }: EnchantedBookProps) {
  return (
    <motion.div className="group" whileHover={{ y: -1 }} transition={{ duration: 0.5 }}>
      <div className="relative bg-gradient-to-br from-wood/60 to-wood-dark/80 border border-wood-polish/12 rounded-lg overflow-hidden" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
        <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: `linear-gradient(180deg, ${color}25, ${color}10)` }} />
        <div className="pl-4 pr-4 py-4">
          <h4 className="font-heading text-xs tracking-wider" style={{ color: `${color}CC` }}>{title}</h4>
          {author && <p className="font-display text-[10px] text-moonlight/30 mt-0.5">by {author}</p>}
          <div className="font-display text-xs text-moonlight/45 mt-2 leading-relaxed">{children}</div>
        </div>
      </div>
    </motion.div>
  );
}
