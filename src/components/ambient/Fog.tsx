import { motion } from "framer-motion";

export function Fog() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[140%] h-[40%] bottom-0 -left-[20%]"
        style={{
          background: "linear-gradient(0deg, rgba(40,38,36,0.15) 0%, rgba(40,38,36,0.05) 40%, transparent 100%)",
        }}
        animate={{ x: ["-5%", "5%", "-5%"] }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[140%] h-[30%] bottom-[10%] -left-[20%]"
        style={{
          background: "linear-gradient(0deg, rgba(50,48,45,0.08) 0%, transparent 100%)",
        }}
        animate={{ x: ["3%", "-3%", "3%"] }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
