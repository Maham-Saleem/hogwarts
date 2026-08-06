import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { InteractiveElement } from "@/types";

interface ArtifactGalleryProps {
  artifacts: InteractiveElement[];
}

const ARTIFACT_META: Record<string, { glyph: string; color: string }> = {
  "ror-artifact-1": { glyph: "\u25C9", color: "rgba(212,175,55,0.28)" },
  "ror-artifact-2": { glyph: "\u25C7", color: "rgba(139,92,246,0.28)" },
  "ror-artifact-3": { glyph: "\u2299", color: "rgba(156,163,175,0.28)" },
};

// Enchanted portfolio: not cards, but artifacts floating above their pedestals.
// Touching one lets the room show you the story held inside it.
export function ArtifactGallery({ artifacts }: ArtifactGalleryProps) {
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<InteractiveElement | null>(null);

  const allTouched = artifacts.length > 0 && artifacts.every((a) => touched.has(a.id));

  const touch = (a: InteractiveElement) => {
    setTouched((prev) => new Set(prev).add(a.id));
    setActive(a);
  };

  return (
    <div className="relative w-full max-w-2xl aspect-[16/10] rounded-sm overflow-hidden mb-6"
      style={{
        background: "linear-gradient(160deg, rgba(28,24,44,0.5), rgba(20,18,30,0.55), rgba(14,13,11,0.6))",
        border: "1px solid rgba(139,92,246,0.12)",
        boxShadow: "inset 0 0 60px rgba(10,8,16,0.38)",
      }}
    >
      {/* floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[24%]" style={{
        background: "linear-gradient(0deg, rgba(12,10,18,0.5), transparent)",
      }} />

      {/* pedestals */}
      <div className="absolute inset-x-0 bottom-[10%] flex justify-around items-end px-4">
        {artifacts.map((a) => {
          const meta = ARTIFACT_META[a.id] ?? { glyph: "\u2726", color: "rgba(212,175,55,0.2)" };
          const isTouched = touched.has(a.id);
          return (
            <motion.button
              key={a.id}
              className="relative flex flex-col items-center cursor-pointer group"
              onClick={() => touch(a)}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
            >
              {/* pedestal */}
              <div className="w-14 sm:w-16 h-16 sm:h-20" style={{
                background: "linear-gradient(180deg, rgba(60,54,80,0.25), rgba(30,26,42,0.35))",
                border: "1px solid rgba(139,92,246,0.1)",
                clipPath: "polygon(8% 0, 92% 0, 100% 100%, 0 100%)",
              }} />

              {/* floating artifact */}
              <motion.div
                className="absolute -top-10 sm:-top-12 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle at 35% 30%, ${meta.color}, rgba(10,9,12,0.6))`,
                  border: `1px solid ${isTouched ? meta.color : "rgba(139,92,246,0.15)"}`,
                  boxShadow: `0 0 24px ${meta.color}, inset 0 0 12px rgba(255,255,255,0.03)`,
                }}
                animate={{ y: [0, -6, 0], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 5 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.08 }}
              >
                <span className="text-lg sm:text-xl select-none" style={{ color: "rgba(235,225,210,0.6)" }}>
                  {meta.glyph}
                </span>
              </motion.div>

              {/* touched mark */}
              <AnimatePresence>
                {isTouched && (
                  <motion.div
                    className="absolute -top-1 right-2 w-2 h-2 rounded-full"
                    style={{ backgroundColor: meta.color, boxShadow: `0 0 8px ${meta.color}` }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </AnimatePresence>

              {/* label */}
              <span className="mt-2 font-cinzel text-[8px] tracking-[0.15em] text-center"
                style={{ color: isTouched ? "rgba(212,175,55,0.5)" : "rgba(140,130,160,0.3)" }}>
                {a.name}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* active glimpse panel */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="absolute inset-x-0 top-[8%] mx-auto max-w-sm px-5 py-3 rounded text-center"
            style={{
              background: "linear-gradient(135deg, rgba(30,26,44,0.92), rgba(20,18,30,0.95))",
              border: "1px solid rgba(139,92,246,0.15)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
            }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-cinzel text-[10px] tracking-[0.2em] mb-1" style={{ color: "rgba(212,175,55,0.6)" }}>
              {active.name}
            </p>
            <p className="font-cormorant text-xs sm:text-sm leading-relaxed" style={{ color: "rgba(180,170,200,0.7)" }}>
              {active.interaction}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* final vision when all three touched */}
      <AnimatePresence>
        {allTouched && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20 px-6"
            style={{ background: "radial-gradient(circle at center, rgba(139,92,246,0.08), transparent 70%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <div className="text-center">
              <p className="font-cinzel text-sm sm:text-base tracking-[0.2em] mb-2" style={{ color: "rgba(212,175,55,0.7)" }}>
                THE CREATOR'S VISION
              </p>
              <p className="font-cormorant text-sm sm:text-base italic max-w-md mx-auto leading-relaxed" style={{ color: "rgba(190,180,215,0.8)" }}>
                Three artifacts, one story: the beginning, the architecture, and the path ahead.
                Every creation holds all three.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}