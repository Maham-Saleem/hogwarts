import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AudioProvider } from "@/context/AudioContext";
import { DiscoveryProvider } from "@/context/DiscoveryContext";
import { CastleFrame } from "@/components/castle/CastleFrame";
import { Landing } from "@/components/castle/Landing";
import { GreatHall } from "@/components/castle/GreatHall";
import { RoomView } from "@/components/castle/RoomView";
import { EnchantedMap } from "@/components/castle/EnchantedMap";

export type CastleLocation =
  | { type: "approach" }
  | { type: "hall" }
  | { type: "room"; roomId: string }
  | { type: "map" };

export default function App() {
  const [location, setLocation] = useState<CastleLocation>({ type: "approach" });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateTo = useCallback((target: CastleLocation) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    // The camera movement happens via CastleFrame
    setTimeout(() => {
      setLocation(target);
      setTimeout(() => setIsTransitioning(false), 800);
    }, 600);
  }, [isTransitioning]);

  return (
    <AudioProvider>
      <DiscoveryProvider>
        <div className="min-h-screen w-full overflow-hidden" style={{ backgroundColor: "#0E0D0B" }}>
          {/* Persistent castle architecture */}
          <CastleFrame location={location}>
            <AnimatePresence mode="wait">
              {location.type === "approach" && (
                <motion.div
                  key="approach"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="absolute inset-0"
                >
                  <Landing onComplete={() => navigateTo({ type: "hall" })} />
                </motion.div>
              )}

              {location.type === "hall" && (
                <motion.div
                  key="hall"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2 }}
                  className="absolute inset-0"
                >
                  <GreatHall
                    onNavigate={(roomId) => navigateTo({ type: "room", roomId })}
                    onOpenMap={() => navigateTo({ type: "map" })}
                  />
                </motion.div>
              )}

              {location.type === "room" && (
                <motion.div
                  key={`room-${location.roomId}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2 }}
                  className="absolute inset-0"
                >
                  <RoomView
                    roomId={location.roomId}
                    onNavigate={(roomId) => navigateTo({ type: "room", roomId })}
                    onReturnToHall={() => navigateTo({ type: "hall" })}
                  />
                </motion.div>
              )}

              {location.type === "map" && (
                <motion.div
                  key="map"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0"
                >
                  <EnchantedMap
                    onSelectRoom={(roomId) => navigateTo({ type: "room", roomId })}
                    onClose={() => navigateTo({ type: "hall" })}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </CastleFrame>

          {/* Camera transition overlay */}
          <AnimatePresence>
            {isTransitioning && (
              <motion.div
                className="fixed inset-0 z-[9999] pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="absolute inset-0" style={{ backgroundColor: "rgba(14,13,11,0.95)" }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DiscoveryProvider>
    </AudioProvider>
  );
}
