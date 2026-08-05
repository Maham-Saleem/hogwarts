import type { ReactNode } from "react";
import { cn } from "@/utils";

interface TimelineItem {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  date?: string;
  icon?: ReactNode;
  color?: string;
}

export function Timeline({ items, className }: { items: TimelineItem[]; className?: string }) {
  return (
    <ol className={cn("relative flex flex-col gap-6 border-l border-silver/15 pl-6", className)}>
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span
            className="absolute -left-[35px] flex h-5 w-5 items-center justify-center rounded-full border"
            style={{ borderColor: `${item.color ?? "#D4AF37"}66`, background: `${item.color ?? "#D4AF37"}22` }}
            aria-hidden
          >
            {item.icon}
          </span>
          <div className="glass rounded-xl p-4 transition-colors hover:border-gold/30">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-beige-100">{item.title}</p>
              {item.date && <span className="shrink-0 text-xs text-silver-500">{item.date}</span>}
            </div>
            {item.description && <p className="mt-1.5 text-xs leading-relaxed text-silver-400">{item.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}