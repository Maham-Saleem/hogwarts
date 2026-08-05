import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { rooms } from "@/data/rooms";
import { useDiscovery } from "@/context/DiscoveryContext";
import { CastleMap } from "@/components/navigation/CastleMap";

export function Hub() {
  const navigate = useNavigate();
  const { isRoomUnlocked, unlockedRooms } = useDiscovery();
  const [mapOpen, setMapOpen] = useState(false);

  const unlockedCount = unlockedRooms.length;
  const totalRooms = rooms.length;

  return (
    <div className="relative min-h-screen bg-abyss">
      {/* Ambient background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-abyss via-abyss to-surface/30" />
        <div className="absolute top-0 left-0 right-0 h-96 bg-radial-gold opacity-40" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
        {/* Welcome */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-heading text-3xl md:text-5xl text-gold tracking-[0.15em] mb-4">
            THE CASTLE AWAITS
          </h1>
          <p className="font-display text-lg md:text-xl text-moonlight/50 max-w-2xl mx-auto">
            {unlockedCount} of {totalRooms} chambers unlocked. Explore freely, discover hidden secrets, and uncover the mysteries within these ancient walls.
          </p>
        </motion.div>

        {/* Quick access grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {rooms.slice(0, 8).map((room, i) => {
            const unlocked = isRoomUnlocked(room.id);
            return (
              <motion.button
                key={room.id}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-gold/10 hover:border-gold/30 transition-all duration-500"
                style={{
                  background: unlocked
                    ? `linear-gradient(135deg, ${room.colors.ambient}, rgba(9,11,16,0.9))`
                    : "linear-gradient(135deg, rgba(20,20,25,0.5), rgba(9,11,16,0.9))",
                }}
                onClick={() => unlocked && navigate(`/explore/${room.id}`)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                whileHover={unlocked ? { scale: 1.03, y: -4 } : undefined}
                whileTap={unlocked ? { scale: 0.98 } : undefined}
              >
                {/* Glow on hover */}
                {unlocked && (
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${room.colors.glow}, transparent 70%)`,
                    }}
                  />
                )}

                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  {!unlocked && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="text-2xl opacity-50">🔒</span>
                    </div>
                  )}
                  <div className="text-3xl md:text-4xl mb-2">{unlocked ? "🏰" : "🔒"}</div>
                  <h3
                    className="font-heading text-xs md:text-sm text-center tracking-wider transition-colors duration-300"
                    style={{ color: unlocked ? room.colors.primary : "rgba(201,205,211,0.3)" }}
                  >
                    {room.name}
                  </h3>
                  <p className="font-display text-[10px] md:text-xs text-moonlight/30 mt-1">
                    {room.subtitle}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Map CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button
            onClick={() => setMapOpen(true)}
            className="group px-8 py-3 bg-gold/10 border border-gold/30 rounded-xl text-gold font-heading text-sm tracking-[0.2em] hover:bg-gold/20 hover:border-gold/50 transition-all duration-300"
          >
            <span className="mr-2">🗺️</span>
            OPEN CASTLE MAP
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-16 flex items-center justify-center gap-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div>
            <div className="font-heading text-2xl text-gold">{unlockedCount}</div>
            <div className="font-display text-xs text-moonlight/40">Chambers</div>
          </div>
          <div className="w-px h-8 bg-gold/10" />
          <div>
            <div className="font-heading text-2xl text-gold">{totalRooms - unlockedCount}</div>
            <div className="font-display text-xs text-moonlight/40">Locked</div>
          </div>
          <div className="w-px h-8 bg-gold/10" />
          <div>
            <div className="font-heading text-2xl text-gold">∞</div>
            <div className="font-display text-xs text-moonlight/40">Secrets</div>
          </div>
        </motion.div>
      </div>

      {mapOpen && <CastleMap onClose={() => setMapOpen(false)} />}
    </div>
  );
}
