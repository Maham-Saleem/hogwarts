import { motion } from "framer-motion";
import { cn } from "@/utils";

export function ProgressBar({
  value,
  color = "#D4AF37",
  className,
  size = "md",
  label,
}: {
  value: number;
  color?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };
  return (
    <div className={className} role="progressbar" aria-valuenow={Math.round(clamped)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className={cn("w-full overflow-hidden rounded-full bg-ink-700/80", heights[size])}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 10px ${color}66`,
          }}
        />
      </div>
    </div>
  );
}