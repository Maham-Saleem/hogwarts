import { motion } from "framer-motion";

export function Lightning() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(180,190,210,0.04), transparent 60%)",
        }}
        animate={{
          opacity: [0, 0, 0, 0.08, 0, 0.04, 0, 0, 0, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
