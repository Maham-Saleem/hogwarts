import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type {
  Announcement,
  Assignment,
  Book,
  Event,
  Message,
  Notification,
} from "@/types";
import {
  announcements,
  books as initialBooks,
  calendarEvents,
  events,
  initialAssignments,
  initialMessages,
  initialNotifications,
  quotes,
  weather,
} from "@/data/mock";

interface DataContextValue {
  loading: boolean;
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  books: Book[];
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  notifications: Notification[];
  markNotificationsRead: () => void;
  notificationsUnread: number;
  announcements: Announcement[];
  events: Event[];
  calendarEvents: typeof calendarEvents;
  quotes: typeof quotes;
  weather: typeof weather;
  toggleBookmark: (id: string) => void;
  toggleBorrow: (id: string) => void;
}

const DataContext = createContext<DataContextValue | null>(null);

function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }, [key, value]);
  return [value, setValue] as const;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = usePersisted<Assignment[]>(
    "hogwarts.assignments",
    initialAssignments
  );
  const [messages, setMessages] = usePersisted<Message[]>("hogwarts.messages", initialMessages);
  const [books, setBooks] = usePersisted<Book[]>("hogwarts.books", initialBooks);
  const [notifications, setNotifications] = usePersisted<Notification[]>(
    "hogwarts.notifications",
    initialNotifications
  );

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(t);
  }, []);

  const markNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, [setNotifications]);

  const notificationsUnread = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const toggleBookmark = useCallback(
    (id: string) => {
      setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, bookmarked: !b.bookmarked } : b)));
    },
    [setBooks]
  );

  const toggleBorrow = useCallback(
    (id: string) => {
      setBooks((prev) =>
        prev.map((b) => {
          if (b.id !== id) return b;
          const now = new Date();
          const due = new Date(now);
          due.setDate(due.getDate() + 14);
          return {
            ...b,
            borrowed: !b.borrowed,
            dueDate: !b.borrowed ? due.toISOString().slice(0, 10) : undefined,
            progress: !b.borrowed ? 0 : b.progress,
            borrowHistory: [
              { date: now.toISOString().slice(0, 10), action: !b.borrowed ? "Borrowed" : "Returned" },
              ...b.borrowHistory,
            ],
          };
        })
      );
    },
    [setBooks]
  );

  const value = useMemo<DataContextValue>(
    () => ({
      loading,
      assignments,
      setAssignments,
      messages,
      setMessages,
      books,
      setBooks,
      notifications,
      markNotificationsRead,
      notificationsUnread,
      announcements,
      events,
      calendarEvents,
      quotes,
      weather,
      toggleBookmark,
      toggleBorrow,
    }),
    [
      loading,
      assignments,
      setAssignments,
      messages,
      setMessages,
      books,
      setBooks,
      notifications,
      markNotificationsRead,
      notificationsUnread,
      toggleBookmark,
      toggleBorrow,
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}