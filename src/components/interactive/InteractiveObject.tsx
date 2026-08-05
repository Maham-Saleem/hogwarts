import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { InteractiveElement } from "@/types";

const SYMBOLS: Record<string, string> = {
  candle: "\u25C9", book: "\u25AC", door: "\u258E", painting: "\u25A1",
  potion: "\u25CE", chest: "\u25A3", rune: "\u2726", switch: "\u26A1",
  statue: "\u25B3", fireplace: "\u25C8", telescope: "\u2299", cauldron: "\u25CB",
  scroll: "\u25AD", mirror: "\u25C7", gargoyle: "\u2694", chandelier: "\u2726",
};

interface InteractiveObjectProps {
  element: InteractiveElement;
  onInteract: (el: InteractiveElement) => void;
}

export function InteractiveObject({ element, onInteract }: InteractiveObjectProps) {
  const [hovered, setHovered] = useState(false);
  const [activated, setActivated] = useState(false);

  const handleClick = () => {
    setActivated(true);
    onInteract(element);
    setTimeout(() => setActivated(false), 2000);
  };

  return (
    <motion.button
      className="absolute z-20 cursor-pointer group"
      style={{
        left: `${element.position.x}%`,
        top: `${element.position.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 + Math.random() * 0.8, duration: 1.5, ease: "easeOut" }}
    >
      {/* Material base - looks like a carved stone/wood marker */}
      <div
        className="relative w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center transition-all duration-1000"
        style={{
          background: hovered
            ? "linear-gradient(135deg, rgba(60,56,52,0.3), rgba(42,38,36,0.4))"
            : "linear-gradient(135deg, rgba(50,46,42,0.15), rgba(35,32,30,0.2))",
          boxShadow: hovered
            ? "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 -1px 0 rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.4)"
            : "inset 0 1px 0 rgba(255,255,255,0.02), inset 0 -1px 0 rgba(0,0,0,0.2)",
          border: `1px solid ${hovered ? "rgba(90,85,80,0.2)" : "rgba(60,56,52,0.1)"}`,
        }}
      >
        {/* Engraved symbol */}
        <span
          className="text-sm sm:text-base select-none transition-all duration-1000"
          style={{
            color: hovered ? "rgba(180,160,120,0.4)" : "rgba(120,110,90,0.2)",
            textShadow: hovered
              ? "0 1px 2px rgba(0,0,0,0.5), 0 0 6px rgba(212,175,55,0.06)"
              : "0 1px 1px rgba(0,0,0,0.3)",
          }}
        >
          {SYMBOLS[element.type] || "\u2726"}
        </span>

        {/* Activated glow */}
        {activated && (
          <motion.div
            className="absolute inset-0 rounded"
            style={{
              background: "radial-gradient(circle, rgba(212,175,55,0.08), transparent 70%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.08, 0] }}
            transition={{ duration: 2 }}
          />
        )}
      </div>

      {/* Hover tooltip - appears as carved text on stone */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap z-30 pointer-events-none"
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 3 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="px-3 py-1.5 rounded"
              style={{
                background: "linear-gradient(135deg, rgba(35,32,30,0.9), rgba(25,23,21,0.95))",
                border: "1px solid rgba(60,56,52,0.15)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
              }}
            >
              <p
                className="font-cormorant text-[10px] sm:text-xs"
                style={{
                  color: "rgba(160,150,130,0.5)",
                  textShadow: "0 1px 1px rgba(0,0,0,0.3)",
                }}
              >
                {element.name}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
