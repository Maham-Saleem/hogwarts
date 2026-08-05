import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useDiscovery } from "@/context/DiscoveryContext";
import { rooms } from "@/data/rooms";
import { EffectsRenderer } from "@/components/effects/EffectsRenderer";
import { InteractiveObject } from "@/components/interactive/InteractiveObject";
import { SecretReveal } from "@/components/ui/SecretReveal";
import { EnchantedBook } from "@/components/ui/EnchantedBook";
import type { RoomId } from "@/types";

interface RoomViewProps {
  roomId: string;
  onNavigate: (roomId: string) => void;
  onReturnToHall: () => void;
}

export function RoomView({ roomId, onNavigate, onReturnToHall }: RoomViewProps) {
  const { visitRoom, isRoomUnlocked, unlockRoom } = useDiscovery();
  const room = rooms.find((r) => r.id === roomId);
  const [showSecret, setShowSecret] = useState<string | null>(null);
  const [showBook, setShowBook] = useState(false);

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

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-cinzel text-lg mb-4 text-engraved">Room Not Found</p>
          <button
            onClick={onReturnToHall}
            className="font-cinzel text-[10px] tracking-wider cursor-pointer text-engraved"
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
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Room atmosphere */}
      <div className="absolute inset-0" style={{ background: room.colors.ambient }} />
      <div className="absolute inset-0 texture-stone" />
      <EffectsRenderer effects={room.ambientEffects} />

      {/* Architectural shadows */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.35) 100%)",
      }} />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-16">
        {/* Room header */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <h1 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 tracking-wide text-engraved">
            {room.name}
          </h1>
          <p className="font-cormorant text-sm italic" style={{ color: "rgba(160,150,130,0.2)" }}>
            {room.subtitle}
          </p>
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-center font-cormorant text-sm sm:text-base max-w-xl mx-auto mb-6 leading-relaxed"
          style={{ color: "rgba(160,150,130,0.3)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1.5 }}
        >
          {room.description}
        </motion.p>

        {/* Room scene */}
        <motion.div
          className="relative w-full max-w-2xl aspect-[16/10] rounded-sm overflow-hidden mb-6"
          style={{
            background: `linear-gradient(135deg, rgba(25,23,21,0.35), ${room.colors.surface}, rgba(14,13,11,0.4))`,
            border: "1px solid rgba(55,50,45,0.06)",
            boxShadow: "inset 0 0 50px rgba(0,0,0,0.25)",
          }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
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
          <div className="absolute bottom-0 left-0 right-0 h-[20%]" style={{
            background: "linear-gradient(0deg, rgba(0,0,0,0.35), transparent)",
          }} />
        </motion.div>

        {/* Enchanted book */}
        {room.quote && (
          <motion.div
            className="mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <button
              onClick={() => setShowBook(true)}
              className="cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-sm flex items-center justify-center transition-all duration-700" style={{
                border: "1px solid rgba(55,50,45,0.08)",
                background: "linear-gradient(135deg, rgba(50,46,42,0.1), rgba(35,32,30,0.15))",
              }}>
                <span className="text-xs" style={{ color: "rgba(140,130,115,0.25)" }}>{'\u25AC'}</span>
              </div>
            </button>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1.5 }}
        >
          <p className="font-cinzel text-[9px] text-center mb-3 tracking-[0.25em] text-engraved">
            CONTINUE
          </p>
          <div className="flex flex-wrap justify-center gap-3 max-w-lg mx-auto">
            {/* Return to Great Hall */}
            <motion.button
              className="px-4 py-2 rounded-sm cursor-pointer"
              style={{
                background: "linear-gradient(135deg, rgba(25,23,21,0.12), rgba(18,16,14,0.18))",
                border: "1px solid rgba(55,50,45,0.08)",
              }}
              onClick={onReturnToHall}
              whileHover={{ borderColor: "rgba(80,75,68,0.15)" }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="font-cinzel text-[9px] tracking-wider text-engraved">
                {'\u25C0'} Great Hall
              </span>
            </motion.button>

            {/* Connected rooms */}
            {connections.map((conn) => (
              <motion.button
                key={conn.target}
                className="px-4 py-2 rounded-sm cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, rgba(25,23,21,0.12), rgba(18,16,14,0.18))",
                  border: "1px solid rgba(55,50,45,0.08)",
                }}
                onClick={() => onNavigate(conn.target)}
                whileHover={{ borderColor: "rgba(80,75,68,0.15)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-cinzel text-[9px] tracking-wider text-engraved">
                  {rooms.find((r) => r.id === conn.target)?.icon} {conn.label}
                </span>
              </motion.button>
            ))}

            {/* Locked */}
            {lockedConnections.map((conn) => (
              <div
                key={conn.target}
                className="px-4 py-2 rounded-sm opacity-25"
                style={{ border: "1px solid rgba(55,50,45,0.04)" }}
              >
                <span className="font-cinzel text-[9px] tracking-wider" style={{ color: "rgba(80,75,68,0.15)" }}>
                  {'\u25CB'} {conn.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quote */}
        {room.quote && (
          <motion.p
            className="text-center font-cormorant text-xs italic mt-4"
            style={{ color: "rgba(100,95,88,0.12)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            "{room.quote}"
          </motion.p>
        )}
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
          <div className="absolute inset-0" style={{ backgroundColor: "rgba(14,13,11,0.85)" }} onClick={() => setShowBook(false)} />
          <motion.div className="relative z-10 max-w-md w-full" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <EnchantedBook title={room.name} author="Hogwarts Library">
              <p className="italic">"{room.quote}"</p>
            </EnchantedBook>
            <button
              onClick={() => setShowBook(false)}
              className="mt-3 w-full py-2 rounded-sm cursor-pointer transition-all duration-500"
              style={{
                background: "linear-gradient(180deg, rgba(50,46,42,0.12), rgba(35,32,30,0.18))",
                border: "1px solid rgba(55,50,45,0.06)",
              }}
            >
              <span className="font-cinzel text-[9px] tracking-wider text-engraved">Close</span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
