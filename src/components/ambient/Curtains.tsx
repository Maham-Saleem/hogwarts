import { motion } from "framer-motion";

export function Curtains() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Left curtain */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-[3%]"
        style={{
          background: "linear-gradient(90deg, rgba(94,27,36,0.06), transparent)",
        }}
        animate={{
          skewY: [0, 0.3, 0, -0.2, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Right curtain */}
      <motion.div
        className="absolute right-0 top-0 bottom-0 w-[3%]"
        style={{
          background: "linear-gradient(270deg, rgba(94,27,36,0.06), transparent)",
        }}
        animate={{
          skewY: [0, -0.3, 0, 0.2, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
    </div>
  );
}
