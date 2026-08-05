import { motion } from "framer-motion";

export function MovingStairs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[20%]"
        style={{
          background: "linear-gradient(0deg, rgba(0,0,0,0.3), transparent)",
        }}
        animate={{
          x: [0, 3, 0, -2, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
