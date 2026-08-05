import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, MapPin, User } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Tabs } from "@/components/ui/Tabs";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { PageTransition, Stagger, itemVariants } from "@/components/animations/PageTransition";
import { subjects, classSlots } from "@/data/mock";
import { DAYS, todayIndex } from "@/utils";

type DayKey = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

const DAY_KEYS: DayKey[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function subjectIcon(_: string) {
  return <BookOpen className="h-4 w-4" />;
}

export function Timetable() {
  const today = todayIndex();
  const [day, setDay] = useState<DayKey>(DAY_KEYS[today]);
  const selectedIndex = DAY_KEYS.indexOf(day);

  const slots = useMemo(
    () => classSlots.filter((s) => s.day === selectedIndex).sort((a, b) => a.start.localeCompare(b.start)),
    [selectedIndex]
  );

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Timetable"
          subtitle="Your weekly schedule of magical instruction"
          icon={<Clock className="h-7 w-7" />}
          crumb={{ items: [{ label: "Academics" }, { label: "Timetable" }] }}
        />

        <Tabs
          tabs={DAY_KEYS.map((d, i) => ({ id: d, label: d, icon: i === today ? <span className="h-1.5 w-1.5 rounded-full bg-gold-400" /> : undefined }))}
          value={day}
          onChange={setDay}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <Stagger className="space-y-4 lg:col-span-2">
            {slots.length === 0 && (
              <Card>
                <CardBody className="py-14 text-center text-sm text-silver-500">
                  No classes scheduled for {DAYS[selectedIndex]}. A day to explore the grounds.
                </CardBody>
              </Card>
            )}
            {slots.map((slot) => {
              const subject = subjects.find((s) => s.id === slot.subjectId)!;
              const isCurrent =
                selectedIndex === today && isBetween(slot.start, slot.end);
              return (
                <motion.div key={slot.id} variants={itemVariants}>
                  <div
                    className={`relative overflow-hidden rounded-2xl border p-5 transition-all ${
                      isCurrent ? "border-gold/50 bg-gold/10 shadow-glow" : "glass hover:border-gold/30"
                    }`}
                  >
                    <span
                      className="pointer-events-none absolute inset-y-0 left-0 w-1.5"
                      style={{ background: `linear-gradient(180deg, ${subject.color}, ${subject.color}55)` }}
                      aria-hidden
                    />
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-xl"
                          style={{ background: `${subject.color}22`, color: subject.color, border: `1px solid ${subject.color}44` }}
                        >
                          {subjectIcon(subject.icon)}
                        </div>
                        <div>
                          <h3 className="font-heading text-lg text-beige-100">{subject.name}</h3>
                          <p className="text-xs text-silver-500">
                            {subject.credits} credits · {DAYS[selectedIndex]}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <Badge tone="gold">{slot.start} – {slot.end}</Badge>
                        {isCurrent && <Badge tone="emerald">In progress</Badge>}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-silver-400">
                      <span className="flex items-center gap-1.5"><User className="h-4 w-4 text-gold-400" /> {subject.professor}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-gold-400" /> Room {slot.location}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </Stagger>
          <div className="space-y-6">
            <Card>
              <CardBody>
                <h3 className="mb-4 font-heading text-base text-beige-100">Weekly Overview</h3>
                <div className="space-y-3">
                  {DAY_KEYS.map((d, idx) => {
                    const count = classSlots.filter((s) => s.day === idx).length;
                    const active = idx === selectedIndex;
                    return (
                      <button
                        key={d}
                        onClick={() => setDay(d)}
                        className={`btn-focus flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                          active ? "border-gold/40 bg-gold/10 text-gold-200" : "border-silver/10 bg-ink-900/40 text-silver-400 hover:border-gold/25 hover:text-beige-100"
                        }`}
                      >
                        <span className="font-medium">{DAYS[idx]}</span>
                        <span className="text-xs text-silver-500">{count} class{count === 1 ? "" : "es"}</span>
                      </button>
                    );
                  })}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <h3 className="mb-3 font-heading text-base text-beige-100">Legend</h3>
                <div className="flex flex-col gap-2">
                  {subjects.slice(0, 6).map((s) => (
                    <div key={s.id} className="flex items-center gap-2.5 text-sm text-silver-400">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                      <span className="flex-1 truncate">{s.name}</span>
                      <span className="text-[11px] text-silver-600">{s.room}</span>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

function isBetween(start: string, end: string) {
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return cur >= sh * 60 + sm && cur <= eh * 60 + em;
}