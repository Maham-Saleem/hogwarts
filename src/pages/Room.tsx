import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDiscovery } from "@/context/DiscoveryContext";
import { rooms } from "@/data/rooms";
import { EffectsRenderer } from "@/components/effects/EffectsRenderer";
import { InteractiveObject } from "@/components/interactive/InteractiveObject";
import { CinematicTransition } from "@/components/effects/CinematicTransition";
import { SecretReveal } from "@/components/ui/SecretReveal";
import { EnchantedBook } from "@/components/ui/EnchantedBook";
import { EnergyBar } from "@/components/ui/EnergyBar";
import type { RoomId } from "@/types";

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { visitRoom, isRoomUnlocked, unlockRoom } = useDiscovery();

  const room = rooms.find((r) => r.id === roomId);

  const [showTransition, setShowTransition] = useState(false);
  const [transitionType, setTransitionType] = useState<"door" | "stairs" | "corridor" | "fade" | "parchment">("fade");
  const [showSecret, setShowSecret] = useState<string | null>(null);
  const [showBook, setShowBook] = useState(false);
  const [energy, setEnergy] = useState(100);

  useEffect(() => {
    if (room) visitRoom(room.id);
  }, [room, visitRoom]);

  const handleInteraction = useCallback(
    (element: { id: string; unlocksRoom?: RoomId }) => {
      if (!room) return;
      if (element.unlocksRoom && !isRoomUnlocked(element.unlocksRoom)) {
        unlockRoom(element.unlocksRoom);
      }
    },
    [room, isRoomUnlocked, unlockRoom]
  );

  const handleNavigate = useCallback(
    (targetId: string, transition: string) => {
      if (!isRoomUnlocked(targetId as RoomId)) return;
      setTransitionType(transition as "door" | "stairs" | "corridor" | "fade" | "parchment");
      setShowTransition(true);
      setTimeout(() => {
        navigate(`/room/${targetId}`);
      }, 1600);
    },
    [navigate, isRoomUnlocked]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy((e) => Math.min(100, e + 0.5));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0E0D0B" }}>
        <div className="text-center">
          <p className="font-cinzel text-lg mb-4 text-engraved">Room Not Found</p>
          <button
            onClick={() => navigate("/")}
            className="font-cormorant text-sm cursor-pointer transition-colors duration-500"
            style={{ color: "rgba(160,150,130,0.3)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(184,134,11,0.4)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(160,150,130,0.3)")}
          >
            Return to the Great Hall
          </button>
        </div>
      </div>
    );
  }

  const connections = room.connections.filter((c) => isRoomUnlocked(c.target));
  const lockedConnections = room.connections.filter((c) => !isRoomUnlocked(c.target));

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#0E0D0B" }}>
      {/* Room-specific atmospheric background */}
      <div className="absolute inset-0" style={{ background: room.colors.ambient }} />

      {/* Stone texture */}
      <div className="absolute inset-0 texture-stone" />

      {/* Atmospheric effects */}
      <EffectsRenderer effects={room.ambientEffects} />

      {/* Architectural shadows */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.4) 100%)" }} />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-32">
        {/* Room header */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 tracking-wide text-engraved">
            {room.name}
          </h1>
          <p className="font-cormorant text-sm sm:text-base italic" style={{ color: "rgba(160,150,130,0.25)" }}>
            {room.subtitle}
          </p>
        </motion.div>

        {/* Room description */}
        <motion.p
          className="text-center font-cormorant text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
          style={{ color: "rgba(160,150,130,0.35)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {room.description}
        </motion.p>

        {/* Room scene - architectural space */}
        <motion.div
          className="relative mx-auto max-w-3xl aspect-[4/3] rounded-sm overflow-hidden mb-8"
          style={{
            background: `linear-gradient(135deg, rgba(30,28,26,0.4), ${room.colors.surface}, rgba(20,18,16,0.5))`,
            border: "1px solid rgba(60,56,52,0.08)",
            boxShadow: "inset 0 0 60px rgba(0,0,0,0.3)",
          }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Interactive objects */}
          {room.interactiveElements.map((element) => (
            <InteractiveObject
              key={element.id}
              element={element}
              onInteract={handleInteraction}
            />
          ))}

          {/* Floor gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-[25%]" style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.4), transparent)" }} />
        </motion.div>

        {/* Secrets discovered */}
        {room.secrets.length > 0 && (
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <p className="font-cormorant text-xs italic" style={{ color: "rgba(100,95,88,0.2)" }}>
              Not all secrets reveal themselves to the casual observer...
            </p>
          </motion.div>
        )}

        {/* Enchanted book */}
        {room.quote && (
          <motion.div
            className="mb-8 flex justify-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            <button
              onClick={() => setShowBook(!showBook)}
              className="cursor-pointer group"
            >
              <div
                className="w-12 h-12 rounded-sm flex items-center justify-center transition-all duration-700"
                style={{
                  border: "1px solid rgba(60,56,52,0.1)",
                  background: "linear-gradient(135deg, rgba(61,43,31,0.15), rgba(42,29,20,0.2))",
                }}
              >
                <span className="text-sm" style={{ color: "rgba(160,150,130,0.3)" }}>\u25AC</span>
              </div>
              <p className="font-cormorant text-[10px] mt-1" style={{ color: "rgba(100,95,88,0.2)" }}>Enchanted Book</p>
            </button>
          </motion.div>
        )}

        {/* Navigation - connected rooms */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <p className="font-cinzel text-[10px] text-center mb-4 tracking-[0.2em] text-engraved">
            CONTINUE YOUR JOURNEY
          </p>

          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {connections.map((conn) => (
              <motion.button
                key={conn.target}
                className="group relative cursor-pointer px-4 py-2.5 rounded-sm transition-all duration-700"
                style={{
                  background: "linear-gradient(135deg, rgba(35,32,30,0.15), rgba(25,23,21,0.2))",
                  border: "1px solid rgba(60,56,52,0.1)",
                }}
                onClick={() => handleNavigate(conn.target, conn.transition)}
                whileHover={{
                  boxShadow: "0 2px 12px rgba(0,0,0,0.3), inset 0 0 15px rgba(212,175,55,0.02)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-cinzel text-[10px] tracking-wider text-engraved">
                  {rooms.find((r) => r.id === conn.target)?.icon} {conn.label}
                </span>
              </motion.button>
            ))}

            {lockedConnections.map((conn) => (
              <div
                key={conn.target}
                className="px-4 py-2.5 rounded-sm opacity-30"
                style={{
                  border: "1px solid rgba(60,56,52,0.05)",
                  background: "rgba(14,13,11,0.2)",
                }}
              >
                <span className="font-cinzel text-[10px] tracking-wider" style={{ color: "rgba(100,95,88,0.2)" }}>
                  \u25CB {conn.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quote */}
        {room.quote && (
          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            <p className="font-cormorant text-xs italic" style={{ color: "rgba(100,95,88,0.15)" }}>
              "{room.quote}"
            </p>
          </motion.div>
        )}
      </div>

      {/* Energy bar */}
      <div className="fixed bottom-4 right-4 z-40 w-24">
        <EnergyBar value={energy} max={100} label="Magic" />
      </div>

      {/* Secret reveal */}
      {showSecret && (() => {
        const secret = room.secrets.find((s) => s.id === showSecret);
        if (!secret) return null;
        return (
          <SecretReveal
            name={secret.name}
            description={secret.description}
            onClose={() => setShowSecret(null)}
          />
        );
      })()}

      {/* Enchanted book modal */}
      {showBook && room.quote && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(14,13,11,0.85)" }}
            onClick={() => setShowBook(false)}
          />
          <motion.div
            className="relative z-10 max-w-md w-full"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <EnchantedBook title={room.name} author="Hogwarts Library">
              <p className="italic">"{room.quote}"</p>
            </EnchantedBook>
            <button
              onClick={() => setShowBook(false)}
              className="mt-4 w-full py-2 rounded-sm cursor-pointer transition-all duration-500"
              style={{
                background: "linear-gradient(180deg, rgba(61,43,31,0.15), rgba(42,29,20,0.2))",
                border: "1px solid rgba(139,105,20,0.08)",
              }}
            >
              <span className="font-cinzel text-[10px] tracking-wider text-engraved">Close</span>
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* Cinematic transition */}
      <CinematicTransition
        show={showTransition}
        type={transitionType}
        onComplete={() => setShowTransition(false)}
      />
    </div>
  );
}
