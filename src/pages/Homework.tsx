import { useMemo, useState } from "react";
import { CheckCircle2, Clock, Flag, KanbanSquare, Plus, Timer } from "lucide-react";
import { useData } from "@/context/DataContext";
import { useToast } from "@/context/ToastContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { PageTransition } from "@/components/animations/PageTransition";
import { subjects } from "@/data/mock";
import { formatDate, uid } from "@/utils";
import { cn } from "@/utils";
import type { Assignment } from "@/types";

type Status = Assignment["status"];

const COLUMNS: { id: Status; label: string; icon: typeof Clock; accent: string }[] = [
  { id: "Pending", label: "Pending", icon: Timer, accent: "#6A1B1A" },
  { id: "In Progress", label: "In Progress", icon: Clock, accent: "#D4AF37" },
  { id: "Completed", label: "Completed", icon: CheckCircle2, accent: "#1E5631" },
];

const PRIORITY_TONE = { High: "wine", Medium: "gold", Low: "neutral" } as const;

export function Homework() {
  const { assignments, setAssignments } = useData();
  const toast = useToast();
  const [dragOver, setDragOver] = useState<Status | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subjectId: subjects[0].id,
    dueDate: "2026-08-20",
    priority: "Medium" as Assignment["priority"],
  });

  const grouped = useMemo(() => {
    const map: Record<Status, Assignment[]> = { Pending: [], "In Progress": [], Completed: [] };
    assignments.forEach((a) => map[a.status].push(a));
    return map;
  }, [assignments]);

  const move = (id: string, to: Status) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, status: to } : a)));
    if (to === "Completed") toast.success("Assignment completed", "Well done, keep the streak alive!");
    else toast.info("Assignment moved", `Moved to ${to}`);
  };

  const onDrop = (e: React.DragEvent, to: Status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/assignment-id");
    if (id) move(id, to);
    setDragOver(null);
  };

  const create = () => {
    if (!form.title.trim()) {
      toast.error("Title required", "Give your assignment a name.");
      return;
    }
    const a: Assignment = {
      id: uid("a"),
      subjectId: form.subjectId,
      title: form.title.trim(),
      dueDate: form.dueDate,
      priority: form.priority,
      status: "Pending",
      description: "Newly assigned task from the professor's desk.",
    };
    setAssignments((prev) => [a, ...prev]);
    toast.success("Assignment added", `${a.title} is now pending.`);
    setForm({ title: "", subjectId: subjects[0].id, dueDate: "2026-08-20", priority: "Medium" });
    setComposeOpen(false);
  };

  const remove = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    toast.info("Assignment removed", "Deleted from the board.");
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Homework"
          subtitle="Drag assignments between stages as you progress"
          icon={<KanbanSquare className="h-7 w-7" />}
          crumb={{ items: [{ label: "Academics" }, { label: "Homework" }] }}
          actions={
            <Button icon={<Plus className="h-4 w-4" />} onClick={() => setComposeOpen(true)}>
              New Assignment
            </Button>
          }
        />

        <div className="grid gap-5 md:grid-cols-3">
          {COLUMNS.map((col) => (
            <div
              key={col.id}
              onDragOver={(e) => { e.preventDefault(); setDragOver(col.id); }}
              onDragLeave={() => setDragOver((d) => (d === col.id ? null : d))}
              onDrop={(e) => onDrop(e, col.id)}
              className={cn(
                "flex min-h-[320px] flex-col rounded-2xl border p-3 transition-colors",
                dragOver === col.id ? "border-gold/50 bg-gold/5" : "border-silver/10 bg-ink-900/40"
              )}
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <span className="flex items-center gap-2 text-sm font-semibold text-beige-100">
                  <col.icon className="h-4 w-4" style={{ color: col.accent }} />
                  {col.label}
                </span>
                <Badge tone="neutral">{grouped[col.id].length}</Badge>
              </div>

              <div className="flex flex-1 flex-col gap-3">
                {grouped[col.id].map((a) => {
                  const subject = subjects.find((s) => s.id === a.subjectId)!;
                  const overdue = a.status !== "Completed" && new Date(a.dueDate) < new Date();
                  return (
                    <div
                      key={a.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("text/assignment-id", a.id)}
                      className="glass group cursor-grab rounded-xl border-silver/10 p-4 transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-glow-sm active:cursor-grabbing"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: subject.color }}>
                          {subject.name}
                        </span>
                        <button
                          onClick={() => remove(a.id)}
                          aria-label={`Delete ${a.title}`}
                          className="btn-focus rounded p-1 text-silver-600 opacity-0 transition group-hover:opacity-100 hover:text-wine-300"
                        >
                          ×
                        </button>
                      </div>
                      <p className="mt-1.5 text-sm font-medium leading-snug text-beige-100">{a.title}</p>
                      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-silver-500">
                        <Flag className="h-3 w-3" />
                        <span className={overdue ? "font-semibold text-wine-300" : undefined}>
                          {overdue ? "Overdue · " : "Due "}{formatDate(a.dueDate)}
                        </span>
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <Badge tone={PRIORITY_TONE[a.priority]}>{a.priority}</Badge>
                        {col.id !== "Completed" && (
                          <button
                            onClick={() => move(a.id, col.id === "Pending" ? "In Progress" : "Completed")}
                            className="btn-focus text-[11px] text-gold-300 transition hover:text-gold-200"
                          >
                            {col.id === "Pending" ? "Start →" : "Complete ✓"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {grouped[col.id].length === 0 && (
                  <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-silver/20 p-6 text-center text-xs text-silver-600">
                    {col.id === "Completed" ? "Nothing finished yet — almost there!" : "Drag assignments here"}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Modal
          open={composeOpen}
          onClose={() => setComposeOpen(false)}
          title="New Assignment"
          footer={
            <>
              <Button variant="ghost" onClick={() => setComposeOpen(false)}>Cancel</Button>
              <Button onClick={create} icon={<Plus className="h-4 w-4" />}>Create</Button>
            </>
          }
        >
          <form onSubmit={(e) => { e.preventDefault(); create(); }} className="space-y-4" aria-label="New assignment form">
            <div>
              <label htmlFor="hw-title" className="mb-1.5 block text-xs font-medium text-silver-400">Assignment title</label>
              <input
                id="hw-title"
                className="input-base"
                placeholder="e.g. Animated Boggart Report"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="hw-subject" className="mb-1.5 block text-xs font-medium text-silver-400">Subject</label>
              <select
                id="hw-subject"
                className="input-base"
                value={form.subjectId}
                onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
              >
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="hw-due" className="mb-1.5 block text-xs font-medium text-silver-400">Due date</label>
                <input
                  id="hw-due"
                  type="date"
                  className="input-base"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="hw-priority" className="mb-1.5 block text-xs font-medium text-silver-400">Priority</label>
                <select
                  id="hw-priority"
                  className="input-base"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as Assignment["priority"] })}
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
          </form>
        </Modal>
      </div>
    </PageTransition>
  );
}