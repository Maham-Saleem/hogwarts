import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronsLeft, LogOut, X } from "lucide-react";
import { cn } from "@/utils";
import { NAV_GROUPS, NAV_ITEMS } from "./navigation";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-3 px-5 py-5">
      <img src="/crest.svg" alt="Hogwarts crest" className="h-10 w-10 shrink-0" />
      {!collapsed && (
        <div className="min-w-0">
          <p className="truncate font-heading text-base leading-tight tracking-wide text-gold-300">HOGWARTS</p>
          <p className="truncate text-[11px] uppercase tracking-[0.2em] text-silver-500">Student Portal</p>
        </div>
      )}
    </div>
  );
}

function NavLinks({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  return (
    <nav className="scroll-thin flex-1 overflow-y-auto px-3 pb-4" aria-label="Primary">
      {NAV_GROUPS.map((group) => {
        const items = NAV_ITEMS.filter((i) => i.group === group);
        if (items.length === 0) return null;
        return (
          <div key={group} className="mb-4">
            {!collapsed && (
              <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-silver-600">{group}</p>
            )}
            <div className="space-y-0.5">
              {items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                      collapsed && "justify-center px-0",
                      isActive ? "text-gold-200" : "text-silver-500 hover:bg-ink-700/60 hover:text-beige-100"
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active"
                          className="absolute inset-0 rounded-xl border border-gold/25 bg-gradient-to-r from-gold/12 to-transparent"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-3">
                        <item.icon className={cn("h-[18px] w-[18px] shrink-0", isActive && "text-gold-400")} aria-hidden />
                        {!collapsed && <span className="relative z-10">{item.label}</span>}
                      </span>
                      {!collapsed && isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

function SidebarShell({ collapsed, onToggle, children }: { collapsed: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <>
      <div className="flex items-center gap-3 px-5 py-5">
        <img src="/crest.svg" alt="Hogwarts crest" className="h-10 w-10 shrink-0" />
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-heading text-base leading-tight tracking-wide text-gold-300">HOGWARTS</p>
            <p className="truncate text-[11px] uppercase tracking-[0.2em] text-silver-500">Student Portal</p>
          </div>
        )}
      </div>
      {children}
      <button
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="btn-focus mx-auto mb-4 hidden items-center gap-2 rounded-lg px-3 py-2 text-xs text-silver-500 transition hover:text-gold-300 lg:flex"
      >
        <ChevronsLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        {!collapsed && <span>Collapse</span>}
      </button>
    </>
  );
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth();

  const footer = (
    <div className="border-t border-silver/10 p-4">
      <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
        <Avatar initials={user.initials} house={user.house} size="sm" />
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-beige-100">{user.name}</p>
            <p className="truncate text-[11px] text-silver-500">{user.house}</p>
          </div>
        )}
        {!collapsed && (
          <button onClick={logout} aria-label="Log out" title="Log out" className="btn-focus rounded-lg p-1.5 text-silver-500 transition hover:text-wine-300">
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="glass fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-silver/10 lg:flex"
        aria-label="Sidebar"
      >
        <SidebarShell collapsed={collapsed} onToggle={onToggle}>
          <NavLinks collapsed={collapsed} />
          {footer}
        </SidebarShell>
      </motion.aside>

      {/* Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink-950/80 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              aria-hidden
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="glass-strong fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-gold/15 lg:hidden"
              aria-label="Sidebar"
            >
              <div className="flex items-center justify-between pr-4">
                <Brand collapsed={false} />
                <button onClick={onMobileClose} aria-label="Close menu" className="btn-focus rounded-lg p-1.5 text-silver-400 hover:text-beige-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <NavLinks collapsed={false} onNavigate={onMobileClose} />
              {footer}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}