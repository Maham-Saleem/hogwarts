import { motion, AnimatePresence } from "framer-motion";
import type { TransitionType } from "@/types";

interface CinematicTransitionProps {
  show: boolean;
  type: TransitionType;
  onComplete: () => void;
}

const overlayByType: Record<TransitionType, string> = {
  door: "rgba(61,43,31,0.95)",
  stairs: "rgba(9,11,16,0.95)",
  corridor: "rgba(9,11,16,0.9)",
  fade: "rgba(9,11,16,0.85)",
  parchment: "rgba(232,220,196,0.95)",
};

const clipPaths: Record<TransitionType, { initial: string; animate: string; exit: string }> = {
  door: { initial: "inset(0 50% 0 50%)", animate: "inset(0 0 0 0)", exit: "inset(0 50% 0 50%)" },
  stairs: { initial: "inset(100% 0 0 0)", animate: "inset(0 0 0 0)", exit: "inset(0 0 100% 0)" },
  corridor: { initial: "inset(0 0 0 0)", animate: "inset(0 0 0 0)", exit: "inset(0 0 0 0)" },
  fade: { initial: "inset(0 0 0 0)", animate: "inset(0 0 0 0)", exit: "inset(0 0 0 0)" },
  parchment: { initial: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)", animate: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", exit: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)" },
};

const durations: Record<TransitionType, number> = {
  door: 1.4, stairs: 1.6, corridor: 1.0, fade: 0.8, parchment: 1.8,
};

export function CinematicTransition({ show, type, onComplete }: CinematicTransitionProps) {
  const overlayColor = overlayByType[type];
  const cp = clipPaths[type];
  const duration = durations[type];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-auto"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onAnimationComplete={onComplete}
        >
          {/* Background overlay */}
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: overlayColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration * 0.3 }}
          />

          {/* Transition mask */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundColor: "#090B10",
              clipPath: cp.initial,
            }}
            animate={{ clipPath: cp.animate }}
            exit={{ clipPath: cp.exit }}
            transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Subtle particles during transition */}
          <motion.div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration * 0.6, delay: duration * 0.2 }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: 2 + Math.random() * 3,
                  height: 2 + Math.random() * 3,
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                  backgroundColor: type === "parchment" ? "#D4AF37" : "rgba(212,175,55,0.6)",
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [0, 1.2, 0],
                  y: [0, -20 - Math.random() * 30],
                }}
                transition={{
                  duration: 1.5 + Math.random(),
                  delay: i * 0.08,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
