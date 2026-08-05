import { motion, AnimatePresence } from "framer-motion";

interface SecretRevealProps {
  name: string;
  description: string;
  onClose: () => void;
}

export function SecretReveal({ name, description, onClose }: SecretRevealProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/80" onClick={onClose} />
        <motion.div
          className="relative max-w-lg w-full text-center"
          initial={{ scale: 0.5, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0, y: 40 }}
          transition={{ type: "spring", damping: 20, delay: 0.1 }}
        >
          {/* Glow background */}
          <div className="absolute inset-0 -m-20 bg-radial-gold opacity-60" />

          {/* Sparkle burst */}
          <motion.div
            className="absolute inset-0 -m-10"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: [0, 1.5, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 w-1 h-1 bg-gold rounded-full"
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-60px)`,
                  boxShadow: "0 0 8px 2px rgba(212,175,55,0.6)",
                }}
              />
            ))}
          </motion.div>

          <div className="relative bg-surface/90 border border-gold/30 rounded-2xl p-8 backdrop-blur-xl shadow-glow">
            <motion.div
              className="text-5xl mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              🔓
            </motion.div>
            <motion.h2
              className="font-heading text-2xl text-gold mb-3 tracking-wider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Secret Discovered
            </motion.h2>
            <motion.h3
              className="font-display text-xl text-moonlight mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {name}
            </motion.h3>
            <motion.p
              className="font-display text-moonlight/70 leading-relaxed mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {description}
            </motion.p>
            <motion.button
              onClick={onClose}
              className="px-6 py-2.5 bg-gold/10 border border-gold/40 rounded-lg text-gold font-body text-sm hover:bg-gold/20 transition-all duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.05 }}
            >
              Continue Exploring
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
