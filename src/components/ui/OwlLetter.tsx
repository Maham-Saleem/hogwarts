import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OwlLetterProps {
  from: string;
  subject: string;
  body: string;
  delay?: number;
}

export function OwlLetter({ from, subject, body, delay = 0 }: OwlLetterProps) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div className="relative cursor-pointer" onClick={() => setOpen(!open)}
      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 1, ease: "easeOut" }}>
      <div className="relative bg-gradient-to-br from-parchment/6 to-parchment/3 border border-parchment/10 rounded-lg p-4 hover:border-parchment/15 transition-all duration-700">
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-burgundy/80 to-burgundy-dark/80 flex items-center justify-center" style={{ boxShadow: "0 0 8px rgba(94,27,36,0.3)" }}>
          <span className="text-[7px] text-gold/60">✉</span>
        </div>
        <div className="flex items-start gap-3">
          <div className="text-lg opacity-50">🦉</div>
          <div className="flex-1 min-w-0">
            <div className="font-heading text-[10px] text-gold/60 tracking-wider">{from}</div>
            <div className="font-display text-xs text-parchment/60 mt-0.5 truncate">{subject}</div>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
              className="overflow-hidden mt-3 pt-3 border-t border-parchment/8">
              <p className="font-display text-xs text-moonlight/50 leading-relaxed">{body}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
