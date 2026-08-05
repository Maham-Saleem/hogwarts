import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { motion } from "framer-motion";
import { AppLayout } from "@/layouts/AppLayout";

const Landing = lazy(() => import("./pages/Landing").then((m) => ({ default: m.Landing })));
const Hub = lazy(() => import("./pages/Hub").then((m) => ({ default: m.Hub })));
const Room = lazy(() => import("./pages/Room").then((m) => ({ default: m.Room })));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-abyss flex items-center justify-center">
      <div className="text-center">
        <motion.div className="w-6 h-6 mx-auto mb-4 rounded-full border border-gold/20"
          style={{ borderTopColor: "rgba(212,175,55,0.4)" }}
          animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
        <p className="font-heading text-[10px] text-gold/30 tracking-[0.3em]">ENTERING...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<AppLayout />}>
          <Route path="/hub" element={<Hub />} />
          <Route path="/explore/:roomId" element={<Room />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
