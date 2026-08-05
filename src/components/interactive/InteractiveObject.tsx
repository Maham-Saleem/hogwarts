import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { InteractiveElement } from "@/types";

const ICONS: Record<string, string> = {
  candle: "◉", book: "▬", door: "▐", painting: "□", potion: "◎",
  chest: "▣", rune: "✦", switch: "⚡", statue: "△", fireplace: "◈",
  telescope: "⊙", cauldron: "○", scroll: "▭", mirror: "◇",
};

export function InteractiveObject({ element, onInteract }: { element: InteractiveElement; onInteract: (el: InteractiveElement) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      className="absolute z-20 cursor-pointer group"
      style={{ left: `${element.position.x}%`, top: `${element.position.y}%` }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onClick={() => onInteract(element)}
      whileHover={{ scale: 1.1 }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: Math.random() * 0.8, duration: 1, ease: "easeOut" }}>
      {/* Soft glow ring */}
      <div className="absolute -inset-3 rounded-full transition-all duration-1000" style={{
        background: hovered
          ? "radial-gradient(circle, rgba(74,158,255,0.12), transparent 70%)"
          : "radial-gradient(circle, rgba(212,175,55,0.05), transparent 70%)",
      }} />
      {/* Symbol */}
      <div className="relative text-lg md:text-xl select-none" style={{
        color: hovered ? "rgba(74,158,255,0.6)" : "rgba(212,175,55,0.35)",
        textShadow: hovered ? "0 0 12px rgba(74,158,255,0.3)" : "0 0 8px rgba(212,175,55,0.15)",
        transition: "all 0.8s ease",
      }}>{ICONS[element.type] || "✦"}</div>
      <AnimatePresence>
        {hovered && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.4 }}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 whitespace-nowrap px-2.5 py-1 rounded text-[10px] font-body text-moonlight/60 bg-surface/85 border border-gold/10 backdrop-blur-sm shadow-lg z-30">
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
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div className="relative max-w-md w-full rounded-xl overflow-hidden shadow-2xl"
          style={{ border: "1px solid rgba(212,175,55,0.1)" }}
          initial={{ opacity: 0, y: 15, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
          <div className="bg-gradient-to-b from-surface-light to-surface px-6 pt-5 pb-3 border-b border-gold/8">
            <div className="text-2xl mb-1 opacity-40" style={{ color: "rgba(212,175,55,0.5)" }}>{ICONS[element.type] || "✦"}</div>
            <h3 className="font-heading text-sm text-gold/80 tracking-wider">{element.name}</h3>
          </div>
          <div className="bg-surface px-6 py-4">
            <p className="font-display text-moonlight/55 text-sm leading-relaxed">{element.interaction}</p>
          </div>
          <div className="bg-gradient-to-t from-surface-light to-surface px-6 py-3 border-t border-gold/8 flex justify-end">
            <button onClick={onClose}
              className="px-4 py-1.5 bg-gradient-to-b from-wood-light/30 to-wood/30 border border-brass/20 rounded text-parchment/60 text-[10px] font-heading tracking-wider hover:brightness-110 transition-all duration-500">
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
