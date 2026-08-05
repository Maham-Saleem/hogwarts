import {
  BookOpen,
  CalendarDays,
  Castle,
  GraduationCap,
  KanbanSquare,
  LayoutDashboard,
  Mail,
  Map as MapIcon,
  Settings,
  Sparkles,
  Trophy,
  User,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
  group?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, end: true, group: "Overview" },
  { label: "Timetable", to: "/timetable", icon: CalendarDays, group: "Overview" },
  { label: "House Cup", to: "/house-cup", icon: Trophy, group: "Academics" },
  { label: "Grades", to: "/grades", icon: GraduationCap, group: "Academics" },
  { label: "Homework", to: "/homework", icon: KanbanSquare, group: "Academics" },
  { label: "Library", to: "/library", icon: BookOpen, group: "Resources" },
  { label: "Owl Mail", to: "/owl-mail", icon: Mail, group: "Resources" },
  { label: "Quidditch", to: "/quidditch", icon: Sparkles, group: "Extracurricular" },
  { label: "Castle Map", to: "/castle-map", icon: MapIcon, group: "Extracurricular" },
  { label: "Profile", to: "/profile", icon: User, group: "Account" },
  { label: "Settings", to: "/settings", icon: Settings, group: "Account" },
];

export const NAV_GROUPS = ["Overview", "Academics", "Resources", "Extracurricular", "Account"];

export const BOTTOM_NAV = [
  { label: "Home", to: "/", icon: LayoutDashboard },
  { label: "Classes", to: "/timetable", icon: CalendarDays },
  { label: "Homework", to: "/homework", icon: KanbanSquare },
  { label: "Mail", to: "/owl-mail", icon: Mail },
  { label: "More", to: "/castle-map", icon: Castle },
];