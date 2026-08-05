import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";

interface TabsProps<T extends string> {
  tabs: { id: T; label: ReactNode; icon?: ReactNode }[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
  size?: "sm" | "md";
}

export function Tabs<T extends string>({ tabs, value, onChange, className, size = "md" }: TabsProps<T>) {
  return (
    <div role="tablist" className={cn("inline-flex flex-wrap items-center gap-1 rounded-xl border border-silver/10 bg-ink-900/60 p-1", className)}>
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative rounded-lg font-medium transition-colors",
              size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
              active ? "text-gold-100" : "text-silver-500 hover:text-beige-200"
            )}
          >
            {active && (
              <motion.span
                layoutId={`tab-${tab.id}`}
                className="absolute inset-0 rounded-lg border border-gold/40 bg-gradient-to-b from-gold/15 to-gold/5"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {tab.icon}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}