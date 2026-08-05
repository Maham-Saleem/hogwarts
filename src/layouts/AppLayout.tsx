import { useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CastleMap from "@/components/navigation/CastleMap";
import { ProgressTracker } from "@/components/ui/ProgressTracker";
import { useAudio } from "@/context/AudioContext";
import { useDiscovery } from "@/context/DiscoveryContext";

export function AppLayout() {
  const [mapOpen, setMapOpen] = useState(false);
  const navigate = useNavigate();
  const { muted, toggleMute } = useAudio();
  const { discoveredCount, totalSecrets, inventory } = useDiscovery();
  const openMap = useCallback(() => setMapOpen(true), []);
  const closeMap = useCallback(() => setMapOpen(false), []);

  return (
    <div className="min-h-screen bg-abyss text-moonlight font-body">
      <motion.header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-8 py-3"
        style={{ background: "linear-gradient(180deg, rgba(9,11,16,0.8), rgba(9,11,16,0.5))", backdropFilter: "blur(10px)", borderBottom: "0.5px solid rgba(212,175,55,0.05)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
        <button onClick={() => navigate("/")}
          className="font-heading text-[10px] md:text-xs text-gold/50 hover:text-gold/70 transition-colors duration-500 tracking-[0.2em]">EXPLORE HOGWARTS</button>
        <div className="flex items-center gap-2">
          {inventory.length > 0 && (
            <div className="hidden md:flex items-center gap-1 text-[10px] text-moonlight/30">
              <span className="opacity-40">🎒</span><span>{inventory.length}</span>
            </div>
          )}
          <button onClick={openMap}
            className="flex items-center gap-1 px-2 py-1 bg-surface/40 border border-gold/8 rounded text-[9px] text-moonlight/45 hover:text-gold/60 hover:border-gold/15 transition-all duration-500 font-heading">
            <span className="opacity-50">🗝️</span>{discoveredCount}/{totalSecrets}
          </button>
          <button onClick={openMap}
            className="px-2 py-1 bg-gradient-to-b from-wood-light/20 to-wood/20 border border-brass/12 rounded text-[9px] text-gold/50 font-heading tracking-wider hover:text-gold/70 transition-all duration-500">🗺️ Map</button>
          <button onClick={toggleMute}
            className="w-6 h-6 rounded-full bg-surface/40 border border-gold/8 text-moonlight/35 hover:text-moonlight/60 transition-colors duration-500 flex items-center justify-center text-[10px]">
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </motion.header>
      {mapOpen && <CastleMap onClose={closeMap} />}
      <main className="pt-14"><Outlet /></main>
      <ProgressTracker />
      <motion.nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
        style={{ background: "linear-gradient(0deg, rgba(9,11,16,0.85), rgba(9,11,16,0.5))", backdropFilter: "blur(10px)", borderTop: "0.5px solid rgba(212,175,55,0.05)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 1 }}>
        <div className="flex items-center justify-around py-2">
          <button onClick={() => navigate("/")} className="flex flex-col items-center gap-0.5 text-[9px] text-moonlight/35 hover:text-moonlight/60 transition-colors duration-500">
            <span className="text-sm opacity-50">🏠</span><span>Home</span>
          </button>
          <button onClick={openMap} className="flex flex-col items-center gap-0.5 text-[9px] text-moonlight/35 hover:text-moonlight/60 transition-colors duration-500">
            <span className="text-sm opacity-50">🗺️</span><span>Map</span>
          </button>
          <button onClick={toggleMute} className="flex flex-col items-center gap-0.5 text-[9px] text-moonlight/35 hover:text-moonlight/60 transition-colors duration-500">
            <span className="text-sm opacity-50">{muted ? "🔇" : "🔊"}</span><span>Sound</span>
          </button>
        </div>
      </motion.nav>
    </div>
  );
}
