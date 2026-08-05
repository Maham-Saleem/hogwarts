import { motion } from "framer-motion";

const owlPositions = [
  { x: 25, y: 15 },
  { x: 70, y: 12 },
  { x: 45, y: 18 },
];

export function Owls() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {owlPositions.map((o, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${o.x}%`,
            top: `${o.y}%`,
            width: 5,
            height: 6,
            backgroundColor: "rgba(100,90,75,0.04)",
            borderRadius: "40% 40% 50% 50%",
          }}
        >
          {/* Head turn */}
          <motion.div
            className="absolute top-[15%] left-[20%] w-[60%] h-[40%] rounded-full"
            style={{ backgroundColor: "rgba(100,90,75,0.03)" }}
            animate={{
              rotate: [0, 15, 0, -10, 0],
            }}
            transition={{
              duration: 8 + i * 3,
              repeat: Infinity,
              delay: i * 4,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
