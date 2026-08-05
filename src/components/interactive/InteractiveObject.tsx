import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { InteractiveElement } from "@/types";

interface InteractiveObjectProps {
  element: InteractiveElement;
  onInteract: (element: InteractiveElement) => void;
  discovered: boolean;
}

const ICONS: Record<string, string> = {
  candle: "🕯️",
  book: "📖",
  door: "🚪",
  painting: "🖼️",
  potion: "🧪",
  chest: "📦",
  rune: "✨",
  switch: "⚡",
  statue: "🗿",
  fireplace: "🔥",
  telescope: "🔭",
  cauldron: "🫕",
};

export function InteractiveObject({ element, onInteract, discovered }: InteractiveObjectProps) {
  const [hovered, setHovered] = useState(false);

  const handleClick = useCallback(() => {
    onInteract(element);
  }, [element, onInteract]);

  return (
    <motion.button
      className="absolute z-20 cursor-pointer group"
      style={{ left: `${element.position.x}%`, top: `${element.position.y}%` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.random() * 0.5, duration: 0.4 }}
    >
      {/* Glow ring */}
      <div
        className="absolute -inset-3 rounded-full transition-all duration-500"
        style={{
          background: discovered
            ? "radial-gradient(circle, rgba(212,175,55,0.3), transparent 70%)"
            : hovered
            ? "radial-gradient(circle, rgba(74,158,255,0.25), transparent 70%)"
            : "radial-gradient(circle, rgba(212,175,55,0.08), transparent 70%)",
          animation: discovered ? "pulseGlow 3s ease-in-out infinite" : undefined,
        }}
      />

      {/* Icon */}
      <div className="relative text-2xl md:text-3xl filter drop-shadow-lg select-none">
        {ICONS[element.type] || "✨"}
      </div>

      {/* Name tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-body text-moonlight bg-surface/90 border border-gold/20 backdrop-blur-sm shadow-lg"
          >
            {element.name}
            {discovered && (
              <span className="ml-2 text-gold">✓</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

interface InteractionModalProps {
  element: InteractiveElement | null;
  onClose: () => void;
}

export function InteractionModal({ element, onClose }: InteractionModalProps) {
  if (!element) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          className="relative max-w-md w-full bg-surface border border-gold/20 rounded-xl p-6 shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
        >
          <div className="text-4xl mb-3">{ICONS[element.type] || "✨"}</div>
          <h3 className="font-heading text-lg text-gold mb-2">{element.name}</h3>
          <p className="font-display text-moonlight/80 text-sm mb-4 leading-relaxed">
            {element.interaction}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gold/10 border border-gold/30 rounded-lg text-gold text-sm font-body hover:bg-gold/20 transition-colors"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
