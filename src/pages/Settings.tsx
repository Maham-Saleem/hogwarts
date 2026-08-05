import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Languages, Palette, Settings as SettingsIcon, Sliders, Volume2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { PageTransition } from "@/components/animations/PageTransition";
import { cn } from "@/utils";

type Section = "appearance" | "notifications" | "language" | "accessibility";

const THEMES = [
  { id: "dark", label: "Midnight", desc: "Classic dark parchment", swatch: ["#0D1117", "#D4AF37"] },
  { id: "gold", label: "Gilded", desc: "Warm golden highlights", swatch: ["#161B22", "#E4C65E"] },
  { id: "wine", label: "Crimson", desc: "Deep burgundy accents", swatch: ["#1A1116", "#A63A38"] },
  { id: "aurora", label: "Aurora", desc: "Enchanted greens & blues", swatch: ["#0E1714", "#3E8A5A"] },
] as const;

const LANGUAGES = [
  { id: "en", label: "English", flag: "GB" },
  { id: "fr", label: "Français", flag: "FR" },
  { id: "de", label: "Deutsch", flag: "DE" },
  { id: "es", label: "Español", flag: "ES" },
  { id: "pt", label: "Português", flag: "PT" },
];

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn("btn-focus relative h-6 w-11 rounded-full border transition-colors", on ? "border-gold/50 bg-gold/30" : "border-silver/20 bg-ink-700")}
    >
      <motion.span
        layout
        className={cn("absolute top-0.5 h-5 w-5 rounded-full", on ? "right-0.5 bg-gold-300" : "left-0.5 bg-silver-400")}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

