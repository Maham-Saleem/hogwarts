import { motion } from "framer-motion";

export function Banners() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Left banner */}
      <motion.div
        className="absolute left-[5%] top-[5%] w-[4%] h-[25%]"
        style={{
          background: "linear-gradient(180deg, rgba(94,27,36,0.04) 0%, rgba(94,27,36,0.02) 80%, transparent 100%)",
          borderRadius: "0 0 2px 2px",
        }}
        animate={{
          skewX: [0, 0.4, 0, -0.3, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Right banner */}
      <motion.div
        className="absolute right-[5%] top-[5%] w-[4%] h-[25%]"
        style={{
          background: "linear-gradient(180deg, rgba(31,58,42,0.04) 0%, rgba(31,58,42,0.02) 80%, transparent 100%)",
          borderRadius: "0 0 2px 2px",
        }}
        animate={{
          skewX: [0, -0.4, 0, 0.3, 0],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </div>
  );
}
