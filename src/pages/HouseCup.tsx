import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Trophy } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { PageTransition, Stagger, itemVariants } from "@/components/animations/PageTransition";
import { housePoints, houseMeta } from "@/data/mock";
import { formatDate } from "@/utils";
import type { House } from "@/types";

const HOUSES: House[] = ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"];

interface RunningTotals {
  house: House;
  points: number;
  delta: number;
}

function WinningCelebration({ house }: { house: House }) {
  const meta = houseMeta[house];
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      className="flex flex-col items-center gap-2 py-2 text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex items-center gap-2"
      >
        <Crown className="h-8 w-8" style={{ color: meta.color }} />
        <Trophy className="h-6 w-6 text-gold-300" />
        <Crown className="h-8 w-8 -scale-x-100" style={{ color: meta.color }} />
      </motion.div>
      <p className="font-heading text-lg" style={{ color: meta.color }}>{house} leads the cup!</p>
    </motion.div>
  );
}

export function HouseCup() {
  const [celebrate, setCelebrate] = useState(false);

  const totals = useMemo<RunningTotals[]>(() => {
    const base: Record<House, number> = { Gryffindor: 0, Slytherin: 0, Ravenclaw: 0, Hufflepuff: 0 };
    const last: Record<House, number> = { ...base };
    for (const h of HOUSES) {
      const prev = housePoints.filter((p) => p.house === h && p.reason === "Weekly tally");
      base[h] = prev[0]?.points ?? 0;
      const deltas = housePoints.filter((p) => p.house === h && p.reason !== "Weekly tally");
      last[h] = base[h] + deltas.reduce((s, d) => s + d.delta, 0);
    }
    return HOUSES.map((house) => ({ house, points: last[house], delta: last[house] - base[house] }));
  }, []);

  const max = Math.max(...totals.map((t) => t.points));
  const sorted = [...totals].sort((a, b) => b.points - a.points);
  const leader = sorted[0];

  useEffect(() => {
    const t = window.setTimeout(() => setCelebrate(true), 800);
    return () => window.clearTimeout(t);
  }, []);

  const history = useMemo(
    () =>
      [...housePoints]
        .filter((p) => p.reason !== "Weekly tally")
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 8),
    []
  );

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="House Cup"
          subtitle="The eternal rivalry of the four houses"
          icon={<Trophy className="h-7 w-7" />}
          crumb={{ items: [{ label: "Academics" }, { label: "House Cup" }] }}
        />

        {celebrate && (
          <Card glow>
            <CardBody>
              <WinningCelebration house={leader.house} />
            </CardBody>
          </Card>
        )}

        <Stagger className="grid gap-6 lg:grid-cols-2">
          {sorted.map((t) => {
            const meta = houseMeta[t.house];
            const pct = (t.points / max) * 100;
            const isLeader = t.house === leader.house;
            return (
              <motion.div key={t.house} variants={itemVariants}>
                <Card glow={isLeader} className="relative overflow-hidden">
                  <div
                    className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-2xl"
                    style={{ background: `${meta.color}22` }}
                    aria-hidden
                  />
                  <CardBody>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-12 w-12 items-center justify-center rounded-xl border font-heading text-lg font-bold"
                          style={{ background: meta.bg, borderColor: meta.border, color: meta.color }}
                        >
                          {t.house[0]}
                        </span>
                        <div>
                          <h3 className="font-heading text-lg text-beige-100">{t.house}</h3>
                          <p className="text-[11px] italic text-silver-500">“{meta.motto}”</p>
                        </div>
                      </div>
                      {isLeader && <Badge tone="gold">Leader</Badge>}
                    </div>
                    <div className="mt-5 flex items-end justify-between">
                      <span className="font-heading text-3xl text-beige-100">{t.points.toLocaleString()}</span>
                      <span className="text-xs text-emerald2-200">+{t.delta} this week</span>
                    </div>
                    <ProgressBar value={pct} color={meta.color} size="lg" className="mt-3" label={`${t.house} house points`} />
                    <div className="mt-4 flex items-center justify-between text-xs text-silver-500">
                      <span>Place #{sorted.indexOf(t) + 1}</span>
                      <span>{Math.round(pct)}% of leader</span>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </Stagger>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader title="Recent House Point Activity" subtitle="Why the totals changed" />
            <CardBody className="space-y-3">
              {history.length === 0 && <p className="py-6 text-center text-sm text-silver-500">No recent activity.</p>}
              {history.map((h) => {
                const meta = houseMeta[h.house];
                return (
                  <div key={h.id} className="flex items-center gap-3 rounded-xl border border-silver/10 bg-ink-900/40 p-3">
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold"
                      style={{ background: meta.bg, borderColor: meta.border, color: meta.color }}
                    >
                      {h.house[0]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-beige-100">{h.reason}</p>
                      <p className="text-[11px] text-silver-500">{h.house} · {formatDate(h.date)}</p>
                    </div>
                    <Badge tone="emerald">+{h.delta}</Badge>
                  </div>
                );
              })}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Standings" subtitle="All-time totals" />
            <CardBody className="space-y-3">
              {sorted.map((t, i) => (
                <div key={t.house} className="flex items-center gap-3">
                  <span className="w-5 text-center font-heading text-sm text-silver-500">{i + 1}</span>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: houseMeta[t.house].color }} />
                  <span className="flex-1 text-sm text-beige-100">{t.house}</span>
                  <span className="text-sm font-semibold text-beige-100">{t.points.toLocaleString()}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
}