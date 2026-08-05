import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  Bird,
  CircleDashed,
  Feather,
  Pencil,
  Scroll,
  Shield,
  Swords,
  User,
  Wand2,
} from "lucide-react";
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PieChart, Pie, Cell, Tooltip } from "recharts";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Avatar } from "@/components/ui/Avatar";
import { Timeline } from "@/components/ui/Timeline";
import { PageTransition } from "@/components/animations/PageTransition";
import { formatDate } from "@/utils";
import { houseMeta } from "@/data/mock";

const SKILL_ICONS: Record<string, typeof Scroll> = { scroll: Scroll, shield: Shield, swords: Swords, bird: Bird };
const RARITY_TONE = { Common: "neutral", Rare: "gold", Legendary: "wine" } as const;

const persona = [
  { subject: "Charms", a: 92, b: 78 },
  { subject: "Potions", a: 80, b: 84 },
  { subject: "DADA", a: 88, b: 70 },
  { subject: "Runes", a: 90, b: 50 },
  { subject: "Astronomy", a: 84, b: 60 },
  { subject: "Herbology", a: 70, b: 86 },
];

const radarData = persona.map((p) => ({ subject: p.subject, Audit: p.b, Practical: p.a }));

const activityTimeline = [
  { id: "t1", title: "Earned Outstanding in Charms", description: "Mid-Year Exam practical.", date: "2026-03-20", icon: <Award className="h-3 w-3" />, color: "#D4AF37" },
  { id: "t2", title: "Earned 15 house points", description: "For excellence in runes translation.", date: "2026-03-14", icon: <Scroll className="h-3 w-3" />, color: "#4A6FA5" },
  { id: "t3", title: "Won a dueling bout", description: "Dueling club evening session.", date: "2026-03-02", icon: <Swords className="h-3 w-3" />, color: "#C0C0C0" },
  { id: "t4", title: "Conjured a corporeal Patronus", description: "First successful conjuration recorded.", date: "2026-02-18", icon: <Bird className="h-3 w-3" />, color: "#1E5631" },
];

