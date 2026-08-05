export type House = "Gryffindor" | "Slytherin" | "Ravenclaw" | "Hufflepuff";

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  house: House;
  year: number;
  title: string;
  wand: string;
  patronus: string;
  magicLevel: number;
  experience: number;
  experienceToNext: number;
  housePoints: number;
  gpa: number;
  attendance: number;
  bio: string;
  skills: string[];
  abilities: string[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
  rarity: "Common" | "Rare" | "Legendary";
}

export interface Subject {
  id: string;
  name: string;
  professor: string;
  room: string;
  color: string;
  icon: string;
  credits: number;
}

export interface ClassSlot {
  id: string;
  subjectId: string;
  day: number;
  start: string;
  end: string;
  location: string;
}

export interface Assignment {
  id: string;
  subjectId: string;
  title: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Completed";
  description: string;
}

export interface GradeRecord {
  id: string;
  subjectId: string;
  name: string;
  score: number;
  grade: string;
  semester: string;
  date: string;
  weight: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  cover: string;
  rating: number;
  pages: number;
  borrowed: boolean;
  dueDate?: string;
  bookmarked: boolean;
  progress: number;
  borrowHistory: { date: string; action: string }[];
}

export interface Message {
  id: string;
  from: string;
  avatar: string;
  initials: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  read: boolean;
  archived: boolean;
  starred: boolean;
  folder: "inbox" | "sent" | "archive";
}

export interface Match {
  id: string;
  home: string;
  away: string;
  date: string;
  time: string;
  location: string;
  homeScore?: number;
  awayScore?: number;
  status: "upcoming" | "live" | "finished";
}

export interface TeamRow {
  position: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
}

export interface PlayerStat {
  id: string;
  name: string;
  position: string;
  matches: number;
  goals: number;
  assists: number;
  saves: number;
  rating: number;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  author: string;
  tag: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: number;
  read: boolean;
  type: "grade" | "mail" | "event" | "system" | "homework";
}

export interface HousePoint {
  id: string;
  house: House;
  points: number;
  delta: number;
  reason: string;
  date: string;
}

export interface CastleLocation {
  id: string;
  name: string;
  description: string;
  x: number;
  y: number;
  icon: string;
  status: string;
  color: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  time: string;
  color: string;
}

export interface Quote {
  text: string;
  author: string;
}

export interface Weather {
  condition: string;
  temperature: number;
  feelsLike: number;
  wind: number;
  humidity: number;
  forecast: { day: string; icon: string; high: number; low: number }[];
}
