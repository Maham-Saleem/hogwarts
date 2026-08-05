import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AppLayout } from "@/layouts/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/ui/States";

const Login = lazy(() => import("@/pages/Login").then((m) => ({ default: m.Login })));
const Dashboard = lazy(() => import("@/pages/Dashboard").then((m) => ({ default: m.Dashboard })));
const Timetable = lazy(() => import("@/pages/Timetable").then((m) => ({ default: m.Timetable })));
const HouseCup = lazy(() => import("@/pages/HouseCup").then((m) => ({ default: m.HouseCup })));
const Grades = lazy(() => import("@/pages/Grades").then((m) => ({ default: m.Grades })));
const Homework = lazy(() => import("@/pages/Homework").then((m) => ({ default: m.Homework })));
const Library = lazy(() => import("@/pages/Library").then((m) => ({ default: m.Library })));
const OwlMail = lazy(() => import("@/pages/OwlMail").then((m) => ({ default: m.OwlMail })));
const Quidditch = lazy(() => import("@/pages/Quidditch").then((m) => ({ default: m.Quidditch })));
const CastleMap = lazy(() => import("@/pages/CastleMap").then((m) => ({ default: m.CastleMap })));
const Profile = lazy(() => import("@/pages/Profile").then((m) => ({ default: m.Profile })));
const Settings = lazy(() => import("@/pages/Settings").then((m) => ({ default: m.Settings })));
const NotFound = lazy(() => import("@/pages/NotFound").then((m) => ({ default: m.NotFound })));

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <LoadingState label="Conjuring the page…" />
    </div>
  );
}

function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <Protected>
              <AppLayout />
            </Protected>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/house-cup" element={<HouseCup />} />
          <Route path="/grades" element={<Grades />} />
          <Route path="/homework" element={<Homework />} />
          <Route path="/library" element={<Library />} />
          <Route path="/owl-mail" element={<OwlMail />} />
          <Route path="/quidditch" element={<Quidditch />} />
          <Route path="/castle-map" element={<CastleMap />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <AnimatedRoutes />
    </Suspense>
  );
}