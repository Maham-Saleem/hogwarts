import { useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CastleMap } from "@/components/navigation/CastleMap";
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
      {/* Top bar */}
      <motion.header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-8 py-3"
        style={{ background: "linear-gradient(180deg, rgba(9,11,16,0.85), rgba(9,11,16,0.6))", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(212,175,55,0.08)" }}
        initial={{ y: -60 }} animate={{ y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
        <button onClick={() => navigate("/")}
          className="font-heading text-xs md:text-sm text-gold/70 hover:text-gold transition-colors tracking-[0.2em]">EXPLORE HOGWARTS</button>
        <div className="flex items-center gap-2.5">
          {inventory.length > 0 && (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-moonlight/40">
              <span>🎒</span><span>{inventory.length}</span>
            </div>
          )}
          <button onClick={openMap}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface/50 border border-gold/12 rounded-lg text-[10px] text-moonlight/60 hover:text-gold hover:border-gold/25 transition-all font-heading">
            <span>🗝️</span>{discoveredCount}/{totalSecrets}
          </button>
          <button onClick={openMap}
            className="px-2.5 py-1.5 bg-gradient-to-b from-wood-light/30 to-wood/30 border border-brass/20 rounded-lg text-[10px] text-gold font-heading tracking-wider hover:from-wood-polish/15 transition-all">🗺️ Map</button>
          <button onClick={toggleMute}
            className="w-7 h-7 rounded-full bg-surface/50 border border-gold/12 text-moonlight/45 hover:text-gold transition-colors flex items-center justify-center text-xs">
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </motion.header>
      {mapOpen && <CastleMap onClose={closeMap} />}
      <main className="pt-14"><Outlet /></main>
      <ProgressTracker />
      {/* Mobile bottom nav */}
      <motion.nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
        style={{ background: "linear-gradient(0deg, rgba(9,11,16,0.9), rgba(9,11,16,0.7))", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(212,175,55,0.08)" }}
        initial={{ y: 60 }} animate={{ y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
        <div className="flex items-center justify-around py-2">
          <button onClick={() => navigate("/")} className="flex flex-col items-center gap-0.5 text-[10px] text-moonlight/45 hover:text-gold transition-colors">
            <span className="text-base">🏠</span><span>Home</span>
          </button>
          <button onClick={openMap} className="flex flex-col items-center gap-0.5 text-[10px] text-moonlight/45 hover:text-gold transition-colors">
            <span className="text-base">🗺️</span><span>Map</span>
          </button>
          <button onClick={toggleMute} className="flex flex-col items-center gap-0.5 text-[10px] text-moonlight/45 hover:text-gold transition-colors">
            <span className="text-base">{muted ? "🔇" : "🔊"}</span><span>Sound</span>
          </button>
        </div>
      </motion.nav>
    </div>
  );
}
