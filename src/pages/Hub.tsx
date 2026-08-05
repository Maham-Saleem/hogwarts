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
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-abyss via-abyss to-surface/15" />
        <div className="absolute top-0 left-0 right-0 h-[400px] bg-radial-gold opacity-20" />
        <EffectsRenderer effects={["floating-candles", "dust"]} />
      </div>
      <div className="fixed inset-0 z-[7] pointer-events-none bg-vignette" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5, ease: "easeOut" }}>
          <h1 className="font-heading text-2xl md:text-4xl text-gold/70 tracking-[0.12em] mb-3"
            style={{ textShadow: "0 0 30px rgba(212,175,55,0.08)" }}>THE CASTLE AWAITS</h1>
          <p className="font-display text-base md:text-lg text-moonlight/35 max-w-xl mx-auto leading-relaxed">
            {unlockedRooms.length} of {rooms.length} chambers unlocked. Explore freely, discover hidden secrets.
          </p>
        </motion.div>

        <motion.div className="max-w-md mx-auto mb-14"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}>
          <OwlLetter from="Minerva McGonagall" subject="Welcome to Hogwarts"
            body="Remember, curiosity is a powerful thing. The castle holds many secrets for those who seek them. Explore every corner, trust no locked door, and never stop asking questions."
            delay={0.5} />
        </motion.div>

        <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-14"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}>
          {rooms.map((room, i) => {
            const unlocked = isRoomUnlocked(room.id);
            const visited = visitedRooms.has(room.id);
            return (
              <motion.button key={room.id}
                className="group relative aspect-[4/3] rounded-lg overflow-hidden border transition-all duration-700"
                style={{
                  borderColor: unlocked ? `${room.colors.primary}12` : "rgba(80,80,80,0.08)",
                  background: unlocked
                    ? `linear-gradient(135deg, ${room.colors.ambient}, rgba(9,11,16,0.9))`
                    : "linear-gradient(135deg, rgba(15,15,20,0.4), rgba(9,11,16,0.95))",
                }}
                onClick={() => unlocked && navigate(`/explore/${room.id}`)}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.06 * i, duration: 0.8 }}
                whileHover={unlocked ? { y: -2, borderColor: `${room.colors.primary}25` } : undefined}>
                {unlocked && <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${room.colors.glow}, transparent 70%)` }} />}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
                  {!unlocked && <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full border border-moonlight/15" />
                  </div>}
                  <div className="text-lg md:text-xl mb-1 opacity-50" style={{ color: unlocked ? room.colors.primary : "rgba(201,205,211,0.15)" }}>
                    {unlocked ? room.icon : "🔒"}
                  </div>
                  <h3 className="font-heading text-[9px] md:text-[10px] text-center tracking-wider transition-colors duration-700 leading-tight"
                    style={{ color: unlocked ? `${room.colors.primary}90` : "rgba(201,205,211,0.2)" }}>{room.name}</h3>
                  <p className="font-display text-[7px] md:text-[8px] text-moonlight/20 mt-0.5">{room.subtitle}</p>
                  {visited && <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-gold/30" />}
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        <motion.div className="text-center mb-14"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}>
          <button onClick={() => setMapOpen(true)}
            className="px-6 py-2.5 bg-gradient-to-b from-wood-light/35 to-wood/35 border border-brass/20 rounded-lg text-gold/60 font-heading text-xs tracking-[0.2em] hover:text-gold/80 hover:border-brass/30 transition-all duration-700">
            <span className="mr-1.5">🗺️</span>OPEN CASTLE MAP
          </button>
        </motion.div>

        <motion.div className="flex items-center justify-center gap-6 text-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}>
          {[{ val: unlockedRooms.length, label: "Chambers" }, { val: rooms.length - unlockedRooms.length, label: "Locked" }, { val: visitedRooms.size, label: "Visited" }]
            .flatMap((s, i) => i === 0 ? [{ ...s, key: s.label }] : [{ key: `d-${i}`, val: -1, label: "" }, { ...s, key: s.label }])
            .map((s) => s.val === -1 ? <div key={s.key} className="w-px h-6 bg-gold/8" /> : (
              <div key={s.key}>
                <div className="font-heading text-lg text-gold/50">{s.val}</div>
                <div className="font-display text-[8px] text-moonlight/25 tracking-wider">{s.label}</div>
              </div>
            ))}
        </motion.div>
      </div>

      {mapOpen && <CastleMap onClose={() => setMapOpen(false)} />}
    </div>
  );
}
