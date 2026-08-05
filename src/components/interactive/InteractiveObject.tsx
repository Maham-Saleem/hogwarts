import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { InteractiveElement } from "@/types";

const ICONS: Record<string, string> = {
  candle: "🕯️", book: "📖", door: "🚪", painting: "🖼️", potion: "🧪",
  chest: "📦", rune: "✨", switch: "⚡", statue: "🗿", fireplace: "🔥",
  telescope: "🔭", cauldron: "🫕", scroll: "📜", mirror: "🪞",
};

export function InteractiveObject({ element, onInteract }: { element: InteractiveElement; onInteract: (el: InteractiveElement) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      className="absolute z-20 cursor-pointer group"
      style={{ left: `${element.position.x}%`, top: `${element.position.y}%` }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => onInteract(element)}
      whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: Math.random() * 0.5, duration: 0.4 }}
    >
      <div className="absolute -inset-4 rounded-full transition-all duration-500" style={{
        background: hovered
          ? "radial-gradient(circle, rgba(74,158,255,0.25), transparent 70%)"
          : "radial-gradient(circle, rgba(212,175,55,0.1), transparent 70%)",
      }} />
      <div className="relative text-2xl md:text-3xl drop-shadow-lg select-none">{ICONS[element.type] || "✨"}</div>
      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-body text-moonlight bg-surface/90 border border-gold/20 backdrop-blur-sm shadow-lg z-30">
            {element.name}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

export function InteractionModal({ element, onClose }: { element: InteractiveElement | null; onClose: () => void }) {
  if (!element) return null;
  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div className="relative max-w-md w-full border border-gold/20 rounded-xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }} transition={{ type: "spring", damping: 25 }}>
          {/* Header with icon */}
          <div className="bg-gradient-to-b from-surface-light to-surface px-6 pt-6 pb-4 border-b border-gold/10">
            <div className="text-4xl mb-2">{ICONS[element.type] || "✨"}</div>
            <h3 className="font-heading text-lg text-gold tracking-wider">{element.name}</h3>
          </div>
          {/* Body */}
          <div className="bg-surface px-6 py-5">
            <p className="font-display text-moonlight/70 text-sm leading-relaxed">{element.interaction}</p>
          </div>
          {/* Footer */}
          <div className="bg-gradient-to-t from-surface-light to-surface px-6 py-3 border-t border-gold/10 flex justify-end">
            <button onClick={onClose}
              className="px-4 py-1.5 bg-gradient-to-b from-wood-light/50 to-wood/50 border border-brass/30 rounded-lg text-parchment/80 text-xs font-heading tracking-wider hover:from-wood-polish/20 transition-all">
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
