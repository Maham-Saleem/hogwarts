import { motion } from "framer-motion";

const portraits = [
  { x: 15, y: 10 },
  { x: 85, y: 12 },
  { x: 8, y: 45 },
  { x: 92, y: 42 },
];

export function Portraits() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {portraits.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: 8,
            height: 10,
            backgroundColor: "rgba(80,70,60,0.04)",
            borderRadius: "2px",
          }}
        >
          {/* Eyes */}
          <motion.div
            className="absolute top-[35%] left-[25%] w-[2px] h-[2px] rounded-full"
            style={{ backgroundColor: "rgba(100,90,70,0.06)" }}
            animate={{
              scaleY: [1, 1, 0.05, 1, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 3,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-[35%] right-[25%] w-[2px] h-[2px] rounded-full"
            style={{ backgroundColor: "rgba(100,90,70,0.06)" }}
            animate={{
              scaleY: [1, 1, 0.05, 1, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 3,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
