import { motion, AnimatePresence } from "framer-motion";

interface ScrollDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function ScrollDialog({ open, onClose, title, children }: ScrollDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative max-w-lg w-full"
            initial={{ scale: 0.3, rotateX: 60, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, opacity: 1 }}
            exit={{ scale: 0.3, rotateX: 60, opacity: 0 }}
            transition={{ type: "spring", damping: 22, delay: 0.05 }}
          >
            {/* Scroll top */}
            <div className="h-4 bg-gradient-to-b from-wood-light/60 to-wood/40 rounded-t-xl border-b border-brass/20 flex items-center justify-center">
              <div className="w-16 h-1 bg-brass/30 rounded-full" />
            </div>
            {/* Scroll body */}
            <div className="bg-gradient-to-b from-parchment/10 via-parchment/6 to-parchment/8 border-x border-parchment/15 px-6 py-5">
              {/* Wax seal title */}
              <div className="flex items-center justify-center mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-burgundy to-burgundy-dark flex items-center justify-center shadow-glow-fire">
                  <span className="text-xs text-gold font-heading">✦</span>
                </div>
              </div>
              <h3 className="font-heading text-lg text-gold text-center tracking-[0.15em] mb-4">{title}</h3>
              <div className="font-display text-moonlight/70 leading-relaxed">{children}</div>
            </div>
            {/* Scroll bottom */}
            <div className="h-4 bg-gradient-to-t from-wood-light/60 to-wood/40 rounded-b-xl border-t border-brass/20" />
            {/* Close */}
            <button onClick={onClose} className="absolute top-6 right-4 text-moonlight/40 hover:text-gold transition-colors text-sm">✕</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
