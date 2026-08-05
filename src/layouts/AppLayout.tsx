import type { ReactNode } from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNav } from "./MobileNav";
import { Particles } from "@/components/animations/Particles";
import { Fog } from "@/components/animations/Fog";
import { LoadingScreen } from "@/components/animations/LoadingScreen";

export function AppLayout({ children }: { children?: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => window.localStorage.getItem("hogwarts.sidebar") === "collapsed");
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      window.localStorage.setItem("hogwarts.sidebar", next ? "collapsed" : "expanded");
      return next;
    });
  };

  return (
    <div className="relative min-h-screen">
      <LoadingScreen />
      <div className="pointer-events-none fixed inset-0" aria-hidden>
        <Particles count={20} />
        <Fog intensity={2} className="opacity-40" />
      </div>

      <Sidebar
        collapsed={collapsed}
        onToggle={toggleCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className={collapsed ? "min-h-screen transition-[padding] lg:pl-[72px]" : "min-h-screen transition-[padding] lg:pl-64"}>
        <div className="min-h-screen">
          <TopBar onOpenMobileNav={() => setMobileOpen(true)} />
          <main className="mx-auto max-w-[1400px] px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-10">
            {children ?? <Outlet />}
          </main>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}