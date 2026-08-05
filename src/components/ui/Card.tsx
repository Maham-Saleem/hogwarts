import type { ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils";

type CardProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
  glow?: boolean;
  interactive?: boolean;
  delay?: number;
};

export function Card({ children, className, glow, interactive, delay = 0, ...rest }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "glass rounded-2xl",
        glow && "shadow-glow-sm border-gold/20",
        interactive &&
          "cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-glow",
        className
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ title, subtitle, action, className }: {
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 border-b border-silver/10 p-5", className)}>
      <div>
        <h3 className="font-heading text-lg text-beige-100">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-silver-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-5", className)}>{children}</div>;
}