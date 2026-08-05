import { useState, useCallback, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { rooms } from "@/data/rooms";
import { useDiscovery } from "@/context/DiscoveryContext";
import { EffectsRenderer } from "@/components/effects/EffectsRenderer";
import { InteractiveObject, InteractionModal } from "@/components/interactive/InteractiveObject";
import { SecretReveal } from "@/components/ui/SecretReveal";
import type { InteractiveElement, Secret } from "@/types";

export function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { discover, isDiscovered, addToInventory, unlockRoom } = useDiscovery();
  const [activeElement, setActiveElement] = useState<InteractiveElement | null>(null);
  const [revealedSecret, setRevealedSecret] = useState<Secret | null>(null);
  const [discoveredElementIds, setDiscoveredElementIds] = useState<Set<string>>(new Set());

  const room = useMemo(() => rooms.find((r) => r.id === roomId), [roomId]);
  const roomIndex = useMemo(() => rooms.findIndex((r) => r.id === roomId), [roomId]);

  // Auto-unlock adjacent rooms
  useEffect(() => {
    if (roomIndex < rooms.length - 1) unlockRoom(rooms[roomIndex + 1].id);
    if (roomIndex > 0) unlockRoom(rooms[roomIndex - 1].id);
  }, [roomIndex, unlockRoom]);

  const handleSecretCheck = useCallback(() => {
    if (!room) return;
    const discoveredCount = discoveredElementIds.size + 1;
    if (discoveredCount >= 3 && room.secrets.length > 0) {
      const undiscovered = room.secrets.find((s) => !isDiscovered(s.id));
      if (undiscovered) {
        const success = discover(room.id, undiscovered.id);
        if (success) {
          setRevealedSecret(undiscovered);
          addToInventory(undiscovered.name);
        }
      }
    }
  }, [room, discoveredElementIds, isDiscovered, discover, addToInventory]);

  const handleInteract = useCallback(
    (element: InteractiveElement) => {
      setActiveElement(element);
      if (!discoveredElementIds.has(element.id)) {
        setDiscoveredElementIds((prev) => new Set([...prev, element.id]));
      }
    },
    [discoveredElementIds]
  );

  const handleCloseModal = useCallback(() => {
    setActiveElement(null);
    handleSecretCheck();
  }, [handleSecretCheck]);

  const handleCloseSecret = useCallback(() => {
    setRevealedSecret(null);
  }, []);

  if (!room) {
    return (
      <div className="min-h-screen bg-abyss flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-3xl text-gold mb-4">Chamber Not Found</h1>
          <p className="font-display text-moonlight/50 mb-6">This room does not exist in the castle.</p>
          <button
            onClick={() => navigate("/hub")}
            className="px-6 py-2 bg-gold/10 border border-gold/30 rounded-lg text-gold font-body text-sm hover:bg-gold/20 transition-colors"
          >
            Return to Hub
          </button>
        </div>
      </div>
    );
  }

  const nextRoom = rooms[roomIndex + 1];
  const prevRoom = rooms[roomIndex - 1];

  return (
    <div className="relative min-h-screen bg-abyss overflow-hidden">
      {/* Room background gradient */}
      <div
        className="fixed inset-0 z-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${room.colors.ambient}, transparent 70%), radial-gradient(ellipse at 50% 100%, ${room.colors.ambient}, transparent 50%)`,
        }}
      />

      {/* Ambient effects */}
      <EffectsRenderer effects={room.ambientEffects} />

      {/* Vignette */}
      <div className="fixed inset-0 z-[7] pointer-events-none bg-vignette" />

      {/* Room content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Top info bar */}
        <motion.div
          className="fixed top-14 left-0 right-0 z-20 flex items-center justify-between px-4 md:px-8 py-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => navigate("/hub")}
            className="px-3 py-1.5 bg-surface/60 border border-gold/15 rounded-lg text-xs text-moonlight/60 hover:text-gold transition-colors font-body"
          >
            ← Hub
          </button>
          <div className="flex items-center gap-4 text-xs text-moonlight/40 font-body">
            <span>{discoveredElementIds.size} / {room.interactiveElements.length} found</span>
            <span>{room.secrets.filter((s) => isDiscovered(s.id)).length} / {room.secrets.length} secrets</span>
          </div>
        </motion.div>

        {/* Room name */}
        <motion.div
          className="pt-28 pb-8 text-center px-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1
            className="font-heading text-3xl md:text-5xl tracking-[0.15em] mb-2"
            style={{ color: room.colors.primary, textShadow: `0 0 30px ${room.colors.glow}` }}
          >
            {room.name}
          </h1>
          <p className="font-display text-sm md:text-base text-moonlight/40 italic">{room.subtitle}</p>
        </motion.div>

        {/* Exploration area */}
        <div className="flex-1 relative max-w-5xl mx-auto w-full px-4">
          {/* Room description */}
          <motion.div
            className="mb-8 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="font-display text-sm md:text-base text-moonlight/50 leading-relaxed">
              {room.description}
            </p>
          </motion.div>

          {/* Quote */}
          {room.quote && (
            <motion.blockquote
              className="text-center mb-10 italic font-display text-moonlight/30 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              "{room.quote}"
            </motion.blockquote>
          )}

          {/* Interactive elements area */}
          <div className="relative w-full aspect-[16/10] md:aspect-[16/8] border border-gold/10 rounded-2xl overflow-hidden bg-surface/20 backdrop-blur-sm">
            {/* Room floor gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(180deg, transparent 0%, ${room.colors.ambient} 100%)`,
              }}
            />

            {/* Interactive objects */}
            {room.interactiveElements.map((el) => (
              <InteractiveObject
                key={el.id}
                element={el}
                onInteract={handleInteract}
                discovered={discoveredElementIds.has(el.id)}
              />
            ))}

            {/* Hint overlay */}
            {discoveredElementIds.size === 0 && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <p className="font-display text-moonlight/20 text-sm italic">
                  Tap the glowing objects to interact...
                </p>
              </motion.div>
            )}
          </div>

          {/* Secrets hint */}
          {room.secrets.length > 0 && (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {room.secrets.map((s) => (
                <div
                  key={s.id}
                  className="inline-block mx-2 px-3 py-1 rounded-lg text-xs font-body"
                  style={{
                    color: isDiscovered(s.id) ? room.colors.primary : "rgba(201,205,211,0.3)",
                    background: isDiscovered(s.id) ? `${room.colors.glow}20` : "transparent",
                    border: `1px solid ${isDiscovered(s.id) ? room.colors.primary + "30" : "transparent"}`,
                  }}
                >
                  {isDiscovered(s.id) ? `🔓 ${s.name}` : `🔒 ${s.hint}`}
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <motion.div
          className="flex items-center justify-between px-4 md:px-8 py-8 max-w-5xl mx-auto w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {prevRoom ? (
            <button
              onClick={() => navigate(`/explore/${prevRoom.id}`)}
              className="px-4 py-2 bg-surface/60 border border-gold/15 rounded-lg text-xs text-moonlight/50 hover:text-gold hover:border-gold/30 transition-all font-body"
            >
              ← {prevRoom.name}
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={() => navigate("/hub")}
            className="px-4 py-2 bg-gold/10 border border-gold/30 rounded-lg text-xs text-gold font-body hover:bg-gold/20 transition-colors"
          >
            🗺️ Castle Map
          </button>
          {nextRoom ? (
            <button
              onClick={() => navigate(`/explore/${nextRoom.id}`)}
              className="px-4 py-2 bg-surface/60 border border-gold/15 rounded-lg text-xs text-moonlight/50 hover:text-gold hover:border-gold/30 transition-all font-body"
            >
              {nextRoom.name} →
            </button>
          ) : (
            <div />
          )}
        </motion.div>
      </div>

      {/* Interaction modal */}
      <InteractionModal element={activeElement} onClose={handleCloseModal} />

      {/* Secret reveal */}
      {revealedSecret && (
        <SecretReveal
          name={revealedSecret.name}
          description={revealedSecret.description}
          onClose={handleCloseSecret}
        />
      )}
    </div>
  );
}
