import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GraduationCap, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { DataTable, type Column, type SortDirection } from "@/components/ui/DataTable";
import { SearchBar } from "@/components/ui/SearchBar";
import { PageTransition } from "@/components/animations/PageTransition";
import { gradeRecords, subjects } from "@/data/mock";
import { formatDate, gradeColor } from "@/utils";

interface Row {
  id: string;
  subjectId: string;
  name: string;
  score: number;
  grade: string;
  date: string;
  semester: string;
}

export function Grades() {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState<string>("all");
  const [semester, setSemester] = useState<string>("Autumn 2025");
  const [sortKey, setSortKey] = useState<string>("date");
  const [sortDir, setSortDir] = useState<SortDirection>("desc");

  const filtered = useMemo(() => {
    let rows = gradeRecords;
    if (subject !== "all") rows = rows.filter((r) => r.subjectId === subject);
    if (query.trim()) {
      rows = rows.filter((r) => (r.name + subjects.find((s) => s.id === r.subjectId)?.name).toLowerCase().includes(query.toLowerCase()));
    }
    return rows
      .map<Row>((r) => ({ id: r.id, subjectId: r.subjectId, name: r.name, score: r.score, grade: r.grade, date: r.date, semester: r.semester }))
      .sort((a, b) => {
        const av = a[sortKey as keyof Row];
        const bv = b[sortKey as keyof Row];
        if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
        return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
  }, [query, subject, sortKey, sortDir]);

  const semesterGpa = useMemo(() => {
    const num = gradeRecords.filter((r) => r.semester === semester);
    const gpa = num.reduce((s, r) => s + scoreToGpa(r.score), 0) / (num.length || 1);
    return gpa.toFixed(2);
  }, [semester]);

  const bySubject = useMemo(
    () =>
      subjects
        .map((s) => {
          const recs = gradeRecords.filter((r) => r.subjectId === s.id);
          const avg = recs.reduce((sum, r) => sum + r.score, 0) / (recs.length || 1);
          return { name: s.name, short: s.name.split(" ")[0], avg: Math.round(avg), color: s.color };
        })
        .filter((d) => d.avg > 0),
    []
  );

  const progressSeries = useMemo(
    () =>
      gradeRecords
        .filter((r) => r.subjectId === "ch" || r.subjectId === "dada" || r.subjectId === "pot")
        .map((r) => {
          const s = subjects.find((x) => x.id === r.subjectId)!;
          return { name: `${s.name.split(" ")[0]} · ${r.name}`, score: r.score };
        })
        .map((r, i) => ({ ...r, index: i })),
    []
  );

  const gradeDist = useMemo(() => {
    const counts: Record<string, number> = {};
    gradeRecords.forEach((r) => (counts[r.grade] = (counts[r.grade] ?? 0) + 1));
    return ["O", "E", "A", "P"].map((g) => ({ name: g, value: counts[g] ?? 0 }));
  }, []);

  const columns: Column<Row>[] = [
    {
      key: "name",
      header: "Assessment",
      sortable: true,
      render: (r) => {
        const s = subjects.find((x) => x.id === r.subjectId)!;
        return (
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            <div>
              <p className="font-medium text-beige-100">{r.name}</p>
              <p className="text-[11px] text-silver-500">{s.name}</p>
            </div>
          </div>
        );
      },
    },
    {
      key: "grade",
      header: "Grade",
      sortable: true,
      render: (r) => <Badge tone="gold" className={gradeColor(r.grade)}>{r.grade}</Badge>,
    },
    { key: "score", header: "Score", sortable: true, className: "text-right", render: (r) => <span className="font-semibold">{r.score}%</span> },
    { key: "date", header: "Date", sortable: true, render: (r) => <span className="text-silver-400">{formatDate(r.date)}</span> },
    { key: "semester", header: "Semester", render: (r) => <span className="text-silver-500">{r.semester}</span> },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Grades"
          subtitle="Track your academic performance across every subject"
          icon={<GraduationCap className="h-7 w-7" />}
          crumb={{ items: [{ label: "Academics" }, { label: "Grades" }] }}
        />

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card><CardBody>
            <p className="text-xs uppercase tracking-wider text-silver-500">Semester GPA</p>
            <p className="mt-1 flex items-center gap-1 font-heading text-3xl text-gold-300"><TrendingUp className="h-5 w-5 text-emerald2-200" /> {semesterGpa}</p>
          </CardBody></Card>
          <Card><CardBody>
            <p className="text-xs uppercase tracking-wider text-silver-500">Outstandings</p>
            <p className="mt-1 font-heading text-3xl text-beige-100">{gradeRecords.filter((r) => r.grade === "O").length}</p>
          </CardBody></Card>
          <Card><CardBody>
            <p className="text-xs uppercase tracking-wider text-silver-500">Assessments</p>
            <p className="mt-1 font-heading text-3xl text-beige-100">{gradeRecords.length}</p>
          </CardBody></Card>
          <Card><CardBody>
            <p className="text-xs uppercase tracking-wider text-silver-500">Average</p>
            <p className="mt-1 font-heading text-3xl text-beige-100">{Math.round(gradeRecords.reduce((s, r) => s + r.score, 0) / gradeRecords.length)}%</p>
          </CardBody></Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader title="Performance by Subject" subtitle="Average score per discipline" />
            <CardBody>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bySubject} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" />
                    <XAxis dataKey="short" tick={{ fill: "#C0C0C0", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#8a8a8a", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "#ffffff08" }} />
                    <Bar dataKey="avg" name="Average" radius={[8, 8, 0, 0]}>
                      {bySubject.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Grade Distribution" subtitle="Across all subjects" />
            <CardBody>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={gradeDist} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={4} stroke="none">
                      {gradeDist.map((_, i) => (
                        <Cell key={i} fill={["#D4AF37", "#C0C0C0", "#1E5631", "#6A1B1A"][i % 4]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex justify-center gap-4 text-xs text-silver-400">
                {gradeDist.map((g, i) => (
                  <span key={g.name} className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: ["#D4AF37", "#C0C0C0", "#1E5631", "#6A1B1A"][i % 4] }} />
                    {g.name}: {g.value}
                  </span>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader title="Score Progression" subtitle="Latest core assessments in order" />
          <CardBody>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressSeries} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff12" />
                  <XAxis dataKey="index" hide />
                  <YAxis domain={[50, 100]} tick={{ fill: "#8a8a8a", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="score" name="Score" stroke="#D4AF37" strokeWidth={3} dot={{ fill: "#D4AF37", r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Data table */}
        <Card>
          <CardHeader
            title="All Assessments"
            subtitle={`${filtered.length} recorded`}
            action={
              <Select value={subject} onChange={setSubject} />
            }
          />
          <CardBody>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <SearchBar value={query} onChange={setQuery} placeholder="Search assessments or subjects…" className="w-full sm:max-w-sm" />
              <div className="flex gap-2">
                {["Autumn 2025", "Spring 2026"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSemester(s)}
                    className={`btn-focus rounded-lg border px-3 py-1.5 text-xs transition-colors ${semester === s ? "border-gold/50 bg-gold/10 text-gold-200" : "border-silver/15 text-silver-400 hover:text-beige-100"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <DataTable
              columns={columns}
              data={filtered}
              rowKey={(r) => r.id}
              onSort={(key, dir) => { setSortKey(key); setSortDir(dir); }}
              sortKey={sortKey}
              sortDir={sortDir}
            />
          </CardBody>
        </Card>
      </div>
    </PageTransition>
  );
}

function Select({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} aria-label="Filter by subject" className="input-base w-auto py-1.5 text-xs">
      <option value="all">All subjects</option>
      {subjects.map((s) => (
        <option key={s.id} value={s.id}>{s.name}</option>
      ))}
    </select>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs">
      <p className="mb-1 font-medium text-beige-100">{payload[0].payload.short ?? payload[0].payload.name ?? label}</p>
      {payload.map((p: { dataKey: string; value: number; payload: { score?: number; avg?: number } }, i: number) => (
        <p key={i} className="text-silver-400">{p.dataKey}: <span className="text-gold-300">{p.payload.score ?? p.payload.avg}</span></p>
      ))}
    </div>
  );
}

function scoreToGpa(score: number): number {
  if (score >= 90) return 4.0;
  if (score >= 80) return 3.7;
  if (score >= 70) return 3.0;
  if (score >= 60) return 2.0;
  if (score >= 50) return 1.0;
  return 0.0;
}