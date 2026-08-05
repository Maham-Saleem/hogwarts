import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils";
import type { CalendarEvent } from "@/types";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function Calendar({ events = [], className }: { events?: CalendarEvent[]; className?: string }) {
  const [view, setView] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const firstDay = new Date(view.year, view.month, 1).getDay();
  const offset = (firstDay + 6) % 7;
  const today = new Date();

  const monthName = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(
    new Date(view.year, view.month, 1)
  );

  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    for (const ev of events) {
      const dt = new Date(ev.date);
      if (dt.getFullYear() === view.year && dt.getMonth() === view.month) {
        const arr = map.get(dt.getDate()) ?? [];
        arr.push(ev);
        map.set(dt.getDate(), arr);
      }
    }
    return map;
  }, [events, view]);

  const shift = (dir: 1 | -1) => {
    setView((v) => {
      let month = v.month + dir;
      let year = v.year;
      if (month < 0) { month = 11; year -= 1; }
      if (month > 11) { month = 0; year += 1; }
      return { year, month };
    });
  };

  return (
    <div className={cn("glass rounded-2xl p-4", className)}>
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => shift(-1)} aria-label="Previous month" className="btn-focus rounded-lg p-1.5 text-silver-400 transition hover:bg-ink-700 hover:text-beige-100">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h4 className="font-heading text-base text-beige-100">{monthName}</h4>
        <button onClick={() => shift(1)} aria-label="Next month" className="btn-focus rounded-lg p-1.5 text-silver-400 transition hover:bg-ink-700 hover:text-beige-100">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((d) => (
          <span key={d} className="py-1 text-[11px] font-medium uppercase tracking-wider text-silver-500">
            {d}
          </span>
        ))}
        {Array.from({ length: offset }).map((_, i) => (
          <span key={`pad-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday =
            today.getFullYear() === view.year && today.getMonth() === view.month && today.getDate() === day;
          const dayEvents = eventsByDay.get(day) ?? [];
          return (
            <div
              key={day}
              className={cn(
                "relative flex h-9 items-center justify-center rounded-lg text-xs transition-colors",
                isToday ? "border border-gold/50 bg-gold/15 font-semibold text-gold-200" : "text-beige-100/80 hover:bg-ink-700"
              )}
            >
              {day}
              {dayEvents.length > 0 && (
                <div className="absolute bottom-1 flex gap-0.5">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <span key={ev.id} className="h-1 w-1 rounded-full" style={{ background: ev.color }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 space-y-1.5 border-t border-silver/10 pt-3">
        {events.length === 0 && <p className="text-xs text-silver-500">No events this month.</p>}
        {eventsByDay.size > 0 &&
          Array.from(eventsByDay.entries())
            .sort((a, b) => a[0] - b[0])
            .slice(0, 3)
            .flatMap(([day, list]) =>
              list.slice(0, 2).map((ev) => (
                <motion.div
                  key={`${day}-${ev.id}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 rounded-lg bg-ink-700/60 px-2.5 py-1.5 text-xs"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: ev.color }} />
                  <span className="truncate text-beige-100/90">{ev.title}</span>
                  <span className="ml-auto shrink-0 text-[10px] text-silver-500">
                    {day} {ev.time}
                  </span>
                </motion.div>
              ))
            )}
      </div>
    </div>
  );
}