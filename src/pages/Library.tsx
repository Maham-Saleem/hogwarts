import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, BookOpen, CalendarClock, Library as LibraryIcon } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SearchBar } from "@/components/ui/SearchBar";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { PageTransition, Stagger, itemVariants } from "@/components/animations/PageTransition";
import { formatDate } from "@/utils";

const COVER_GRADIENTS = [
  "from-wine-500/80 to-ink-900",
  "from-emerald2-400/80 to-ink-900",
  "from-[#7B68EE]/70 to-ink-900",
  "from-[#D2691E]/70 to-ink-900",
  "from-[#228B22]/70 to-ink-900",
  "from-silver-500/40 to-ink-900",
];

export function Library() {
  const { books, toggleBookmark, toggleBorrow } = useData();
  const toast = useToast();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [onlyBookmarks, setOnlyBookmarks] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const categories = useMemo(() => ["all", ...Array.from(new Set(books.map((b) => b.category)))], [books]);

  const filtered = useMemo(() => {
    let rows = books;
    if (category !== "all") rows = rows.filter((b) => b.category === category);
    if (onlyBookmarks) rows = rows.filter((b) => b.bookmarked);
    if (query.trim()) rows = rows.filter((b) => (b.title + b.author).toLowerCase().includes(query.toLowerCase()));
    return rows;
  }, [books, query, category, onlyBookmarks]);

  const activeBook = selected ? books.find((b) => b.id === selected) : null;

  const doBorrow = (b: typeof books[number]) => {
    toggleBorrow(b.id);
    toast.success(b.borrowed ? "Book returned" : "Book borrowed", b.borrowed ? "Welcome back to the shelf." : `Due back ${formatDate(b.dueDate ?? "")}`);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Library"
          subtitle="The castle's endless shelves of knowledge"
          icon={<LibraryIcon className="h-7 w-7" />}
          crumb={{ items: [{ label: "Resources" }, { label: "Library" }] }}
        />

        {/* Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar value={query} onChange={setQuery} placeholder="Search titles or authors…" className="w-full sm:max-w-sm" />
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`btn-focus rounded-full border px-3 py-1.5 text-xs transition-colors ${category === c ? "border-gold/50 bg-gold/10 text-gold-200" : "border-silver/15 text-silver-400 hover:text-beige-100"}`}
                >
                  {c === "all" ? "All" : c}
                </button>
              ))}
            </div>
            <button
              onClick={() => setOnlyBookmarks((o) => !o)}
              className={`btn-focus flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${onlyBookmarks ? "border-gold/50 bg-gold/10 text-gold-200" : "border-silver/15 text-silver-400 hover:text-beige-100"}`}
            >
              {onlyBookmarks ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />} Bookmarks
            </button>
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <Card><CardBody>
            <EmptyState title="No books found" description="The shelves are vast — try a different spell." />
          </CardBody></Card>
        ) : (
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((book, i) => (
              <motion.div key={book.id} variants={itemVariants}>
                <Card interactive className="group overflow-hidden" glow={book.borrowed}>
                  <div
                    className={`relative h-44 bg-gradient-to-br ${COVER_GRADIENTS[i % COVER_GRADIENTS.length]} flex items-center justify-center`}
                  >
                    <span className="font-display text-6xl text-beige-100/90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">{book.cover}</span>
                    <span className="absolute right-3 top-3">
                      <button
                        onClick={() => { toggleBookmark(book.id); toast.info(book.bookmarked ? "Removed from bookmarks" : "Added to bookmarks", book.title); }}
                        aria-label={book.bookmarked ? "Remove bookmark" : "Bookmark"}
                        className={`btn-focus rounded-lg p-1.5 transition ${book.bookmarked ? "bg-gold/20 text-gold-300" : "bg-ink-950/50 text-silver-400 hover:text-gold-300"}`}
                      >
                        {book.bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                      </button>
                    </span>
                    {book.borrowed && (
                      <span className="absolute bottom-3 left-3"><Badge tone="emerald">On loan</Badge></span>
                    )}
                  </div>
                  <CardBody>
                    <h3 className="line-clamp-1 font-heading text-base text-beige-100">{book.title}</h3>
                    <p className="mt-0.5 text-xs text-silver-500">{book.author}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge tone="beige">{book.category}</Badge>
                      <span className="text-xs text-gold-300">★ {book.rating.toFixed(1)}</span>
                      <span className="ml-auto text-[11px] text-silver-600">{book.pages} pp</span>
                    </div>
                    {book.progress > 0 && book.progress < 100 && (
                      <div className="mt-3">
                        <ProgressBar value={book.progress} size="sm" label={`${book.title} reading progress`} />
                        <p className="mt-1 text-[10px] text-silver-600">{book.progress}% read</p>
                      </div>
                    )}
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelected(book.id)}>
                        Details
                      </Button>
                      <Button size="sm" variant={book.borrowed ? "secondary" : "primary"} className="flex-1" onClick={() => doBorrow(book)}>
                        {book.borrowed ? "Return" : "Borrow"}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </Stagger>
        )}

        {/* Detail modal */}
        <Modal open={!!activeBook} onClose={() => setSelected(null)} title={activeBook?.title} size="lg">
          {activeBook && (
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className={`flex h-28 w-20 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${COVER_GRADIENTS[books.findIndex((b) => b.id === activeBook.id) % COVER_GRADIENTS.length]}`}>
                  <span className="font-display text-4xl text-beige-100/90">{activeBook.cover}</span>
                </div>
                <div>
                  <p className="text-sm text-silver-400">{activeBook.author}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge tone="beige">{activeBook.category}</Badge>
                    <Badge tone="gold">★ {activeBook.rating.toFixed(1)}</Badge>
                    <Badge tone="neutral">{activeBook.pages} pages</Badge>
                  </div>
                  <p className="mt-3 text-xs text-silver-500">
                    {activeBook.borrowed ? (
                      <span className="flex items-center gap-1.5 text-emerald2-200"><CalendarClock className="h-3.5 w-3.5" /> Due back {formatDate(activeBook.dueDate ?? "")}</span>
                    ) : (
                      "Currently available on the shelves."
                    )}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="mb-2 flex items-center gap-2 font-heading text-sm text-beige-100"><BookOpen className="h-4 w-4 text-gold-400" /> Reading progress</h4>
                <ProgressBar value={activeBook.progress} label="Reading progress" />
              </div>

              <div>
                <h4 className="mb-3 font-heading text-sm text-beige-100">Borrow history</h4>
                {activeBook.borrowHistory.length === 0 ? (
                  <p className="text-xs text-silver-600">No borrow history yet.</p>
                ) : (
                  <div className="space-y-2">
                    {activeBook.borrowHistory.map((h, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-silver/10 bg-ink-900/40 px-3 py-2 text-xs">
                        <span className="text-silver-400">{h.action}</span>
                        <span className="text-silver-600">{formatDate(h.date)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button variant={activeBook.borrowed ? "secondary" : "primary"} className="w-full" onClick={() => doBorrow(activeBook)}>
                {activeBook.borrowed ? "Return to library" : "Borrow this book"}
              </Button>
            </div>
          )}
        </Modal>
      </div>
    </PageTransition>
  );
}