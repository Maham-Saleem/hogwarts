import { motion } from "framer-motion";

export function WeatherWindow() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Subtle daylight variation */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 50% 20%, rgba(180,170,155,0.015), transparent 60%)",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
