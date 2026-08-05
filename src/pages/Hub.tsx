import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { rooms } from "@/data/rooms";
import { useDiscovery } from "@/context/DiscoveryContext";
import { CastleMap } from "@/components/navigation/CastleMap";
import { OwlLetter } from "@/components/ui/OwlLetter";
import { EffectsRenderer } from "@/components/effects/EffectsRenderer";

export function Hub() {
  const navigate = useNavigate();
  const { isRoomUnlocked, unlockedRooms, visitedRooms } = useDiscovery();
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-abyss">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-abyss via-abyss to-surface/20" />
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-radial-gold opacity-30" />
        <EffectsRenderer effects={["floating-candles", "dust", "sparkles"]} />
      </div>
      <div className="fixed inset-0 z-[7] pointer-events-none bg-vignette" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
        {/* Welcome */}
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="font-heading text-3xl md:text-5xl text-gold tracking-[0.12em] mb-4"
            style={{ textShadow: "0 0 40px rgba(212,175,55,0.15)" }}>THE CASTLE AWAITS</h1>
          <p className="font-display text-lg md:text-xl text-moonlight/45 max-w-2xl mx-auto leading-relaxed">
            {unlockedRooms.length} of {rooms.length} chambers unlocked. Explore freely, discover hidden secrets, and uncover the mysteries within these ancient walls.
          </p>
        </motion.div>

        {/* Owl post */}
        <motion.div className="max-w-md mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <OwlLetter from="Minerva McGonagall" subject="Welcome to Hogwarts"
            body="Remember, curiosity is a powerful thing. The castle holds many secrets for those who seek them. Explore every corner, trust no locked door, and never stop asking questions."
            delay={0.5} />
        </motion.div>

        {/* Room grid */}
        <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 mb-16"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
          {rooms.map((room, i) => {
            const unlocked = isRoomUnlocked(room.id);
            const visited = visitedRooms.has(room.id);
            return (
              <motion.button key={room.id}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border transition-all duration-500"
                style={{
                  borderColor: unlocked ? `${room.colors.primary}20` : "rgba(100,100,100,0.1)",
                  background: unlocked
                    ? `linear-gradient(135deg, ${room.colors.ambient}, rgba(9,11,16,0.85))`
                    : "linear-gradient(135deg, rgba(15,15,20,0.5), rgba(9,11,16,0.9))",
                }}
                onClick={() => unlocked && navigate(`/explore/${room.id}`)}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i, duration: 0.5 }}
                whileHover={unlocked ? { scale: 1.03, y: -4, borderColor: `${room.colors.primary}40` } : undefined}
                whileTap={unlocked ? { scale: 0.98 } : undefined}>
                {/* Glow */}
                {unlocked && <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${room.colors.glow}, transparent 70%)` }} />}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                  {!unlocked && <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="text-xl opacity-40">🔒</span>
                  </div>}
                  <div className="text-2xl md:text-3xl mb-1.5">{room.icon}</div>
                  <h3 className="font-heading text-[10px] md:text-xs text-center tracking-wider transition-colors duration-300 leading-tight"
                    style={{ color: unlocked ? room.colors.primary : "rgba(201,205,211,0.25)" }}>{room.name}</h3>
                  <p className="font-display text-[8px] md:text-[10px] text-moonlight/25 mt-0.5">{room.subtitle}</p>
                  {visited && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-gold/50" />}
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Map CTA */}
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          <button onClick={() => setMapOpen(true)}
            className="group px-8 py-3 bg-gradient-to-b from-wood-light/50 to-wood/50 border border-brass/30 rounded-xl text-gold font-heading text-sm tracking-[0.2em] hover:from-wood-polish/20 transition-all duration-300 shadow-wood">
            <span className="mr-2">🗺️</span>OPEN CASTLE MAP
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div className="flex items-center justify-center gap-8 text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          {[
            { val: unlockedRooms.length, label: "Chambers" },
            { val: rooms.length - unlockedRooms.length, label: "Locked" },
            { val: visitedRooms.size, label: "Visited" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-heading text-2xl text-gold">{s.val}</div>
              <div className="font-display text-[10px] text-moonlight/35 tracking-wider">{s.label}</div>
            </div>
          )).reduce((acc, el, i) => { if (i > 0) acc.push(<div key={`d-${i}`} className="w-px h-8 bg-gold/10" />); acc.push(el); return acc; }, [] as React.ReactNode[])}
        </motion.div>
      </div>

      {mapOpen && <CastleMap onClose={() => setMapOpen(false)} />}
    </div>
  );
}
