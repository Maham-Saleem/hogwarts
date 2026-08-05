import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils";
import { BOTTOM_NAV } from "./navigation";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/ui/Avatar";
import { Castle } from "lucide-react";
import { useState } from "react";

function MobileSheet({ onClose }: { onClose: () => void }) {
  const { user } = useAuth();
  const { notificationsUnread } = useData();
  return (
    <motion.div
      className="fixed inset-0 z-[60] lg:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-ink-950/85 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 34 }}
        className="glass-strong absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-gold/15 p-6 pb-10"
      >
        <div className="mx-auto mb-6 h-1 w-12 rounded-full bg-silver/20" aria-hidden />
        <div className="mb-6 flex items-center gap-3">
          <Avatar initials={user.initials} house={user.house} size="lg" />
          <div>
            <p className="font-heading text-lg text-beige-100">{user.name}</p>
            <p className="text-xs text-silver-500">{user.title} · Year {user.year}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Profile", to: "/profile", icon: Castle },
            { label: "Settings", to: "/settings", icon: Castle },
          ].map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={onClose}
              className="btn-focus flex items-center gap-2 rounded-xl border border-silver/15 bg-ink-800/70 px-4 py-3 text-sm text-beige-100 transition hover:border-gold/40"
            >
              <l.icon className="h-4 w-4 text-gold-400" />
              {l.label}
            </NavLink>
          ))}
        </div>
        {notificationsUnread > 0 && (
          <p className="mt-6 text-center text-xs text-silver-500">{notificationsUnread} unread notification{notificationsUnread > 1 ? "s" : ""}</p>
        )}
      </motion.div>
    </motion.div>
  );
}

export function MobileNav() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { notificationsUnread } = useData();

  return (
    <>
      <nav
        aria-label="Bottom"
        className="glass fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-gold/15 px-2 pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {BOTTOM_NAV.map((item) => {
          const isHome = item.to === "/castle-map";
          return isHome ? (
            <button
              key={item.to}
              onClick={() => setSheetOpen(true)}
              aria-label={item.label}
              className="btn-focus flex flex-1 flex-col items-center gap-1 py-2 text-[10px] text-silver-500 transition hover:text-gold-300"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "btn-focus relative flex flex-1 flex-col items-center gap-1 py-2 text-[10px] transition",
                  isActive ? "text-gold-300" : "text-silver-500 hover:text-beige-200"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative">
                    <item.icon className="h-5 w-5" />
                    {item.label === "Mail" && notificationsUnread > 0 && (
                      <span className="absolute -right-2 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-wine-400 px-0.5 text-[8px] font-bold text-beige-100">
                        {notificationsUnread}
                      </span>
                    )}
                  </span>
                  {isActive && <span className="absolute -top-px h-0.5 w-6 rounded-full bg-gold-400" />}
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      <AnimatePresence>
        {sheetOpen && <MobileSheet onClose={() => setSheetOpen(false)} />}
      </AnimatePresence>
    </>
  );
}