import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  DoorOpen,
  FlaskConical,
  Library as LibraryIcon,
  Leaf,
  Map as MapIcon,
  Telescope,
  Target,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Particles } from "@/components/animations/Particles";
import { Sparkles } from "@/components/animations/Sparkles";
import { PageTransition } from "@/components/animations/PageTransition";
import { castleLocations } from "@/data/mock";
import type { CastleLocation } from "@/types";

const ICONS: Record<string, typeof BookOpen> = {
  hall: DoorOpen,
  library: LibraryIcon,
  bed: BookOpen,
  flask: FlaskConical,
  leaf: Leaf,
  telescope: Telescope,
  target: Target,
};

export function CastleMap() {
  const [selected, setSelected] = useState<CastleLocation | null>(null);

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Castle Map"
          subtitle="Explore the grounds of the enchanted castle"
          icon={<MapIcon className="h-7 w-7" />}
          crumb={{ items: [{ label: "Extracurricular" }, { label: "Castle Map" }] }}
        />

        {/* Map illustration */}
        <div className="relative overflow-hidden rounded-3xl border border-gold/20 shadow-panel">
          <div className="relative h-[520px] sm:h-[560px]">
            {/* Background layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald2-400/25 via-ink-800 to-wine-700/30" aria-hidden />
            <Particles count={24} className="opacity-70" />
            <Sparkles count={12} />

            {/* Castle silhouette */}
            <div className="pointer-events-none absolute inset-x-0 top-10 flex items-end justify-center gap-2" aria-hidden>
              {[14, 20, 26, 20, 14].map((h, i) => (
                <div key={i} className="rounded-t-lg border border-ink-900/60 bg-ink-850/70" style={{ height: h * 3, width: 26 }} />
              ))}
            </div>
            <div className="pointer-events-none absolute inset-x-0 top-24 h-px bg-gold/20" aria-hidden />

            {/* Grid + location markers */}
            <div className="absolute inset-0">
              {castleLocations.map((loc) => {
                const Icon = ICONS[loc.icon] ?? MapIcon;
                const isSelected = selected?.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => setSelected(loc)}
                    aria-label={loc.name}
                    className="btn-focus group absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                  >
                    <motion.span
                      className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl border backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-glow"
                      style={{
                        borderColor: `${loc.color}66`,
                        background: `${loc.color}1f`,
                        color: loc.color,
                        boxShadow: isSelected ? `0 0 24px ${loc.color}88` : undefined,
                      }}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Icon className="h-6 w-6" />
                    </motion.span>
                    <span className="pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full border border-silver/20 bg-ink-950/80 px-2 py-0.5 text-[10px] text-beige-100 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
                      {loc.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 rounded-xl border border-silver/15 bg-ink-950/70 p-3 backdrop-blur-md">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gold-400">Legend</p>
              <div className="grid grid-cols-1 gap-1.5">
                {castleLocations.map((l) => (
                  <button key={l.id} onClick={() => setSelected(l)} className="btn-focus flex items-center gap-2 text-left text-[11px] text-silver-400 transition hover:text-beige-100">
                    <span className="h-2 w-2 rounded-full" style={{ background: l.color }} />
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="absolute right-4 top-4"><Badge tone="beige">Parchment · interactive</Badge></div>
          </div>
        </div>

        {/* Location info panel */}
        <Card>
          <CardBody className="space-y-4">
            <h2 className="font-heading text-lg text-beige-100">{selected ? selected.name : "Select a location"}</h2>
            <p className="text-sm leading-relaxed text-silver-400">
              {selected
                ? selected.description
                : "Click any glowing location on the map to reveal its secrets. Each point of interest holds information about the location, its purpose and who you might find there."}
            </p>
            {selected && (
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="gold">{selected.status}</Badge>
                <Badge tone="neutral">Found in the {selected.name}</Badge>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Detail modal */}
        <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
          {selected && (() => {
            const Icon = ICONS[selected.icon] ?? MapIcon;
            return (
              <div className="space-y-4">
                <div
                  className="flex h-32 items-center justify-center rounded-2xl border"
                  style={{ borderColor: `${selected.color}44`, background: `${selected.color}14` }}
                >
                  <Icon className="h-16 w-16" style={{ color: selected.color }} />
                </div>
                <p className="text-sm leading-relaxed text-silver-400">{selected.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge tone="gold">{selected.status}</Badge>
                  <Badge tone="beige">Near the centre of the grounds</Badge>
                </div>
                <Button className="w-full" onClick={() => setSelected(null)}>Close</Button>
              </div>
            );
          })()}
        </Modal>
      </div>
    </PageTransition>
  );
}