export function Settings() {
  const { mode, setMode, reducedMotion, setReducedMotion, contentDensity, setContentDensity } = useTheme();
  const toast = useToast();
  const { user, updateProfile } = useAuth();
  const [section, setSection] = useState<Section>("appearance");
  const [notifs, setNotifs] = useState({ grades: true, mail: true, events: true, homework: true, newsletter: false });
  const [language, setLanguage] = useState("en");
  const [contrast, setContrast] = useState(false);
  const [highContrastLabels, setHighContrastLabels] = useState(false);

  const sections: { id: Section; label: string; icon: typeof Palette }[] = [
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "language", label: "Language", icon: Languages },
    { id: "accessibility", label: "Accessibility", icon: Sliders },
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Settings"
          subtitle="Personalise your portal experience"
          icon={<SettingsIcon className="h-7 w-7" />}
          crumb={{ items: [{ label: "Account" }, { label: "Settings" }] }}
        />

        <Tabs tabs={sections.map((s) => ({ id: s.id, label: s.label, icon: <s.icon className="h-3.5 w-3.5" /> }))} value={section} onChange={setSection} />

        {section === "appearance" && (
          <div className="space-y-6">
            <Card>
              <CardHeader title="Theme" subtitle="Choose the atmosphere of the castle" />
              <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setMode(t.id)}
                    aria-pressed={mode === t.id}
                    className={cn(
                      "btn-focus group rounded-2xl border p-4 text-left transition-all",
                      mode === t.id ? "border-gold/50 bg-gold/10 shadow-glow-sm" : "border-silver/10 bg-ink-900/40 hover:border-gold/25"
                    )}
                  >
                    <div className="flex h-14 items-center gap-2 rounded-lg border border-silver/10 p-2" style={{ background: t.swatch[0] }}>
                      <span className="h-full w-1/3 rounded" style={{ background: t.swatch[1] }} />
                      <span className="h-full w-1/3 rounded bg-ink-700" />
                      <span className="h-full w-1/3 rounded bg-silver/20" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-beige-100">{t.label}</p>
                    <p className="text-xs text-silver-500">{t.desc}</p>
                  </button>
                ))}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Content Density" subtitle="How much fits on screen" />
              <CardBody>
                <div className="flex gap-2">
                  {(["comfortable", "compact"] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setContentDensity(d)}
                      className={cn(
                        "btn-focus rounded-xl border px-4 py-2.5 text-sm transition-colors capitalize",
                        contentDensity === d ? "border-gold/50 bg-gold/10 text-gold-200" : "border-silver/15 text-silver-400 hover:text-beige-100"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Profile Customization" subtitle="How you appear across the portal" />
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-beige-100">Display name</p>
                    <p className="text-xs text-silver-500">{user.name}</p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => toast.info("Redirecting", "Head to your profile to edit these fields.")}>Edit</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-beige-100">Show house points on dashboard</p>
                    <p className="text-xs text-silver-500">Always visible to you</p>
                  </div>
                  <Toggle on label="Show house points" onChange={(v) => { toast.info("Saved", v ? "House points visible" : "House points hidden"); }} />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { updateProfile({ housePoints: 0 }); toast.success("Reset complete", "House points reset to zero (just a mock)."); }}
                >
                  Reset house points
                </Button>
              </CardBody>
            </Card>
          </div>
        )}

        {section === "notifications" && (
          <Card>
            <CardHeader title="Notification Preferences" subtitle="Choose what reaches your inbox" />
            <CardBody className="space-y-5">
              {(
                [
                  { key: "grades", label: "New grades", desc: "When a professor publishes a mark", on: notifs.grades },
                  { key: "mail", label: "Owl mail", desc: "When a new letter arrives", on: notifs.mail },
                  { key: "events", label: "Events", desc: "Matches, feasts and trips", on: notifs.events },
                  { key: "homework", label: "Homework reminders", desc: "Due date nudges", on: notifs.homework },
                  { key: "newsletter", label: "Daily Prophet digest", desc: "A morning summary of the castle", on: notifs.newsletter },
                ] as const
              ).map((n) => (
                <div key={n.key} className="flex items-center justify-between border-b border-silver/5 pb-4 last:border-0">
                  <div>
                    <p className="text-sm text-beige-100">{n.label}</p>
                    <p className="text-xs text-silver-500">{n.desc}</p>
                  </div>
                  <Toggle on={n.on} label={`Toggle ${n.label}`} onChange={(v) => { setNotifs((p) => ({ ...p, [n.key]: v })); toast.info(v ? "Enabled" : "Disabled", n.label); }} />
                </div>
              ))}
            </CardBody>
          </Card>
        )}

        {section === "language" && (
          <Card>
            <CardHeader title="Language" subtitle="Interface language (visualisation only)" />
            <CardBody>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLanguage(l.id)}
                    aria-pressed={language === l.id}
                    className={cn(
                      "btn-focus flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                      language === l.id ? "border-gold/50 bg-gold/10" : "border-silver/10 bg-ink-900/40 hover:border-gold/25"
                    )}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-700 text-sm font-bold text-beige-100">{l.flag}</span>
                    <span className="text-sm text-beige-100">{l.label}</span>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-silver-600">This demo always renders in English regardless of selection.</p>
            </CardBody>
          </Card>
        )}

        {section === "accessibility" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader title="Motion & Comfort" subtitle="Reduce visual stimulation" />
              <CardBody className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-5 w-5 text-silver-400" />
                    <div>
                      <p className="text-sm text-beige-100">Reduced motion</p>
                      <p className="text-xs text-silver-500">Minimise animations and floating effects</p>
                    </div>
                  </div>
                  <Toggle on={reducedMotion} label="Reduced motion" onChange={setReducedMotion} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-beige-100">High contrast</p>
                    <p className="text-xs text-silver-500">Increase contrast between text and surfaces</p>
                  </div>
                  <Toggle on={contrast} label="High contrast" onChange={setContrast} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-beige-100">Emphasised labels</p>
                    <p className="text-xs text-silver-500">Bold labels across the interface</p>
                  </div>
                  <Toggle on={highContrastLabels} label="Emphasised labels" onChange={setHighContrastLabels} />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Keyboard & Screen Readers" subtitle="Built-in support" />
              <CardBody className="space-y-3 text-sm text-silver-400">
                <p className="flex items-center gap-2"><kbd className="rounded border border-silver/20 bg-ink-700 px-1.5 py-0.5 text-xs">Tab</kbd> Navigate focusable elements</p>
                <p className="flex items-center gap-2"><kbd className="rounded border border-silver/20 bg-ink-700 px-1.5 py-0.5 text-xs">Enter</kbd> Activate buttons & links</p>
                <p className="flex items-center gap-2"><kbd className="rounded border border-silver/20 bg-ink-700 px-1.5 py-0.5 text-xs">Esc</kbd> Close dialogs & menus</p>
                <p className="flex items-center gap-2"><kbd className="rounded border border-silver/20 bg-ink-700 px-1.5 py-0.5 text-xs">Space</kbd> Toggle switches</p>
                <p className="mt-4 text-xs text-silver-600">
                  Every interactive element includes a visible focus ring and descriptive ARIA label. All decorative motion pauses under <code className="text-gold-300">prefers-reduced-motion</code>.
                </p>
              </CardBody>
            </Card>
          </div>
        )}
      </div>
    </PageTransition>
  );
}