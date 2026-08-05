import { Bell, Menu, Search, Eye, Mail, StickyNote, Sparkles, CalendarDays, Megaphone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dropdown, DropdownItem } from "@/components/ui/Dropdown";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { formatRelative } from "@/utils";
import type { Notification } from "@/types";

const TYPE_ICON = {
  grade: <Eye className="h-4 w-4" />,
  mail: <Mail className="h-4 w-4" />,
  event: <CalendarDays className="h-4 w-4" />,
  homework: <StickyNote className="h-4 w-4" />,
  system: <Sparkles className="h-4 w-4" />,
};

export function TopBar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { user, logout } = useAuth();
  const { notifications, markNotificationsRead, notificationsUnread } = useData();
  const navigate = useNavigate();

  const unread = notifications.filter((n) => !n.read);

  return (
    <header className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-silver/10 px-4 sm:px-6">
      <button
        onClick={onOpenMobileNav}
        aria-label="Open menu"
        className="btn-focus rounded-lg p-2 text-silver-400 transition hover:bg-ink-700 hover:text-beige-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <button
        className="btn-focus hidden items-center gap-2 rounded-full border border-silver/15 bg-ink-900/50 px-4 py-2 text-sm text-silver-500 transition hover:border-gold/40 hover:text-beige-200 sm:flex sm:w-64"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search the castle…</span>
        <kbd className="rounded border border-silver/15 bg-ink-700 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <Dropdown
          trigger={
            <span className="relative rounded-lg p-2 text-silver-400 transition hover:bg-ink-700 hover:text-beige-100">
              <Bell className="h-5 w-5" />
              {notificationsUnread > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine-400 px-1 text-[10px] font-bold text-beige-100">
                  {notificationsUnread}
                </span>
              )}
            </span>
          }
          menuClassName="w-80 p-0"
        >
          {(close) => (
            <>
              <div className="flex items-center justify-between border-b border-silver/10 px-4 py-3">
                <p className="font-heading text-sm text-beige-100">Notifications</p>
                <button
                  onClick={markNotificationsRead}
                  className="btn-focus text-xs text-gold-300 transition hover:text-gold-200"
                >
                  Mark all read
                </button>
              </div>
              <div className="scroll-thin max-h-80 overflow-y-auto">
                {unread.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-silver-500">
                    <Megaphone className="mx-auto mb-2 h-6 w-6 opacity-40" />
                    All caught up, witch.
                  </div>
                )}
                {unread.slice(0, 6).map((n: Notification) => (
                  <button
                    key={n.id}
                    onClick={() => { markNotificationsRead(); close(); }}
                    className="flex w-full items-start gap-3 border-b border-silver/5 px-4 py-3 text-left transition hover:bg-ink-700/50"
                  >
                    <span className="mt-0.5 shrink-0 text-gold-400">{TYPE_ICON[n.type]}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-beige-100">{n.title}</span>
                      <span className="mt-0.5 block text-xs text-silver-500">{n.body}</span>
                      <span className="mt-1 block text-[10px] text-silver-600">{formatRelative(new Date(Date.now() - n.time * 60000))}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </Dropdown>

        {/* User menu */}
        <Dropdown
          trigger={
            <span className="flex items-center gap-2 rounded-full p-1 transition hover:bg-ink-700/60">
              <Avatar initials={user.initials} house={user.house} size="sm" />
              <span className="hidden text-left sm:block">
                <span className="block text-xs font-medium leading-tight text-beige-100">{user.name}</span>
                <span className="block text-[10px] leading-tight text-silver-500">{user.title}</span>
              </span>
            </span>
          }
          menuClassName="w-56"
        >
          {(close) => (
            <>
              <DropdownItem onClick={() => { navigate("/profile"); close(); }} icon={<motion.span animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="text-gold-400"><Sparkles className="h-4 w-4" /></motion.span>}>My Profile</DropdownItem>
              <DropdownItem onClick={() => { navigate("/settings"); close(); }}>Settings</DropdownItem>
              <div className="my-1 border-t border-silver/10" />
              <DropdownItem danger onClick={() => { logout(); close(); }} icon={<LogoutIcon />}>
                Log out
              </DropdownItem>
            </>
          )}
        </Dropdown>
      </div>
    </header>
  );
}

function LogoutIcon() {
  return <Sparkles className="h-4 w-4" />;
}