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
    <motion.div
      className="relative cursor-pointer"
      initial={{ opacity: 0, y: -20, rotate: -3 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay, duration: 0.6, type: "spring" }}
      onClick={() => setOpen(!open)}
    >
      <div className="relative bg-gradient-to-br from-parchment/10 to-parchment/5 border border-parchment/15 rounded-lg p-4 hover:border-gold/20 transition-all">
        {/* Wax seal */}
        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-burgundy to-burgundy-dark flex items-center justify-center shadow-lg">
          <span className="text-[8px] text-gold font-heading">✉</span>
        </div>
        <div className="flex items-start gap-3">
          <div className="text-xl">🦉</div>
          <div className="flex-1 min-w-0">
            <div className="font-heading text-xs text-gold/80 tracking-wider">{from}</div>
            <div className="font-display text-sm text-parchment/70 mt-0.5 truncate">{subject}</div>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-3 pt-3 border-t border-parchment/10"
            >
              <p className="font-display text-sm text-moonlight/60 leading-relaxed">{body}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
