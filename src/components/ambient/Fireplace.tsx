import { motion } from "framer-motion";

export function Fireplace() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Warm glow from fireplace */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%]"
        style={{
          background: "radial-gradient(ellipse at 50% 100%, rgba(255,143,0,0.06), transparent 70%)",
        }}
        animate={{
          opacity: [0.6, 0.8, 0.5, 0.7, 0.6],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Ember glow on nearby surfaces */}
      <motion.div
        className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[40%] h-[15%] rounded-full blur-2xl"
        style={{ backgroundColor: "rgba(255,109,0,0.03)" }}
        animate={{
          opacity: [0.4, 0.6, 0.3, 0.5, 0.4],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </div>
  );
}
