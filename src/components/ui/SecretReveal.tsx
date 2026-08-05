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
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/85" onClick={onClose} />
        <motion.div className="relative max-w-lg w-full text-center"
          initial={{ scale: 0.4, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.4, opacity: 0 }} transition={{ type: "spring", damping: 20, delay: 0.1 }}>
          {/* Glow */}
          <div className="absolute inset-0 -m-24 bg-radial-gold opacity-50" />
          {/* Sparkle burst */}
          <motion.div className="absolute inset-0 -m-12"
            initial={{ scale: 0, rotate: 0 }} animate={{ scale: [0, 1.5, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 0.8, delay: 0.2 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="absolute left-1/2 top-1/2 w-1.5 h-1.5 bg-gold rounded-full"
                style={{ transform: `rotate(${i * 36}deg) translateY(-70px)`, boxShadow: "0 0 10px 3px rgba(212,175,55,0.5)" }} />
            ))}
          </motion.div>
          {/* Card */}
          <div className="relative bg-gradient-to-b from-surface via-surface to-surface-light border border-gold/25 rounded-2xl p-8 shadow-glow-lg">
            <motion.div className="text-5xl mb-4" initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ delay: 0.3, duration: 0.4 }}>🔓</motion.div>
            <motion.h2 className="font-heading text-xl text-gold mb-2 tracking-[0.15em]"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>SECRET DISCOVERED</motion.h2>
            <motion.h3 className="font-display text-lg text-parchment mb-3"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>{name}</motion.h3>
            <motion.p className="font-display text-moonlight/60 leading-relaxed mb-6 text-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>{description}</motion.p>
            <motion.button onClick={onClose}
              className="px-6 py-2.5 bg-gradient-to-b from-wood-light to-wood border border-brass/40 rounded-lg text-parchment font-heading text-xs tracking-[0.15em] hover:from-wood-polish/30 transition-all"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>CONTINUE EXPLORING</motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
