import { motion, AnimatePresence } from "framer-motion";

interface SecretRevealProps {
  name: string;
  description: string;
  onClose: () => void;
}

export function SecretReveal({ name, description, onClose }: SecretRevealProps) {
  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
        <div className="absolute inset-0 bg-black/85" onClick={onClose} />
        <motion.div className="relative max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
          {/* Subtle radial glow */}
          <div className="absolute inset-0 -m-20 opacity-30" style={{
            background: "radial-gradient(circle, rgba(212,175,55,0.1), transparent 65%)",
          }} />
          <div className="relative bg-gradient-to-b from-surface via-surface to-surface-light border border-gold/15 rounded-xl p-8 shadow-glow">
            <motion.div className="w-10 h-10 mx-auto mb-4 rounded-full border border-gold/20 flex items-center justify-center"
              style={{ background: "radial-gradient(circle, rgba(212,175,55,0.08), transparent)" }}
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}>
              <div className="w-2 h-2 rounded-full bg-gold/60" />
            </motion.div>
            <motion.h2 className="font-heading text-sm text-gold/70 mb-2 tracking-[0.2em]"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>SECRET DISCOVERED</motion.h2>
            <motion.h3 className="font-display text-lg text-parchment/80 mb-3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}>{name}</motion.h3>
            <motion.p className="font-display text-moonlight/50 leading-relaxed mb-6 text-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}>{description}</motion.p>
            <motion.button onClick={onClose}
              className="px-6 py-2 bg-gradient-to-b from-wood-light/40 to-wood/40 border border-brass/25 rounded-lg text-parchment/70 font-heading text-[10px] tracking-[0.2em] hover:brightness-110 transition-all duration-500"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }}>CONTINUE</motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
