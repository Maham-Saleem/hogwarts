import { lazy, Suspense, useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AudioProvider } from "@/context/AudioContext";
import { DiscoveryProvider } from "@/context/DiscoveryContext";
import { AppLayout } from "@/layouts/AppLayout";

const Landing = lazy(() => import("@/pages/Landing"));
const Hub = lazy(() => import("@/pages/Hub"));
const Room = lazy(() => import("@/pages/Room"));
const CastleMap = lazy(() => import("@/components/navigation/CastleMap"));

function LoadingScreen() {
  return (
    <div className="min-h-screen w-full bg-[#090B10] flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="w-10 h-10 rounded-full border border-gold/20 mx-auto mb-4"
          style={{ borderTopColor: "rgba(212,175,55,0.4)" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <p className="font-cormorant text-moonlight/30 text-sm italic">Loading...</p>
      </motion.div>
    </div>
  );
}

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<LoadingScreen />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
          <Route element={<AppLayout />}>
            <Route path="/hub" element={<PageTransition><Hub /></PageTransition>} />
            <Route path="/room/:roomId" element={<PageTransition><Room /></PageTransition>} />
            <Route path="/map" element={<PageTransition><CastleMap /></PageTransition>} />
          </Route>
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!loaded) return <LoadingScreen />;

  return (
    <AudioProvider>
      <DiscoveryProvider>
        <AnimatedRoutes />
      </DiscoveryProvider>
    </AudioProvider>
  );
}
