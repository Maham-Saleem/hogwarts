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
      <motion.header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-8 py-3 bg-abyss/60 backdrop-blur-md border-b border-gold/10"
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <button
          onClick={() => navigate("/")}
          className="font-heading text-sm md:text-base text-gold/80 hover:text-gold transition-colors tracking-widest"
        >
          EXPLORE HOGWARTS
        </button>

        <div className="flex items-center gap-3">
          {/* Inventory */}
          {inventory.length > 0 && (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-moonlight/50">
              <span>🎒</span>
              <span>{inventory.length}</span>
            </div>
          )}

          {/* Secrets counter */}
          <button
            onClick={openMap}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface/60 border border-gold/15 rounded-lg text-xs text-moonlight/70 hover:text-gold hover:border-gold/30 transition-all"
          >
            <span>🗝️</span>
            <span className="font-heading">{discoveredCount}/{totalSecrets}</span>
          </button>

          {/* Map button */}
          <button
            onClick={openMap}
            className="px-3 py-1.5 bg-gold/10 border border-gold/30 rounded-lg text-xs text-gold font-body hover:bg-gold/20 transition-all"
          >
            🗺️ Map
          </button>

          {/* Mute */}
          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-full bg-surface/60 border border-gold/15 text-moonlight/50 hover:text-gold transition-colors flex items-center justify-center text-sm"
          >
            {muted ? "🔇" : "🔊"}
          </button>
        </div>
      </motion.header>

      {/* Map overlay */}
      {mapOpen && <CastleMap onClose={closeMap} />}

      {/* Main content */}
      <main className="pt-14">
        <Outlet />
      </main>

      {/* Progress tracker */}
      <ProgressTracker />

      {/* Bottom nav for mobile */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-abyss/80 backdrop-blur-md border-t border-gold/10"
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => navigate("/")}
            className="flex flex-col items-center gap-0.5 text-xs text-moonlight/50 hover:text-gold transition-colors"
          >
            <span className="text-lg">🏠</span>
            <span>Home</span>
          </button>
          <button
            onClick={openMap}
            className="flex flex-col items-center gap-0.5 text-xs text-moonlight/50 hover:text-gold transition-colors"
          >
            <span className="text-lg">🗺️</span>
            <span>Map</span>
          </button>
          <button
            onClick={toggleMute}
            className="flex flex-col items-center gap-0.5 text-xs text-moonlight/50 hover:text-gold transition-colors"
          >
            <span className="text-lg">{muted ? "🔇" : "🔊"}</span>
            <span>Sound</span>
          </button>
        </div>
      </motion.nav>
    </div>
  );
}
