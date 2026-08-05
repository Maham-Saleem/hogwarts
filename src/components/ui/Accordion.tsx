import type { ReactNode } from "react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils";

interface AccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export function Accordion({ items, defaultOpen }: { items: AccordionItem[]; defaultOpen?: string }) {
  const [openId, setOpenId] = useState<string | null>(defaultOpen ?? items[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id} className={cn("glass overflow-hidden rounded-xl transition-colors", open && "border-gold/30")}>
            <button
              onClick={() => setOpenId(open ? null : item.id)}
              aria-expanded={open}
              className="btn-focus flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-medium text-beige-100">{item.title}</span>
              <ChevronDown className={cn("h-4 w-4 shrink-0 text-gold-400 transition-transform duration-300", open && "rotate-180")} />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="border-t border-silver/10 px-5 py-4 text-sm leading-relaxed text-silver-400">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}