import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CloudRain,
  CloudSun,
  Flame,
  GraduationCap,
  KanbanSquare,
  Mail,
  Map as MapIcon,
  Quote,
  Sun,
  Trophy,
  Wand2,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Calendar } from "@/components/ui/Calendar";
import { PageTransition, Stagger, itemVariants } from "@/components/animations/PageTransition";
import { DAYS, formatDate, gradeColor, todayIndex } from "@/utils";
import { subjects, classSlots, gradeRecords } from "@/data/mock";

const WEATHER_ICON: Record<string, typeof CloudSun> = { "cloud-rain": CloudRain, "cloud-sun": CloudSun, sun: Sun };

function Stat({ icon, label, value, sub, color = "#D4AF37" }: { icon: React.ReactNode; label: string; value: string; sub?: string; color?: string }) {
  return (
    <motion.div variants={itemVariants} className="glass rounded-2xl p-4 transition-colors hover:border-gold/30">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: `${color}22`, color }}>{icon}</span>
        <span className="text-[10px] uppercase tracking-wider text-silver-600">{label}</span>
      </div>
      <p className="mt-3 font-heading text-2xl text-beige-100">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-silver-500">{sub}</p>}
    </motion.div>
  );
}

export function Dashboard() {
  const { user } = useAuth();
  const { announcements, events, assignments, weather, quotes, calendarEvents } = useData();

  const today = todayIndex();
  const todaysClasses = useMemo(
    () =>
      classSlots
        .filter((s) => s.day === today)
        .sort((a, b) => a.start.localeCompare(b.start)),
    [today]
  );

  const upcomingAssignments = assignments.filter((a) => a.status !== "Completed").sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 4);
  const recentGrades = gradeRecords.slice(0, 5);
  const nextEvents = [...events].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4);
  const quote = useMemo(() => quotes[new Date().getDate() % quotes.length], [quotes]);
  const expPercent = Math.round((user.experience / user.experienceToNext) * 100);

  return (
    <PageTransition>
      <Stagger className="space-y-6">
        {/* Welcome hero */}
        <motion.div variants={itemVariants}>
          <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-ink-800 via-ink-850 to-wine-700/40 p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-gold/10 blur-3xl" aria-hidden />
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <Avatar initials={user.initials} house={user.house} size="xl" />
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-gold-400">Welcome back</p>
                  <h1 className="mt-1 font-heading text-2xl text-beige-100 sm:text-3xl">{user.name}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge tone="gold">{user.title}</Badge>
                    <Badge tone="neutral">Year {user.year}</Badge>
                    <Badge tone="beige" className="capitalize">{user.house}</Badge>
                  </div>
                </div>
              </div>
              <div className="w-full max-w-xs sm:w-72">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-gold-300"><Zap className="h-3.5 w-3.5" /> Level {user.magicLevel}</span>
                  <span className="text-silver-500">{user.experience.toLocaleString()} / {user.experienceToNext.toLocaleString()} XP</span>
                </div>
                <ProgressBar value={expPercent} label="Magical level" />
                <p className="mt-2 text-[11px] text-silver-500">{user.experienceToNext - user.experience} XP to next level</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat icon={<Trophy className="h-4 w-4" />} label="House Points" value={user.housePoints.toLocaleString()} sub="Ravenclaw · 1st place" color="#D4AF37" />
          <Stat icon={<GraduationCap className="h-4 w-4" />} label="GPA" value={user.gpa.toFixed(1)} sub="Outstanding standing" color="#C0C0C0" />
          <Stat icon={<Flame className="h-4 w-4" />} label="Attendance" value={`${user.attendance}%`} sub="This term" color="#6A1B1A" />
          <Stat icon={<Wand2 className="h-4 w-4" />} label="Spells Known" value="34" sub="5 mastered this term" color="#1E5631" />
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            <Card data-idx="schedule">
              <CardHeader
                title="Today's Schedule"
                subtitle={DAYS[today]}
                action={<Link to="/timetable" className="btn-focus flex items-center gap-1 text-xs text-gold-300 transition hover:text-gold-200">Full timetable <ArrowRight className="h-3 w-3" /></Link>}
              />
              <CardBody className="space-y-3">
                {todaysClasses.length === 0 && (
                  <p className="py-6 text-center text-sm text-silver-500">No classes today. Enjoy the calm.</p>
                )}
                {todaysClasses.map((slot) => {
                  const subject = subjects.find((s) => s.id === slot.subjectId)!;
                  const isCurrent = isCurrentClass(slot.start, slot.end);
                  return (
                    <motion.div
                      key={slot.id}
                      variants={itemVariants}
                      className={`flex items-center gap-4 rounded-xl border p-3.5 transition-all ${isCurrent ? "border-gold/50 bg-gold/10 shadow-glow-sm" : "border-silver/10 bg-ink-900/40 hover:border-gold/25"}`}
                    >
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl" style={{ background: `${subject.color}22`, border: `1px solid ${subject.color}44` }}>
                        <span className="text-[10px] uppercase tracking-wider" style={{ color: subject.color }}>{slot.start}</span>
                        <span className="text-[10px] text-silver-500">{slot.end}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-beige-100">{subject.name}</p>
                        <p className="mt-0.5 truncate text-xs text-silver-500">{subject.professor} · Room {slot.location}</p>
                      </div>
                      {isCurrent && <Badge tone="gold">Now</Badge>}
                    </motion.div>
                  );
                })}
              </CardBody>
            </Card>

            <Card data-idx="grades">
              <CardHeader
                title="Recent Grades"
                subtitle="Latest assessments"
                action={<Link to="/grades" className="btn-focus flex items-center gap-1 text-xs text-gold-300 transition hover:text-gold-200">All grades <ArrowRight className="h-3 w-3" /></Link>}
              />
              <CardBody className="space-y-3">
                {recentGrades.map((g) => {
                  const subject = subjects.find((s) => s.id === g.subjectId)!;
                  return (
                    <div key={g.id} className="flex items-center gap-3">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: subject.color }} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-beige-100">{g.name}</p>
                        <p className="text-[11px] text-silver-500">{subject.name} · {formatDate(g.date)}</p>
                      </div>
                      <span className={`rounded-md border px-2 py-0.5 text-xs font-bold ${gradeColor(g.grade)}`}>{g.grade}</span>
                      <span className="w-10 text-right text-xs text-silver-400">{g.score}%</span>
                    </div>
                  );
                })}
              </CardBody>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Card data-idx="quote">
              <CardBody className="text-center">
                <Quote className="mx-auto mb-3 h-6 w-6 text-gold-400/70" aria-hidden />
                <p className="font-display text-lg italic leading-relaxed text-beige-100">“{quote.text}”</p>
                <p className="mt-3 text-xs uppercase tracking-widest text-gold-400">— {quote.author}</p>
              </CardBody>
            </Card>

            <Card data-idx="weather">
              <CardHeader title="Weather at Hogwarts" subtitle="Outer Grounds" />
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading text-3xl text-beige-100">{weather.temperature}°</p>
                    <p className="text-xs text-silver-500">{weather.condition}</p>
                    <p className="mt-1 text-[11px] text-silver-600">Feels {weather.feelsLike}° · Wind {weather.wind} km/h · {weather.humidity}%</p>
                  </div>
                  <CloudRain className="h-10 w-10 text-silver-400" />
                </div>
                <div className="mt-4 flex justify-between border-t border-silver/10 pt-3">
                  {weather.forecast.map((d) => {
                    const Icon = WEATHER_ICON[d.icon] ?? CloudSun;
                    return (
                      <div key={d.day} className="flex flex-col items-center gap-1 text-[11px] text-silver-500">
                        <span>{d.day}</span>
                        <Icon className="h-4 w-4 text-silver-400" />
                        <span className="text-beige-100">{d.high}°</span>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>

            <Card data-idx="events">
              <CardHeader title="Upcoming Events" subtitle="Mark your calendars" />
              <CardBody className="space-y-3">
                {nextEvents.map((e, i) => (
                  <motion.div key={e.id} variants={itemVariants} className="flex items-center gap-3 rounded-xl border border-silver/10 bg-ink-900/40 p-3">
                    <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg border border-gold/25 bg-gold/5">
                      <span className="font-heading text-sm text-gold-300">{new Date(e.date).getDate()}</span>
                      <span className="text-[9px] uppercase text-silver-500">{new Date(e.date).toLocaleString("en-GB", { month: "short" })}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-beige-100">{e.title}</p>
                      <p className="text-[11px] text-silver-500">{e.time} · {e.location}</p>
                    </div>
                    <Badge tone="neutral">{e.category}</Badge>
                    <span className="sr-only">{i + 1}</span>
                  </motion.div>
                ))}
              </CardBody>
            </Card>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card data-idx="homework" className="lg:col-span-1">
            <CardHeader title="Homework" subtitle={`${upcomingAssignments.length} due soon`} action={<Link to="/homework" className="btn-focus flex items-center gap-1 text-xs text-gold-300 hover:text-gold-200">Board <ArrowRight className="h-3 w-3" /></Link>} />
            <CardBody className="space-y-3">
              {upcomingAssignments.map((a) => {
                const subject = subjects.find((s) => s.id === a.subjectId)!;
                return (
                  <div key={a.id} className="flex items-center gap-3">
                    <KanbanSquare className="h-4 w-4 shrink-0 text-silver-500" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-beige-100">{a.title}</p>
                      <p className="text-[11px] text-silver-500">{subject.name} · due {formatDate(a.dueDate)}</p>
                    </div>
                    <Badge tone={a.priority === "High" ? "wine" : a.priority === "Medium" ? "gold" : "neutral"}>{a.priority}</Badge>
                  </div>
                );
              })}
            </CardBody>
          </Card>

          <Card data-idx="announcements" className="lg:col-span-1">
            <CardHeader title="Announcements" subtitle="From the castle" action={<Link to="/owl-mail" className="btn-focus flex items-center gap-1 text-xs text-gold-300 hover:text-gold-200">Mail <ArrowRight className="h-3 w-3" /></Link>} />
            <CardBody className="space-y-4">
              {announcements.slice(0, 4).map((a) => (
                <div key={a.id} className="border-l-2 border-gold/30 pl-3">
                  <p className="text-sm font-medium text-beige-100">{a.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-silver-500">{a.body}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-wider text-gold-400/80">{a.tag} · {a.author}</p>
                </div>
              ))}
            </CardBody>
          </Card>

          <div className="space-y-6 lg:col-span-1">
            <Card data-idx="calendar">
              <Calendar events={calendarEvents} />
            </Card>
          </div>
        </div>

        {/* Quick actions */}
        <motion.div variants={itemVariants}>
          <h2 className="mb-3 font-heading text-lg text-beige-100">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: "Castle Map", to: "/castle-map", icon: <MapIcon className="h-5 w-5" /> },
              { label: "Library", to: "/library", icon: <BookOpen className="h-5 w-5" /> },
              { label: "Send Mail", to: "/owl-mail", icon: <Mail className="h-5 w-5" /> },
              { label: "Timetable", to: "/timetable", icon: <CalendarDays className="h-5 w-5" /> },
              { label: "House Cup", to: "/house-cup", icon: <Trophy className="h-5 w-5" /> },
              { label: "Grades", to: "/grades", icon: <GraduationCap className="h-5 w-5" /> },
            ].map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="btn-focus glass flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-glow-sm"
              >
                <span className="text-gold-400">{a.icon}</span>
                <span className="text-xs text-beige-100">{a.label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      </Stagger>
    </PageTransition>
  );
}

function isCurrentClass(start: string, end: string) {
  const now = new Date();
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const cur = now.getHours() * 60 + now.getMinutes();
  return cur >= sh * 60 + sm && cur <= eh * 60 + em;
}