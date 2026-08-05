import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Archive, ArchiveRestore, Mail, MailOpen, PenLine, Send, Star, Trash2 } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/States";
import { SearchBar } from "@/components/ui/SearchBar";
import { PageTransition } from "@/components/animations/PageTransition";
import { formatRelative, uid } from "@/utils";
import { cn } from "@/utils";
import type { Message } from "@/types";

type Folder = "inbox" | "sent" | "archive";

const FOLDERS: { id: Folder; label: string }[] = [
  { id: "inbox", label: "Inbox" },
  { id: "sent", label: "Sent" },
  { id: "archive", label: "Archive" },
];

export function OwlMail() {
  const { messages, setMessages } = useData();
  const toast = useToast();
  const { user } = useAuth();
  const [folder, setFolder] = useState<Folder>("inbox");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [draft, setDraft] = useState({ to: "", subject: "", body: "" });

  const unreadCount = messages.filter((m) => m.folder === "inbox" && !m.read).length;

  const visible = useMemo(() => {
    let rows = messages.filter((m) => m.folder === folder);
    if (query.trim()) {
      rows = rows.filter((m) => (m.from + m.subject + m.preview).toLowerCase().includes(query.toLowerCase()));
    }
    return rows.sort((a, b) => b.date.localeCompare(a.date));
  }, [messages, folder, query]);

  const selected = selectedId ? messages.find((m) => m.id === selectedId) : null;

  const markRead = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const openMessage = (id: string) => {
    markRead(id);
    setSelectedId(id);
  };

  const toggleStar = (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)));
  };

  const archive = (id: string, to: "inbox" | "archive") => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, folder: to, archived: to === "archive" } : m)));
    toast.info(to === "archive" ? "Message archived" : "Message restored");
    setSelectedId(null);
  };

  const trash = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    toast.info("Message deleted", "Gone with the owl.");
    setSelectedId(null);
  };

  const send = () => {
    if (!draft.subject.trim() || !draft.body.trim()) {
      toast.error("Incomplete letter", "Both subject and body are required.");
      return;
    }
    const msg: Message = {
      id: uid("m"),
      from: user.name,
      avatar: "",
      initials: user.initials,
      subject: draft.subject.trim(),
      preview: draft.body.trim().slice(0, 90),
      body: draft.body.trim(),
      date: new Date().toISOString(),
      read: true,
      archived: false,
      starred: false,
      folder: "sent",
    };
    setMessages((prev) => [msg, ...prev]);
    toast.success("Letter dispatched", "An owl is on its way.");
    setDraft({ to: "", subject: "", body: "" });
    setComposeOpen(false);
    setFolder("sent");
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Owl Mail"
          subtitle={`${unreadCount} unread letter${unreadCount === 1 ? "" : "s"} waiting`}
          icon={<Mail className="h-7 w-7" />}
          crumb={{ items: [{ label: "Resources" }, { label: "Owl Mail" }] }}
          actions={
            <Button icon={<PenLine className="h-4 w-4" />} onClick={() => setComposeOpen(true)}>
              Compose
            </Button>
          }
        />

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Folder list */}
          <div className="space-y-2">
            {FOLDERS.map((f) => {
              const count = messages.filter((m) => m.folder === f.id && (f.id !== "inbox" || !m.read)).length;
              return (
                <button
                  key={f.id}
                  onClick={() => { setFolder(f.id); setSelectedId(null); }}
                  className={cn(
                    "btn-focus flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
                    folder === f.id ? "border-gold/40 bg-gold/10 text-gold-200" : "border-silver/10 bg-ink-900/40 text-silver-400 hover:border-gold/25 hover:text-beige-100"
                  )}
                >
                  {f.id === "inbox" ? <MailOpen className="h-4 w-4" /> : f.id === "sent" ? <Send className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                  <span className="flex-1 text-left">{f.label}</span>
                  {count > 0 && <span className="rounded-full bg-wine-400 px-2 py-0.5 text-[10px] font-bold text-beige-100">{count}</span>}
                </button>
              );
            })}

            {/* Owl delivery animation */}
            <div className="glass mt-4 overflow-hidden rounded-2xl p-5">
              <motion.div
                animate={{ x: ["-20%", "10%"], y: [0, -14, 0] }}
                transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                className="text-3xl"
                aria-hidden
              >
                🦉
              </motion.div>
              <p className="mt-2 text-xs text-silver-500">Owls are on the wing. Average delivery: 24 minutes across the grounds.</p>
            </div>
          </div>

          {/* Message list / reader */}
          <div className="min-h-[420px]">
            {selected ? (
              <div className="glass rounded-2xl">
                <div className="flex items-center justify-between gap-3 border-b border-silver/10 p-5">
                  <div className="min-w-0">
                    <h3 className="truncate font-heading text-lg text-beige-100">{selected.subject}</h3>
                    <p className="mt-0.5 text-xs text-silver-500">{selected.from} · {formatRelative(selected.date)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <IconBtn label="Star" onClick={() => toggleStar(selected.id)} active={selected.starred}>
                      <Star className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn label={selected.folder === "archive" ? "Unarchive" : "Archive"} onClick={() => archive(selected.id, selected.folder === "archive" ? "inbox" : "archive")}>
                      {selected.folder === "archive" ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                    </IconBtn>
                    <IconBtn label="Delete" danger onClick={() => trash(selected.id)}>
                      <Trash2 className="h-4 w-4" />
                    </IconBtn>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}>Back</Button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <Avatar initials={selected.initials} house={folder === "sent" ? undefined : "Ravenclaw"} />
                    <div>
                      <p className="text-sm font-medium text-beige-100">{selected.from}</p>
                      <p className="text-xs text-silver-500">to {folder === "sent" ? draft.to || "Recipient" : user.name}</p>
                    </div>
                  </div>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-silver-400">{selected.body}</p>
                </div>
              </div>
            ) : (
              <div className="glass rounded-2xl">
                <div className="border-b border-silver/10 p-4">
                  <SearchBar value={query} onChange={setQuery} placeholder={`Search ${folder}…`} className="max-w-sm" />
                </div>
                {visible.length === 0 ? (
                  <EmptyState
                    title="No letters here"
                    description={folder === "inbox" ? "Your owl perch is empty. Compose a letter to break the silence." : `No messages in ${folder}.`}
                  />
                ) : (
                  <div className="divide-y divide-silver/5">
                    {visible.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => openMessage(m.id)}
                        className={cn("btn-focus flex w-full items-start gap-3 px-5 py-4 text-left transition-colors hover:bg-ink-700/40", !m.read && "bg-gold/[0.04]")}
                      >
                        <Avatar initials={m.initials} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={cn("truncate text-sm", m.read ? "text-silver-400" : "font-semibold text-beige-100")}>{m.from}</span>
                            {!m.read && <span className="h-2 w-2 shrink-0 rounded-full bg-gold-400" />}
                            {m.starred && <Star className="h-3 w-3 shrink-0 text-gold-300" />}
                            <span className="ml-auto shrink-0 text-[10px] text-silver-600">{formatRelative(m.date)}</span>
                          </div>
                          <p className={cn("mt-0.5 truncate text-sm", m.read ? "text-silver-500" : "text-beige-100/90")}>{m.subject}</p>
                          <p className="mt-0.5 truncate text-xs text-silver-600">{m.preview}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Compose modal */}
        <Modal
          open={composeOpen}
          onClose={() => setComposeOpen(false)}
          title="Compose Letter"
          size="lg"
          footer={
            <>
              <Button variant="ghost" onClick={() => setComposeOpen(false)}>Save draft</Button>
              <Button onClick={send} icon={<Send className="h-4 w-4" />}>Dispatch via owl</Button>
            </>
          }
        >
          <form onSubmit={(e) => { e.preventDefault(); send(); }} className="space-y-4">
            <div>
              <label htmlFor="to" className="mb-1.5 block text-xs font-medium text-silver-400">Recipient</label>
              <input id="to" className="input-base" placeholder="e.g. Professor A. Lumina" value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} />
            </div>
            <div>
              <label htmlFor="subject" className="mb-1.5 block text-xs font-medium text-silver-400">Subject</label>
              <input id="subject" className="input-base" placeholder="Subject of your letter" value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} />
            </div>
            <div>
              <label htmlFor="body" className="mb-1.5 block text-xs font-medium text-silver-400">Letter body</label>
              <textarea
                id="body"
                rows={6}
                className="input-base resize-none"
                placeholder="Write your message…"
                value={draft.body}
                onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              />
            </div>
          </form>
        </Modal>
      </div>
    </PageTransition>
  );
}

function IconBtn({ children, label, onClick, danger, active }: { children: React.ReactNode; label: string; onClick: () => void; danger?: boolean; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "btn-focus rounded-lg p-2 transition-colors",
        danger ? "text-silver-500 hover:bg-wine-300/10 hover:text-wine-300" : "text-silver-500 hover:bg-ink-700 hover:text-gold-300",
        active && "text-gold-300"
      )}
    >
      {children}
    </button>
  );
}