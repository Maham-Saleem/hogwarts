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
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2 }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(14,13,11,0.92)" }} onClick={onClose} />
        <motion.div
          className="relative max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtle radial glow */}
          <div
            className="absolute inset-0 -m-20 opacity-30"
            style={{ background: "radial-gradient(circle, rgba(212,175,55,0.06), transparent 65%)" }}
          />
          <div
            className="relative rounded-sm p-8"
            style={{
              background: "linear-gradient(135deg, rgba(42,38,36,0.6), rgba(30,28,26,0.8))",
              border: "1px solid rgba(90,85,80,0.15)",
              boxShadow: "0 4px 32px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.2)",
            }}
          >
            <motion.div
              className="w-10 h-10 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                border: "1px solid rgba(184,134,11,0.15)",
                background: "radial-gradient(circle, rgba(212,175,55,0.04), transparent)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "rgba(212,175,55,0.3)" }} />
            </motion.div>
            <motion.h2
              className="font-cinzel text-xs mb-2 tracking-[0.2em]"
              style={{ color: "rgba(184,134,11,0.4)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              SECRET DISCOVERED
            </motion.h2>
            <motion.h3
              className="font-cormorant text-lg mb-3"
              style={{ color: "rgba(232,220,196,0.6)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
            >
              {name}
            </motion.h3>
            <motion.p
              className="font-cormorant text-sm leading-relaxed mb-6"
              style={{ color: "rgba(160,150,130,0.4)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
            >
              {description}
            </motion.p>
            <motion.button
              onClick={onClose}
              className="px-6 py-2 rounded-sm cursor-pointer transition-all duration-500"
              style={{
                background: "linear-gradient(180deg, rgba(61,43,31,0.25), rgba(42,29,20,0.35))",
                border: "1px solid rgba(139,105,20,0.12)",
                color: "rgba(212,195,160,0.5)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 1 }}
            >
              <span className="font-cinzel text-[10px] tracking-[0.2em]">CONTINUE</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
