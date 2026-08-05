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
      <div
        className="relative rounded-sm overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(61,43,31,0.5), rgba(42,29,20,0.7))",
          boxShadow: "0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
          border: "1px solid rgba(90,60,40,0.12)",
        }}
      >
        {/* Spine accent */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ background: `linear-gradient(180deg, ${color}20, ${color}08)` }}
        />
        {/* Wood grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "repeating-linear-gradient(87deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)",
          }}
        />
        <div className="relative pl-4 pr-4 py-4">
          <h4 className="font-cinzel text-xs tracking-wider" style={{ color: `${color}99` }}>{title}</h4>
          {author && (
            <p className="font-cormorant text-[10px] mt-0.5" style={{ color: "rgba(160,150,130,0.25)" }}>
              by {author}
            </p>
          )}
          <div className="font-cormorant text-xs mt-2 leading-relaxed" style={{ color: "rgba(160,150,130,0.35)" }}>
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
