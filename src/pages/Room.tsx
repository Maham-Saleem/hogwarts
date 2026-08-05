import { useState, useCallback, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { rooms } from "@/data/rooms";
import { useDiscovery } from "@/context/DiscoveryContext";
import { EffectsRenderer } from "@/components/effects/EffectsRenderer";
import { InteractiveObject, InteractionModal } from "@/components/interactive/InteractiveObject";
import { SecretReveal } from "@/components/ui/SecretReveal";
import { EnchantedBook } from "@/components/ui/EnchantedBook";
import { EnergyBar } from "@/components/ui/EnergyBar";
import type { InteractiveElement, Secret } from "@/types";

export function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { discover, isDiscovered, addToInventory, unlockRoom, visitRoom } = useDiscovery();
  const [activeElement, setActiveElement] = useState<InteractiveElement | null>(null);
  const [revealedSecret, setRevealedSecret] = useState<Secret | null>(null);
  const [discoveredIds, setDiscoveredIds] = useState<Set<string>>(new Set());

  const room = useMemo(() => rooms.find((r) => r.id === roomId), [roomId]);
  const roomIndex = useMemo(() => rooms.findIndex((r) => r.id === roomId), [roomId]);

  useEffect(() => {
    if (roomIndex < rooms.length - 1) unlockRoom(rooms[roomIndex + 1].id);
    if (roomIndex > 0) unlockRoom(rooms[roomIndex - 1].id);
    if (room) visitRoom(room.id);
  }, [roomIndex, unlockRoom, visitRoom, room]);

  const checkSecret = useCallback(() => {
    if (!room) return;
    if (discoveredIds.size + 1 >= 3 && room.secrets.length > 0) {
      const s = room.secrets.find((x) => !isDiscovered(x.id));
      if (s && discover(room.id, s.id)) { setRevealedSecret(s); addToInventory(s.name); }
    }
  }, [room, discoveredIds, isDiscovered, discover, addToInventory]);

  const handleInteract = useCallback((el: InteractiveElement) => {
    setActiveElement(el);
    if (!discoveredIds.has(el.id)) setDiscoveredIds((p) => new Set([...p, el.id]));
  }, [discoveredIds]);

  const handleClose = useCallback(() => { setActiveElement(null); checkSecret(); }, [checkSecret]);

  if (!room) return (
    <div className="min-h-screen bg-abyss flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-heading text-2xl text-gold/60 mb-4">Chamber Not Found</h1>
        <button onClick={() => navigate("/hub")} className="px-5 py-2 bg-gold/8 border border-gold/20 rounded-lg text-gold/60 text-xs hover:border-gold/30 transition-all duration-500">Return to Hub</button>
      </div>
    </div>
  );

  const nextRoom = rooms[roomIndex + 1];
  const prevRoom = rooms[roomIndex - 1];

  return (
    <div className="relative min-h-screen bg-abyss overflow-hidden">
      <div className="fixed inset-0 z-0" style={{
        background: `radial-gradient(ellipse at 50% 30%, ${room.colors.ambient}, transparent 70%), radial-gradient(ellipse at 50% 100%, ${room.colors.ambient}, transparent 50%)`,
      }} />
      <EffectsRenderer effects={room.ambientEffects} />
      <div className="fixed inset-0 z-[7] pointer-events-none bg-vignette" />

      <div className="relative z-10 min-h-screen flex flex-col">
        <motion.div className="fixed top-14 left-0 right-0 z-20 flex items-center justify-between px-4 md:px-8 py-3"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }}>
          <button onClick={() => navigate("/hub")}
            className="px-3 py-1.5 bg-surface/50 border border-gold/10 rounded text-[10px] text-moonlight/50 hover:text-moonlight/80 transition-all duration-500 font-body">← Hub</button>
          <div className="flex items-center gap-3 text-[10px] text-moonlight/30 font-body">
            <span>{discoveredIds.size}/{room.interactiveElements.length} found</span>
            <span>{room.secrets.filter((s) => isDiscovered(s.id)).length}/{room.secrets.length} secrets</span>
          </div>
        </motion.div>

        <motion.div className="pt-28 pb-5 text-center px-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, ease: "easeOut" }}>
          <div className="text-2xl mb-2 opacity-40" style={{ color: room.colors.primary }}>{room.icon}</div>
          <h1 className="font-heading text-2xl md:text-4xl tracking-[0.1em] mb-1.5"
            style={{ color: `${room.colors.primary}CC`, textShadow: `0 0 20px ${room.colors.glow}` }}>{room.name}</h1>
          <p className="font-display text-xs md:text-sm text-moonlight/30 italic">{room.subtitle}</p>
        </motion.div>

        <div className="flex-1 max-w-5xl mx-auto w-full px-4">
          <motion.div className="mb-6 text-center max-w-xl mx-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}>
            <p className="font-display text-xs md:text-sm text-moonlight/35 leading-relaxed">{room.description}</p>
          </motion.div>

          {room.quote && (
            <motion.blockquote className="text-center mb-6 italic font-display text-moonlight/18 text-xs"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
              &ldquo;{room.quote}&rdquo;
            </motion.blockquote>
          )}

          <motion.div className="relative w-full aspect-[16/10] md:aspect-[16/8] rounded-xl overflow-hidden mb-6"
            style={{ border: `1px solid ${room.colors.primary}0A`, background: `linear-gradient(180deg, transparent 0%, ${room.colors.ambient} 100%)` }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}>
            {room.interactiveElements.map((el) => (
              <InteractiveObject key={el.id} element={el} onInteract={handleInteract} />
            ))}
            {discoveredIds.size === 0 && (
              <motion.div className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}>
                <p className="font-display text-moonlight/10 text-xs italic">Touch the symbols to interact...</p>
              </motion.div>
            )}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            <EnchantedBook title="Room Features" color={room.colors.primary}>
              {room.ambientEffects.length} ambient effects active. {room.interactiveElements.length} elements to discover.
            </EnchantedBook>
            <EnchantedBook title="Secrets" color="rgba(139,92,246,0.7)">
              {room.secrets.length > 0 ? `${room.secrets.length} hidden secret${room.secrets.length > 1 ? "s" : ""} waiting.` : "No known secrets... or are there?"}
            </EnchantedBook>
          </div>

          <div className="mb-6 max-w-sm mx-auto">
            <EnergyBar value={discoveredIds.size} max={room.interactiveElements.length} color={room.colors.primary} label="Exploration" />
          </div>

          {room.secrets.length > 0 && (
            <motion.div className="text-center mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}>
              {room.secrets.map((s) => (
                <div key={s.id} className="inline-block mx-1.5 px-2.5 py-1 rounded text-[9px] font-body"
                  style={{
                    color: isDiscovered(s.id) ? `${room.colors.primary}90` : "rgba(201,205,211,0.18)",
                    background: isDiscovered(s.id) ? `${room.colors.glow}0A` : "transparent",
                    border: `0.5px solid ${isDiscovered(s.id) ? room.colors.primary + "18" : "rgba(80,80,80,0.08)"}`,
                  }}>
                  {isDiscovered(s.id) ? `✦ ${s.name}` : `◇ ${s.hint}`}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        <motion.div className="flex items-center justify-between px-4 md:px-8 py-6 max-w-5xl mx-auto w-full"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}>
          {prevRoom ? (
            <button onClick={() => navigate(`/explore/${prevRoom.id}`)}
              className="px-3 py-1.5 bg-surface/50 border border-gold/8 rounded text-[10px] text-moonlight/40 hover:text-moonlight/70 hover:border-gold/15 transition-all duration-500 font-body">
              ← {prevRoom.name}
            </button>
          ) : <div />}
          <button onClick={() => navigate("/hub")}
            className="px-3 py-1.5 bg-gradient-to-b from-wood-light/25 to-wood/25 border border-brass/15 rounded text-[10px] text-gold/50 font-heading tracking-wider hover:text-gold/70 transition-all duration-500">
            🗺️ Map
          </button>
          {nextRoom ? (
            <button onClick={() => navigate(`/explore/${nextRoom.id}`)}
              className="px-3 py-1.5 bg-surface/50 border border-gold/8 rounded text-[10px] text-moonlight/40 hover:text-moonlight/70 hover:border-gold/15 transition-all duration-500 font-body">
              {nextRoom.name} →
            </button>
          ) : <div />}
        </motion.div>
      </div>

      <InteractionModal element={activeElement} onClose={handleClose} />
      {revealedSecret && <SecretReveal name={revealedSecret.name} description={revealedSecret.description} onClose={() => setRevealedSecret(null)} />}
    </div>
  );
}