export function Profile() {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name: user.name, bio: user.bio, title: user.title });

  const meta = houseMeta[user.house];
  const expPercent = Math.round((user.experience / user.experienceToNext) * 100);

  const skillTags = user.skills.filter((s) => (SKILL_ICONS as Record<string, typeof Scroll>)[s.toLowerCase()] === undefined);
  const abilityTags = user.abilities;

  const save = () => {
    updateProfile({ name: form.name || user.name, bio: form.bio, title: form.title });
    toast.success("Profile updated", "Your parchment has been rewritten.");
    setEditOpen(false);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Student Profile"
          subtitle="Your magical identity at Hogwarts"
          icon={<User className="h-7 w-7" />}
          crumb={{ items: [{ label: "Account" }, { label: "Profile" }] }}
          actions={
            <Button icon={<Pencil className="h-4 w-4" />} onClick={() => { setForm({ name: user.name, bio: user.bio, title: user.title }); setEditOpen(true); }}>
              Edit Profile
            </Button>
          }
        />

        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-gold/25">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-wine-700/40 via-ink-850 to-emerald2-400/20" aria-hidden />
          <div className="relative flex flex-col items-center gap-5 p-8 text-center sm:flex-row sm:text-left">
            <Avatar initials={user.initials} house={user.house} size="xl" className="ring-2 ring-gold/30" />
            <div className="flex-1">
              <h1 className="font-heading text-2xl text-beige-100 sm:text-3xl">{user.name}</h1>
              <p className="mt-1 text-sm" style={{ color: meta.color }}>{user.title}</p>
              <p className="mt-0.5 text-sm text-silver-400">{user.year}{user.year === 1 ? "st" : user.year === 2 ? "nd" : user.year === 3 ? "rd" : "th"} year · {user.house} house</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <Badge tone="beige" className="flex items-center gap-1"><Wand2 className="h-3 w-3" /> {user.wand}</Badge>
                <Badge tone="gold" className="flex items-center gap-1"><Feather className="h-3 w-3" /> Patronus: {user.patronus}</Badge>
              </div>
            </div>
            <div className="w-full max-w-xs">
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-silver-400">Magical Level</span>
                <span className="text-gold-300">{user.magicLevel}</span>
              </div>
              <ProgressBar value={expPercent} color={meta.color} label="Magical level" />
              <p className="mt-2 text-[11px] text-silver-500">{user.experience.toLocaleString()} XP · {user.experienceToNext - user.experience} to next level</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: about + skills */}
          <div className="space-y-6">
            <Card>
              <CardHeader title="About" />
              <CardBody>
                <p className="text-sm leading-relaxed text-silver-400">{user.bio}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-silver/10 pt-4 text-center">
                  <div><p className="font-heading text-xl text-gold-300">{user.gpa.toFixed(1)}</p><p className="text-[11px] text-silver-500">GPA</p></div>
                  <div><p className="font-heading text-xl text-emerald2-200">{user.attendance}%</p><p className="text-[11px] text-silver-500">Attendance</p></div>
                  <div><p className="font-heading text-xl text-beige-100">{user.housePoints.toLocaleString()}</p><p className="text-[11px] text-silver-500">House Points</p></div>
                  <div><p className="font-heading text-xl text-silver-300">{user.experience.toLocaleString()}</p><p className="text-[11px] text-silver-500">Experience</p></div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Skills" subtitle="Trained abilities" />
              <CardBody className="flex flex-wrap gap-2">
                {user.skills.map((s) => (
                  <Badge key={s} tone="beige">{s}</Badge>
                ))}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Magical Abilities" subtitle="Advanced capabilities" />
              <CardBody className="space-y-2">
                {abilityTags.map((a) => (
                  <div key={a} className="flex items-center gap-2 text-sm text-silver-400">
                    <CircleDashed className="h-4 w-4 text-gold-400" />
                    {a}
                  </div>
                ))}
                {skillTags.map((s) => (
                  <div key={s} className="flex items-center gap-2 text-sm text-silver-400">
                    <CircleDashed className="h-4 w-4 text-gold-400" />
                    {s}
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>

          {/* Middle: radar + timeline */}
          <div className="space-y-6 lg:col-span-1">
            <Card>
              <CardHeader title="Proficiency Radar" subtitle="Practical vs theoretical" />
              <CardBody>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius="75%">
                      <PolarGrid stroke="#ffffff18" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#C0C0C0", fontSize: 10 }} />
                      <Radar name="Practical" dataKey="Practical" stroke="#D4AF37" fill="#D4AF37" fillOpacity={0.35} />
                      <Radar name="Audit" dataKey="Audit" stroke="#4A6FA5" fill="#4A6FA5" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 flex justify-center gap-4 text-xs text-silver-400">
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-gold-400" /> Practical</span>
                  <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-[#4A6FA5]" /> Audit</span>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Abilities Balance" />
              <CardBody>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={persona.map((p) => ({ name: p.subject, value: Math.round((p.a + p.b) / 2) }))} dataKey="value" nameKey="name" innerRadius={40} outerRadius={60} paddingAngle={3} stroke="none">
                        {persona.map((_, i) => <Cell key={i} fill={["#D4AF37", "#6A1B1A", "#C0C0C0", "#1E5631", "#4A6FA5", "#C9A227"][i % 6]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#161B22", border: "1px solid #D4AF3744", borderRadius: 8, fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right: achievements + timeline */}
          <div className="space-y-6">
            <Card>
              <CardHeader title="Achievements" subtitle={`${user.achievements.length} unlocked`} />
              <CardBody className="space-y-3">
                {user.achievements.map((a) => {
                  const Icon = SKILL_ICONS[a.icon] ?? Award;
                  return (
                    <motion.div key={a.id} whileHover={{ x: 3 }} className="flex items-start gap-3 rounded-xl border border-silver/10 bg-ink-900/40 p-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-beige-100">{a.title}</p>
                          <Badge tone={RARITY_TONE[a.rarity]}>{a.rarity}</Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-silver-500">{a.description}</p>
                        <p className="mt-1 text-[10px] text-silver-600">{formatDate(a.date)}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Activity Timeline" subtitle="Recent milestones" />
              <CardBody>
                <Timeline items={activityTimeline} />
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Edit modal */}
        <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile" footer={
          <>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save changes</Button>
          </>
        }>
          <form onSubmit={(e) => { e.preventDefault(); save(); }} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-silver-400">Full name</label>
              <input id="name" className="input-base" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label htmlFor="title" className="mb-1.5 block text-xs font-medium text-silver-400">Title / role</label>
              <input id="title" className="input-base" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label htmlFor="bio" className="mb-1.5 block text-xs font-medium text-silver-400">Biography</label>
              <textarea id="bio" rows={4} className="input-base resize-none" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>
            <p className="text-xs text-silver-600">
              House, year and wand are verified by the Sorting ceremony and cannot be edited here.{" "}
              <Link to="/settings" className="text-gold-300 hover:text-gold-200">Manage appearance →</Link>
            </p>
          </form>
        </Modal>
      </div>
    </PageTransition>
  );
}