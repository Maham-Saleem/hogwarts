import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, CalendarClock, Sparkles, Timer } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Tabs } from "@/components/ui/Tabs";
import { PageTransition, Stagger, itemVariants } from "@/components/animations/PageTransition";
import { leagueTable, matches, playerStats } from "@/data/mock";
import { formatDate } from "@/utils";
import type { PlayerStat, TeamRow } from "@/types";

const HOUSE_COLORS: Record<string, string> = {
  Gryffindor: "#B33A3A",
  Slytherin: "#2E7D46",
  Ravenclaw: "#4A6FA5",
  Hufflepuff: "#C9A227",
};

export function Quidditch() {
  const [view, setView] = useState<"matches" | "league" | "players">("matches");

  const upcoming = matches.filter((m) => m.status !== "finished");
  const finished = matches.filter((m) => m.status === "finished").sort((a, b) => b.date.localeCompare(a.date));

  const playerColumns: Column<PlayerStat>[] = [
    { key: "name", header: "Player", render: (r) => <span className="font-medium text-beige-100">{r.name}</span> },
    { key: "position", header: "Position", render: (r) => <Badge tone="neutral">{r.position}</Badge> },
    { key: "matches", header: "Played", className: "text-center", render: (r) => r.matches },
    { key: "goals", header: "Goals", className: "text-center", render: (r) => <span className="text-gold-300">{r.goals}</span> },
    { key: "assists", header: "Assists", className: "text-center", render: (r) => r.assists },
    { key: "saves", header: "Saves", className: "text-center", render: (r) => r.saves },
    { key: "rating", header: "Rating", className: "text-right", render: (r) => <span className="font-semibold text-beige-100">★ {r.rating.toFixed(1)}</span> },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Quidditch"
          subtitle="Ravenclaw house team — fixtures, standings and player stats"
          icon={<Sparkles className="h-7 w-7" />}
          crumb={{ items: [{ label: "Extracurricular" }, { label: "Quidditch" }] }}
        />

        <Tabs
          tabs={[
            { id: "matches", label: "Matches" },
            { id: "league", label: "League Table" },
            { id: "players", label: "Players" },
          ]}
          value={view}
          onChange={setView}
        />

        {view === "matches" && (
          <div className="space-y-8">
            <div>
              <h2 className="mb-3 flex items-center gap-2 font-heading text-lg text-beige-100"><Timer className="h-5 w-5 text-gold-400" /> Upcoming</h2>
              <Stagger className="grid gap-4 lg:grid-cols-2">
                {upcoming.map((m) => (
                  <motion.div key={m.id} variants={itemVariants}>
                    <Card interactive className="p-5">
                      <div className="mb-4 flex items-center justify-between text-xs text-silver-500">
                        <span className="flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5" /> {formatDate(m.date)} · {m.time}</span>
                        <Badge tone="gold">{m.location}</Badge>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <TeamLabel name={m.home} right />
                        <span className="font-display text-lg italic text-silver-500">vs</span>
                        <TeamLabel name={m.away} />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </Stagger>
            </div>

            <div>
              <h2 className="mb-3 flex items-center gap-2 font-heading text-lg text-beige-100"><Activity className="h-5 w-5 text-gold-400" /> Match History</h2>
              <Stagger className="space-y-4">
                {finished.map((m) => {
                  const homeColor = HOUSE_COLORS[m.home];
                  const awayColor = HOUSE_COLORS[m.away];
                  const winner = m.homeScore! > m.awayScore! ? m.home : m.away;
                  return (
                    <motion.div key={m.id} variants={itemVariants}>
                      <div className="glass rounded-2xl p-5 transition-colors hover:border-gold/30">
                        <div className="mb-3 flex items-center justify-between text-xs text-silver-500">
                          <span>{formatDate(m.date)} · {m.location}</span>
                          <Badge tone={winner === "Ravenclaw" ? "emerald" : "neutral"}>{winner} won</Badge>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <TeamLabel name={m.home} right />
                          <ScoreBadge score={m.homeScore!} active={m.home === winner} color={homeColor} />
                          <span className="font-display text-lg italic text-silver-600">-</span>
                          <ScoreBadge score={m.awayScore!} active={m.away === winner} color={awayColor} />
                          <TeamLabel name={m.away} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </Stagger>
            </div>
          </div>
        )}

        {view === "league" && (
          <Card>
            <CardHeader title="House League Table" subtitle="Season 2025–26" />
            <CardBody>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-silver/10 text-left text-xs uppercase tracking-wider text-silver-500">
                      {["#", "Team", "Played", "Won", "Drawn", "Lost", "Points"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {leagueTable.map((t: TeamRow) => (
                      <tr key={t.team} className="border-b border-silver/5 transition-colors hover:bg-ink-700/40">
                        <td className="px-4 py-3 font-heading text-silver-500">{t.position}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-2 font-medium text-beige-100">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ background: HOUSE_COLORS[t.team] }} />
                            {t.team}
                            {t.team === "Ravenclaw" && <Badge tone="gold">Us</Badge>}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-silver-400">{t.played}</td>
                        <td className="px-4 py-3 text-center text-silver-400">{t.won}</td>
                        <td className="px-4 py-3 text-center text-silver-400">{t.drawn}</td>
                        <td className="px-4 py-3 text-center text-silver-400">{t.lost}</td>
                        <td className="px-4 py-3 font-semibold text-gold-300">{t.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        )}

        {view === "players" && (
          <Card>
            <CardHeader title="Ravenclaw Squad" subtitle="Player statistics this season" />
            <CardBody>
              <DataTable columns={playerColumns} data={playerStats} rowKey={(r) => r.id} />
            </CardBody>
          </Card>
        )}
      </div>
    </PageTransition>
  );
}

function TeamLabel({ name, right }: { name: string; right?: boolean }) {
  const color = HOUSE_COLORS[name] ?? "#C0C0C0";
  return (
    <div className={`flex min-w-0 items-center gap-2 ${right ? "flex-row-reverse text-right" : ""}`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-xs font-bold" style={{ borderColor: `${color}66`, background: `${color}22`, color }}>
        {name[0]}
      </span>
      <span className="truncate text-sm font-semibold text-beige-100">{name}</span>
    </div>
  );
}

function ScoreBadge({ score, active, color }: { score: number; active: boolean; color: string }) {
  return (
    <span
      className="rounded-lg px-3 py-1 font-heading text-xl"
      style={{
        color: active ? "#0D1117" : "#F2EAD8",
        background: active ? color : `${color}22`,
        border: `1px solid ${color}55`,
        boxShadow: active ? `0 0 16px ${color}66` : undefined,
      }}
    >
      {score}
    </span>
  );
}