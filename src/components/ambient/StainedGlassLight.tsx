import { motion } from "framer-motion";

export function StainedGlassLight() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Warm gold light spill from windows */}
      <motion.div
        className="absolute top-0 left-[20%] w-[25%] h-[60%]"
        style={{
          background: "linear-gradient(180deg, rgba(212,175,55,0.03) 0%, transparent 100%)",
          clipPath: "polygon(30% 0%, 70% 0%, 90% 100%, 10% 100%)",
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-0 left-[55%] w-[25%] h-[60%]"
        style={{
          background: "linear-gradient(180deg, rgba(94,27,36,0.02) 0%, transparent 100%)",
          clipPath: "polygon(30% 0%, 70% 0%, 85% 100%, 15% 100%)",
        }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      {/* Colored light patches on floor */}
      <div
        className="absolute bottom-0 left-[25%] w-[15%] h-[8%] rounded-full blur-xl"
        style={{ backgroundColor: "rgba(212,175,55,0.015)" }}
      />
      <div
        className="absolute bottom-0 left-[60%] w-[12%] h-[6%] rounded-full blur-xl"
        style={{ backgroundColor: "rgba(94,27,36,0.01)" }}
      />
    </div>
  );
}
