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

const sparklePositions = Array.from({ length: 25 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 12,
  duration: 3 + Math.random() * 4,
}));

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

  const [discoveredSecrets] = useState<Set<string>>(new Set());

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
      const targetRoom = rooms.find((r) => r.id === targetId);
      if (!targetRoom) return;
      if (!isRoomUnlocked(targetId as RoomId)) {
        return;
      }
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
      <div className="min-h-screen bg-[#090B10] flex items-center justify-center">
        <div className="text-center">
          <p className="font-cinzel text-gold text-xl mb-4">Room Not Found</p>
          <button
            onClick={() => navigate("/")}
            className="font-cormorant text-moonlight/60 hover:text-gold transition-colors"
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
    <div className="relative min-h-screen w-full bg-[#090B10] overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0" style={{ background: room.colors.ambient }} />

      {/* Glow effects */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[150px] pointer-events-none"
        style={{ background: `radial-gradient(circle, ${room.colors.glow}, transparent)` }}
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Effects */}
      <EffectsRenderer effects={room.ambientEffects} />

      {/* Sparkles */}
      {sparklePositions.map((s) => (
        <motion.div
          key={s.id}
          className="absolute w-[2px] h-[2px] rounded-full pointer-events-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            backgroundColor: room.colors.primary,
          }}
          animate={{ opacity: [0, 0.5, 0], scale: [0, 1, 0] }}
          transition={{ duration: s.duration, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-32">
        {/* Room header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        >
          <motion.div
            className="text-4xl mb-3"
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            {room.icon}
          </motion.div>
          <h1 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl text-gold font-bold mb-1 tracking-wide">
            {room.name}
          </h1>
          <p className="font-cormorant text-base sm:text-lg text-moonlight/50 italic">
            {room.subtitle}
          </p>
        </motion.div>

        {/* Room description */}
        <motion.p
          className="text-center font-cormorant text-lg text-moonlight/60 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {room.description}
        </motion.p>

        {/* Interactive room scene */}
        <motion.div
          className="relative mx-auto max-w-3xl aspect-[4/3] rounded-xl overflow-hidden border border-gold/10 mb-10"
          style={{
            background: `linear-gradient(135deg, rgba(9,11,16,0.9), ${room.colors.surface}, rgba(9,11,16,0.8))`,
          }}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Interactive objects */}
          {room.interactiveElements.map((element) => (
            <InteractiveObject
              key={element.id}
              element={element}
              onInteract={handleInteraction}
            />
          ))}

          {/* Ambient gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090B10]/40 to-transparent pointer-events-none" />
        </motion.div>

        {/* Secrets discovered */}
        {discoveredSecrets.size > 0 && (
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-cinzel text-xs text-gold/40 uppercase tracking-widest text-center mb-3">
              Secrets Discovered
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {room.secrets.filter((s) => discoveredSecrets.has(s.id)).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setShowSecret(s.id)}
                  className="px-3 py-1.5 rounded-lg border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-all cursor-pointer"
                >
                  <span className="font-cormorant text-gold/80 text-sm">{s.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Secret hints */}
        {room.secrets.length > discoveredSecrets.size && (
          <motion.div
            className="mb-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <p className="font-cormorant text-sm text-moonlight/25 italic max-w-md mx-auto">
              "Not all secrets reveal themselves to the casual observer..."
            </p>
          </motion.div>
        )}

        {/* Enchanted book */}
        {room.quote && (
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            <button
              onClick={() => setShowBook(!showBook)}
              className="mx-auto block cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-lg border border-gold/15 bg-gold/5 flex items-center justify-center group-hover:border-gold/30 group-hover:bg-gold/10 transition-all">
                <span className="text-xl">📖</span>
              </div>
              <p className="font-cormorant text-xs text-moonlight/30 mt-1">Enchanted Book</p>
            </button>
          </motion.div>
        )}

        {/* Navigation */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <p className="font-cinzel text-xs text-gold/40 uppercase tracking-widest text-center mb-4">
            Continue Your Journey
          </p>

          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            {connections.map((conn) => (
              <motion.button
                key={conn.target}
                className="group relative cursor-pointer"
                onClick={() => handleNavigate(conn.target, conn.transition)}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="px-5 py-3 rounded-lg border border-gold/15 bg-gold/5 group-hover:border-gold/30 group-hover:bg-gold/10 transition-all">
                  <span className="font-cinzel text-xs text-gold/70 group-hover:text-gold transition-colors">
                    {rooms.find((r) => r.id === conn.target)?.icon} {conn.label}
                  </span>
                </div>
              </motion.button>
            ))}

            {lockedConnections.map((conn) => (
              <div
                key={conn.target}
                className="px-5 py-3 rounded-lg border border-moonlight/5 bg-moonlight/[0.02] opacity-40"
              >
                <span className="font-cinzel text-xs text-moonlight/30">
                  🔒 {conn.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quote */}
        {room.quote && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
          >
            <p className="font-cormorant text-sm text-moonlight/20 italic">
              "{room.quote}"
            </p>
          </motion.div>
        )}
      </div>

      {/* UI elements */}
      <EnergyBar value={energy} max={100} label="Magic" />

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

      {showBook && room.quote && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-abyss/80 backdrop-blur-sm"
            onClick={() => setShowBook(false)}
          />
          <motion.div
            className="relative z-10 max-w-md w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <EnchantedBook title={room.name} author="Hogwarts Library">
              <p className="italic">"{room.quote}"</p>
            </EnchantedBook>
            <button
              onClick={() => setShowBook(false)}
              className="mt-4 w-full py-2 rounded-sm border border-gold/15 bg-gold/5 hover:bg-gold/10 transition-all"
            >
              <span className="font-cinzel text-gold/60 text-xs tracking-wider">Close</span>
            </button>
          </motion.div>
        </motion.div>
      )}

      <CinematicTransition
        show={showTransition}
        type={transitionType}
        onComplete={() => setShowTransition(false)}
      />
    </div>
  );
}
