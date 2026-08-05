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
        <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div className="relative max-w-lg w-full"
            initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
            <div className="h-3 bg-gradient-to-b from-wood-light/40 to-wood/25 rounded-t-xl border-b border-brass/12 flex items-center justify-center">
              <div className="w-14 h-0.5 bg-brass/20 rounded-full" />
            </div>
            <div className="bg-gradient-to-b from-parchment/8 via-parchment/5 to-parchment/7 border-x border-parchment/12 px-6 py-5">
              <div className="flex items-center justify-center mb-4">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-burgundy to-burgundy-dark flex items-center justify-center" style={{ boxShadow: "0 0 12px rgba(94,27,36,0.3)" }}>
                  <span className="text-[9px] text-gold/70 font-heading">✦</span>
                </div>
              </div>
              <h3 className="font-heading text-base text-gold/80 text-center tracking-[0.15em] mb-4">{title}</h3>
              <div className="font-display text-moonlight/60 leading-relaxed text-sm">{children}</div>
            </div>
            <div className="h-3 bg-gradient-to-t from-wood-light/40 to-wood/25 rounded-b-xl border-t border-brass/12" />
            <button onClick={onClose} className="absolute top-5 right-4 text-moonlight/30 hover:text-moonlight/60 transition-colors duration-500 text-sm">✕</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
