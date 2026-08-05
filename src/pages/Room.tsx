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
      if (s && discover(room.id, s.id)) {
        setRevealedSecret(s);
        addToInventory(s.name);
      }
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
        <h1 className="font-heading text-3xl text-gold mb-4">Chamber Not Found</h1>
        <button onClick={() => navigate("/hub")} className="px-6 py-2 bg-gold/10 border border-gold/30 rounded-lg text-gold text-sm hover:bg-gold/20 transition-colors">Return to Hub</button>
      </div>
    </div>
  );

  const nextRoom = rooms[roomIndex + 1];
  const prevRoom = rooms[roomIndex - 1];

  return (
    <div className="relative min-h-screen bg-abyss overflow-hidden">
      {/* Room ambience */}
      <div className="fixed inset-0 z-0" style={{
        background: `radial-gradient(ellipse at 50% 30%, ${room.colors.ambient}, transparent 70%), radial-gradient(ellipse at 50% 100%, ${room.colors.ambient}, transparent 50%)`,
      }} />
      <EffectsRenderer effects={room.ambientEffects} />
      <div className="fixed inset-0 z-[7] pointer-events-none bg-vignette" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top bar */}
        <motion.div className="fixed top-14 left-0 right-0 z-20 flex items-center justify-between px-4 md:px-8 py-3"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <button onClick={() => navigate("/hub")}
            className="px-3 py-1.5 bg-surface/60 border border-gold/15 rounded-lg text-xs text-moonlight/60 hover:text-gold transition-colors font-body">← Hub</button>
          <div className="flex items-center gap-4 text-xs text-moonlight/40 font-body">
            <span>{discoveredIds.size}/{room.interactiveElements.length} found</span>
            <span>{room.secrets.filter((s) => isDiscovered(s.id)).length}/{room.secrets.length} secrets</span>
          </div>
        </motion.div>

        {/* Room header */}
        <motion.div className="pt-28 pb-6 text-center px-4"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <div className="text-4xl mb-3">{room.icon}</div>
          <h1 className="font-heading text-3xl md:text-5xl tracking-[0.12em] mb-2"
            style={{ color: room.colors.primary, textShadow: `0 0 30px ${room.colors.glow}` }}>{room.name}</h1>
          <p className="font-display text-sm md:text-base text-moonlight/35 italic">{room.subtitle}</p>
        </motion.div>

        {/* Content */}
        <div className="flex-1 max-w-5xl mx-auto w-full px-4">
          {/* Description */}
          <motion.div className="mb-8 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <p className="font-display text-sm md:text-base text-moonlight/45 leading-relaxed">{room.description}</p>
          </motion.div>

          {/* Quote */}
          {room.quote && (
            <motion.blockquote className="text-center mb-8 italic font-display text-moonlight/25 text-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              &ldquo;{room.quote}&rdquo;
            </motion.blockquote>
          )}

          {/* Interactive area */}
          <motion.div className="relative w-full aspect-[16/10] md:aspect-[16/8] rounded-2xl overflow-hidden mb-8"
            style={{ border: `1px solid ${room.colors.primary}15`, background: `linear-gradient(180deg, transparent 0%, ${room.colors.ambient} 100%)` }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {room.interactiveElements.map((el) => (
              <InteractiveObject key={el.id} element={el} onInteract={handleInteract} />
            ))}
            {discoveredIds.size === 0 && (
              <motion.div className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                <p className="font-display text-moonlight/15 text-sm italic">Tap the glowing objects to interact...</p>
              </motion.div>
            )}
          </motion.div>

          {/* Room features as enchanted books */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <EnchantedBook title="Room Features" color={room.colors.primary}>
              {room.ambientEffects.length} ambient effects active. {room.interactiveElements.length} interactive elements to discover.
            </EnchantedBook>
            <EnchantedBook title="Secrets & Mysteries" color="#8B5CF6">
              {room.secrets.length > 0 ? `${room.secrets.length} hidden secret${room.secrets.length > 1 ? "s" : ""} waiting to be uncovered.` : "This room holds no known secrets... or does it?"}
            </EnchantedBook>
          </div>

          {/* Progress */}
          <div className="mb-8 max-w-md mx-auto">
            <EnergyBar value={discoveredIds.size} max={room.interactiveElements.length} color={room.colors.primary} label="Exploration Progress" />
          </div>

          {/* Secret hints */}
          {room.secrets.length > 0 && (
            <motion.div className="text-center mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              {room.secrets.map((s) => (
                <div key={s.id} className="inline-block mx-2 px-3 py-1.5 rounded-lg text-xs font-body"
                  style={{
                    color: isDiscovered(s.id) ? room.colors.primary : "rgba(201,205,211,0.25)",
                    background: isDiscovered(s.id) ? `${room.colors.glow}15` : "transparent",
                    border: `1px solid ${isDiscovered(s.id) ? room.colors.primary + "25" : "rgba(100,100,100,0.1)"}`,
                  }}>
                  {isDiscovered(s.id) ? `🔓 ${s.name}` : `🔒 ${s.hint}`}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <motion.div className="flex items-center justify-between px-4 md:px-8 py-8 max-w-5xl mx-auto w-full"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          {prevRoom ? (
            <button onClick={() => navigate(`/explore/${prevRoom.id}`)}
              className="px-4 py-2 bg-surface/60 border border-gold/15 rounded-lg text-xs text-moonlight/50 hover:text-gold hover:border-gold/30 transition-all font-body">
              ← {prevRoom.name}
            </button>
          ) : <div />}
          <button onClick={() => navigate("/hub")}
            className="px-4 py-2 bg-gradient-to-b from-wood-light/40 to-wood/40 border border-brass/25 rounded-lg text-xs text-gold font-heading tracking-wider hover:from-wood-polish/15 transition-all">
            🗺️ Castle Map
          </button>
          {nextRoom ? (
            <button onClick={() => navigate(`/explore/${nextRoom.id}`)}
              className="px-4 py-2 bg-surface/60 border border-gold/15 rounded-lg text-xs text-moonlight/50 hover:text-gold hover:border-gold/30 transition-all font-body">
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
