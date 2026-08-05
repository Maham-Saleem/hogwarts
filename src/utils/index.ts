export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-GB", opts ?? { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(date)
  );
}

export function formatRelative(date: string | Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function timeAgoFromMinutes(minutes: number): string {
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function scoreToGrade(score: number): string {
  if (score >= 90) return "O";
  if (score >= 80) return "E";
  if (score >= 70) return "A";
  if (score >= 60) return "P";
  if (score >= 50) return "D";
  return "T";
}

export function gradeColor(grade: string): string {
  switch (grade) {
    case "O":
      return "text-gold-300 border-gold/50 bg-gold/10";
    case "E":
      return "text-emerald2-200 border-emerald2-200/50 bg-emerald2-200/10";
    case "A":
      return "text-silver-300 border-silver-300/40 bg-silver-300/10";
    case "P":
      return "text-beige-200 border-beige-200/40 bg-beige-200/10";
    default:
      return "text-wine-300 border-wine-300/40 bg-wine-300/10";
  }
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const todayIndex = (): number => (new Date().getDay() + 6) % 7;
