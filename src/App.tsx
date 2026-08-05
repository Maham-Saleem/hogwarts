import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";

const Landing = lazy(() => import("./pages/Landing").then((m) => ({ default: m.Landing })));
const Hub = lazy(() => import("./pages/Hub").then((m) => ({ default: m.Hub })));
const Room = lazy(() => import("./pages/Room").then((m) => ({ default: m.Room })));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-abyss flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-pulse">✨</div>
        <p className="font-heading text-sm text-gold/60 tracking-[0.3em]">LOADING...</p>
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
