import type {
  StudentProfile,
  Subject,
  ClassSlot,
  Assignment,
  GradeRecord,
  Book,
  Message,
  Match,
  TeamRow,
  PlayerStat,
  Announcement,
  Event,
  Notification,
  HousePoint,
  CastleLocation,
  Quote,
  Weather,
  CalendarEvent,
} from "@/types";

export const studentProfile: StudentProfile = {
  id: "S-2409",
  name: "Seraphina Ravenwood",
  avatar: "",
  initials: "SR",
  house: "Ravenclaw",
  year: 5,
  title: "Prefect of Ravenclaw",
  wand: "Holly, 11¾ in, phoenix feather",
  patronus: "Silver Raven",
  magicLevel: 78,
  experience: 2840,
  experienceToNext: 3600,
  housePoints: 1420,
  gpa: 4.6,
  attendance: 96,
  bio: "A curious scholar with a penchant for ancient runes and defensive enchantments. When not buried in the Restricted Section, she captains the dueling club and tutors first years in Charms.",
  skills: ["Duelling", "Runes", "Arithmancy", "Potions", "Care of Magical Creatures"],
  abilities: [
    "Patronus Charm",
    "Apparition",
    "Occlumency",
    "Advanced Transfiguration",
    "Non-verbal Casting",
  ],
  achievements: [
    {
      id: "ach-1",
      title: "Runes Mastery",
      description: "Achieved Outstanding on the Advanced Ancient Runes practical.",
      icon: "scroll",
      date: "2026-03-14",
      rarity: "Rare",
    },
    {
      id: "ach-2",
      title: "Prefect Appointed",
      description: "Appointed Prefect of Ravenclaw house.",
      icon: "shield",
      date: "2025-09-02",
      rarity: "Legendary",
    },
    {
      id: "ach-3",
      title: "Dueling Champion",
      description: "Won the Junior Dueling Championship.",
      icon: "swords",
      date: "2025-05-20",
      rarity: "Rare",
    },
    {
      id: "ach-4",
      title: "Owl Post Reliability",
      description: "Delivered 100 letters without a single mishap.",
      icon: "bird",
      date: "2024-11-11",
      rarity: "Common",
    },
  ],
};

export const subjects: Subject[] = [
  { id: "ch", name: "Charms", professor: "Professor A. Lumina", room: "Tower 4", color: "#D4AF37", icon: "wand", credits: 4 },
  { id: "pot", name: "Potions", professor: "Professor E. Thornwick", room: "Dungeon 2", color: "#6A1B1A", icon: "flask", credits: 4 },
  { id: "tf", name: "Transfiguration", professor: "Professor C. Mirren", room: "Tower 6", color: "#1E5631", icon: "diamond", credits: 3 },
  { id: "dada", name: "Defence Against the Dark Arts", professor: "Professor R. Blackwood", room: "Hall 3", color: "#C0C0C0", icon: "shield", credits: 4 },
  { id: "ast", name: "Astronomy", professor: "Professor S. Celeste", room: "Observatory", color: "#7B68EE", icon: "telescope", credits: 2 },
  { id: "run", name: "Ancient Runes", professor: "Professor M. Sable", room: "Library Annex", color: "#D2691E", icon: "scroll", credits: 3 },
  { id: "coc", name: "Care of Magical Creatures", professor: "Professor H. Greenleaf", room: "Outer Grounds", color: "#228B22", icon: "feather", credits: 2 },
  { id: "his", name: "History of Magic", professor: "Professor W. Ashmore", room: "Hall 2", color: "#8B7355", icon: "book", credits: 2 },
];

export const classSlots: ClassSlot[] = [
  { id: "c1", subjectId: "ch", day: 0, start: "09:00", end: "10:30", location: "Tower 4" },
  { id: "c2", subjectId: "dada", day: 0, start: "11:00", end: "12:30", location: "Hall 3" },
  { id: "c3", subjectId: "ast", day: 0, start: "14:00", end: "15:30", location: "Observatory" },
  { id: "c4", subjectId: "pot", day: 1, start: "09:00", end: "10:30", location: "Dungeon 2" },
  { id: "c5", subjectId: "run", day: 1, start: "11:00", end: "12:30", location: "Library Annex" },
  { id: "c6", subjectId: "tf", day: 1, start: "13:00", end: "14:30", location: "Tower 6" },
  { id: "c7", subjectId: "ch", day: 2, start: "10:00", end: "11:30", location: "Tower 4" },
  { id: "c8", subjectId: "his", day: 2, start: "12:00", end: "13:00", location: "Hall 2" },
  { id: "c9", subjectId: "coc", day: 2, start: "14:30", end: "16:00", location: "Outer Grounds" },
  { id: "c10", subjectId: "pot", day: 3, start: "09:00", end: "10:30", location: "Dungeon 2" },
  { id: "c11", subjectId: "dada", day: 3, start: "11:00", end: "12:30", location: "Hall 3" },
  { id: "c12", subjectId: "ast", day: 3, start: "20:00", end: "21:30", location: "Observatory" },
  { id: "c13", subjectId: "tf", day: 4, start: "09:00", end: "10:30", location: "Tower 6" },
  { id: "c14", subjectId: "run", day: 4, start: "11:30", end: "13:00", location: "Library Annex" },
  { id: "c15", subjectId: "coc", day: 4, start: "14:00", end: "15:30", location: "Outer Grounds" },
  { id: "c16", subjectId: "his", day: 5, start: "10:00", end: "11:00", location: "Hall 2" },
];

export const initialAssignments: Assignment[] = [
  { id: "a1", subjectId: "pot", title: "Amortentia Essence Essay", dueDate: "2026-08-08", priority: "High", status: "Pending", description: "Analyse the properties and ethical implications of the strongest love potion in existence." },
  { id: "a2", subjectId: "dada", title: "Patronus Practicum Report", dueDate: "2026-08-09", priority: "Medium", status: "In Progress", description: "Document your attempts, visualisation technique and successful conjurations of a corporeal Patronus." },
  { id: "a3", subjectId: "ch", title: "Wingardium Leviosa Fluid Motion", dueDate: "2026-08-06", priority: "Low", status: "Completed", description: "Perfect the swish-and-flick with precision control over weight distribution." },
  { id: "a4", subjectId: "run", title: "Elder Futhark Translation", dueDate: "2026-08-12", priority: "High", status: "Pending", description: "Translate and contextualise the rune carvings from the Hogsmeade cairn." },
  { id: "a5", subjectId: "tf", title: "Vanishing Spell Theory", dueDate: "2026-08-10", priority: "Medium", status: "In Progress", description: "Explain the conservation of mass in transfigurative disappearance and reappearance." },
  { id: "a6", subjectId: "ast", title: "Jupiter Orbit Charting", dueDate: "2026-08-15", priority: "Low", status: "Pending", description: "Chart the observed motion of Jupiter's largest moons over a fortnight." },
  { id: "a7", subjectId: "coc", title: "Creature Care Journal", dueDate: "2026-08-07", priority: "Medium", status: "Completed", description: "Weekly observations on the feeding and habitat of the Hippogriff paddock." },
  { id: "a8", subjectId: "his", title: "Goblin Rebellions Timeline", dueDate: "2026-08-18", priority: "Low", status: "Pending", description: "Construct an annotated timeline of the Goblin Rebellions with key figures." },
];

export const gradeRecords: GradeRecord[] = [
  { id: "g1", subjectId: "ch", name: "Term 1 Practical", score: 94, grade: "O", semester: "Autumn 2025", date: "2025-11-21", weight: 25 },
  { id: "g2", subjectId: "ch", name: "Term 2 Theory", score: 88, grade: "E", semester: "Autumn 2025", date: "2026-01-16", weight: 25 },
  { id: "g3", subjectId: "pot", name: "Term 1 Practical", score: 82, grade: "E", semester: "Autumn 2025", date: "2025-11-28", weight: 25 },
  { id: "g4", subjectId: "pot", name: "Term 2 Theory", score: 79, grade: "A", semester: "Autumn 2025", date: "2026-01-22", weight: 25 },
  { id: "g5", subjectId: "dada", name: "Practical Duel", score: 91, grade: "O", semester: "Autumn 2025", date: "2025-12-05", weight: 30 },
  { id: "g6", subjectId: "dada", name: "Term 2 Theory", score: 85, grade: "E", semester: "Autumn 2025", date: "2026-01-28", weight: 30 },
  { id: "g7", subjectId: "run", name: "Translation Exam", score: 87, grade: "E", semester: "Autumn 2025", date: "2025-12-12", weight: 30 },
  { id: "g8", subjectId: "ast", name: "Observation Log", score: 93, grade: "O", semester: "Autumn 2025", date: "2026-01-09", weight: 20 },
  { id: "g9", subjectId: "tf", name: "Transfiguration Trial", score: 76, grade: "A", semester: "Autumn 2025", date: "2025-12-19", weight: 25 },
  { id: "g10", subjectId: "coc", name: "Field Assessment", score: 89, grade: "E", semester: "Autumn 2025", date: "2026-01-14", weight: 20 },
  { id: "g11", subjectId: "his", name: "Essay Series", score: 84, grade: "E", semester: "Autumn 2025", date: "2026-01-30", weight: 20 },
  { id: "g12", subjectId: "ch", name: "Mid-Year Exam", score: 92, grade: "O", semester: "Spring 2026", date: "2026-03-20", weight: 30 },
  { id: "g13", subjectId: "pot", name: "Mid-Year Exam", score: 81, grade: "E", semester: "Spring 2026", date: "2026-03-21", weight: 30 },
  { id: "g14", subjectId: "dada", name: "Mid-Year Exam", score: 90, grade: "O", semester: "Spring 2026", date: "2026-03-22", weight: 30 },
  { id: "g15", subjectId: "run", name: "Mid-Year Exam", score: 86, grade: "E", semester: "Spring 2026", date: "2026-03-23", weight: 30 },
  { id: "g16", subjectId: "ast", name: "Mid-Year Exam", score: 91, grade: "O", semester: "Spring 2026", date: "2026-03-24", weight: 30 },
];

export const books: Book[] = [
  { id: "b1", title: "Advanced Potion-Making", author: "Libatius Borage", category: "Potions", cover: "P", rating: 4.7, pages: 648, borrowed: true, dueDate: "2026-08-14", bookmarked: true, progress: 62, borrowHistory: [{ date: "2026-07-12", action: "Borrowed" }, { date: "2026-05-02", action: "Returned" }] },
  { id: "b2", title: "The Standard Book of Spells, Grade 5", author: "Miranda Goshawk", category: "Charms", cover: "S", rating: 4.5, pages: 412, borrowed: false, bookmarked: false, progress: 100, borrowHistory: [{ date: "2026-01-08", action: "Borrowed" }, { date: "2026-03-30", action: "Returned" }] },
  { id: "b3", title: "A History of Magic", author: "Bathilda Bagshot", category: "History", cover: "H", rating: 4.9, pages: 1024, borrowed: false, bookmarked: true, progress: 38, borrowHistory: [{ date: "2026-02-20", action: "Borrowed" }, { date: "2026-04-01", action: "Returned" }] },
  { id: "b4", title: "Magical Theory", author: "Adalbert Waffling", category: "Theory", cover: "T", rating: 4.4, pages: 288, borrowed: false, bookmarked: false, progress: 0, borrowHistory: [] },
  { id: "b5", title: "Fantastic Beasts and Where to Find Them", author: "Newt Scamander", category: "Creatures", cover: "F", rating: 4.8, pages: 560, borrowed: true, dueDate: "2026-08-20", bookmarked: true, progress: 21, borrowHistory: [{ date: "2026-07-01", action: "Borrowed" }] },
  { id: "b6", title: "The Tales of Beedle the Bard", author: "Beedle the Bard", category: "Stories", cover: "T", rating: 4.6, pages: 156, borrowed: false, bookmarked: false, progress: 100, borrowHistory: [{ date: "2025-12-10", action: "Borrowed" }, { date: "2026-01-05", action: "Returned" }] },
  { id: "b7", title: "Grimoire of the Ancient Runes", author: "Elsbeth Runevale", category: "Runes", cover: "G", rating: 4.3, pages: 732, borrowed: false, bookmarked: true, progress: 0, borrowHistory: [] },
  { id: "b8", title: "One Thousand Magical Herbs and Fungi", author: "Phyllida Spore", category: "Herbology", cover: "O", rating: 4.5, pages: 402, borrowed: false, bookmarked: false, progress: 0, borrowHistory: [{ date: "2025-10-14", action: "Borrowed" }, { date: "2025-12-01", action: "Returned" }] },
  { id: "b9", title: "Dark Forces: A Guide to Self-Protection", author: "Quentin Trimble", category: "Defence", cover: "D", rating: 4.7, pages: 512, borrowed: true, dueDate: "2026-08-10", bookmarked: false, progress: 45, borrowHistory: [{ date: "2026-06-18", action: "Borrowed" }] },
  { id: "b10", title: "Celestial Navigation for Witches", author: "Aurora Sinistra", category: "Astronomy", cover: "C", rating: 4.2, pages: 348, borrowed: false, bookmarked: false, progress: 0, borrowHistory: [] },
];

export const initialMessages: Message[] = [
  { id: "m1", from: "Professor A. Lumina", avatar: "", initials: "AL", subject: "Charms revision notes", preview: "The incantation for the Patronus Charm relies heavily on...", body: "Dear Ms. Ravenwood,\n\nI have attached the revised notes for this term's Charms practical. Pay particular attention to section three on non-verbal casting — your control there has been excellent and the examiners will look for it.\n\nWarm regards,\nProfessor A. Lumina", date: "2026-08-05T09:12:00", read: false, archived: false, starred: true, folder: "inbox" },
  { id: "m2", from: "Professor E. Thornwick", avatar: "", initials: "ET", subject: "Potion safety reminder", preview: "All fifth years are reminded that the dungeons will be...", body: "Dear students,\n\nA reminder that brewing hours in the dungeons are restricted to supervised slots. The Amortentia essay is due Friday — I expect references from at least three canonical texts.\n\nProfessor E. Thornwick", date: "2026-08-04T16:40:00", read: true, archived: false, starred: false, folder: "inbox" },
  { id: "m3", from: "Headmaster's Office", avatar: "", initials: "HO", subject: "End-of-term feast seating", preview: "The Great Hall will be decorated for the end-of-term feast...", body: "Students,\n\nThe end-of-term feast shall begin at six o'clock on the final Saturday. House tables are arranged by the elves; Prefects are kindly asked to assist first-years with seating.\n\nHeadmaster's Office", date: "2026-08-03T10:05:00", read: false, archived: false, starred: false, folder: "inbox" },
  { id: "m4", from: "Quidditch Captains", avatar: "", initials: "QC", subject: "Practice rescheduled", preview: "Tomorrow's pitch practice is moved to the morning slot...", body: "Team,\n\nDue to the weather forecast, tomorrow's practice moves to 7am sharp. Full kit required; the Seeker drills have been extended.\n\nYour Captains", date: "2026-08-02T20:15:00", read: true, archived: false, starred: true, folder: "inbox" },
  { id: "m5", from: "Professor C. Mirren", avatar: "", initials: "CM", subject: "Transfiguration essay feedback", preview: "An excellent paper overall — though the conservation argument...", body: "Dear Seraphina,\n\nYour essay on Vanishing Theory earned a well-deserved Outstanding. My only note: the conservation argument needs one more citation. Well done.\n\nProfessor C. Mirren", date: "2026-08-01T14:22:00", read: true, archived: false, starred: false, folder: "inbox" },
  { id: "m6", from: "Seraphina Ravenwood", avatar: "", initials: "SR", subject: "Library book renewal", preview: "Dear Madam Pince, I should like to renew 'Advanced Potion-Making'...", body: "Dear Madam Pince,\n\nI should like to renew \"Advanced Potion-Making\" for a further fortnight as my practical assessment approaches.\n\nYours sincerely,\nSeraphina Ravenwood", date: "2026-08-05T08:00:00", read: true, archived: false, starred: false, folder: "sent" },
  { id: "m7", from: "Seraphina Ravenwood", avatar: "", initials: "SR", subject: "Dueling club schedule", preview: "As club captain, I propose we hold practices in the...", body: "Fellow duellists,\n\nI propose we hold extra practices in the trophy room on Wednesday evenings. Reply to confirm availability.\n\nSeraphina", date: "2026-07-30T18:30:00", read: true, archived: false, starred: false, folder: "sent" },
  { id: "m8", from: "Hufflepuff Quidditch", avatar: "", initials: "HQ", subject: "Match scheduling enquiry", preview: "We would like to confirm the rescheduled fixture for next...", body: "To the Ravenclaw team,\n\nWe would like to confirm the rescheduled fixture for next Saturday afternoon. Do advise if the morning works better.\n\nHufflepuff Captain", date: "2026-07-28T11:45:00", read: false, archived: false, starred: false, folder: "inbox" },
  { id: "m9", from: "Professor R. Blackwood", avatar: "", initials: "RB", subject: "DADA: practical partners", preview: "For the duelling assessment, partners have been assigned...", body: "Students,\n\nPartners for the practical assessment have been posted outside the Defence classroom. Those without a partner are to see me before Thursday.\n\nProfessor R. Blackwood", date: "2026-07-25T09:50:00", read: true, archived: true, starred: false, folder: "archive" },
];

export const matches: Match[] = [
  { id: "mt1", home: "Gryffindor", away: "Slytherin", date: "2026-08-09", time: "15:00", location: "Quidditch Pitch", homeScore: 190, awayScore: 120, status: "finished" },
  { id: "mt2", home: "Ravenclaw", away: "Hufflepuff", date: "2026-08-02", time: "14:00", location: "Quidditch Pitch", homeScore: 160, awayScore: 210, status: "finished" },
  { id: "mt3", home: "Ravenclaw", away: "Gryffindor", date: "2026-08-16", time: "16:00", location: "Quidditch Pitch", status: "upcoming" },
  { id: "mt4", home: "Slytherin", away: "Hufflepuff", date: "2026-08-17", time: "13:00", location: "Quidditch Pitch", status: "upcoming" },
  { id: "mt5", home: "Gryffindor", away: "Ravenclaw", date: "2026-07-20", time: "15:30", location: "Quidditch Pitch", homeScore: 130, awayScore: 170, status: "finished" },
  { id: "mt6", home: "Hufflepuff", away: "Slytherin", date: "2026-07-13", time: "14:30", location: "Quidditch Pitch", homeScore: 90, awayScore: 150, status: "finished" },
];

export const leagueTable: TeamRow[] = [
  { position: 1, team: "Slytherin", played: 3, won: 2, drawn: 0, lost: 1, points: 260 },
  { position: 2, team: "Ravenclaw", played: 3, won: 2, drawn: 0, lost: 1, points: 250 },
  { position: 3, team: "Gryffindor", played: 3, won: 1, drawn: 0, lost: 2, points: 240 },
  { position: 4, team: "Hufflepuff", played: 3, won: 1, drawn: 0, lost: 2, points: 210 },
];

export const playerStats: PlayerStat[] = [
  { id: "p1", name: "Seraphina Ravenwood", position: "Seeker", matches: 3, goals: 0, assists: 1, saves: 0, rating: 4.8 },
  { id: "p2", name: "Leo Ashworth", position: "Chaser", matches: 3, goals: 8, assists: 4, saves: 0, rating: 4.6 },
  { id: "p3", name: "Mira Voss", position: "Chaser", matches: 3, goals: 6, assists: 5, saves: 0, rating: 4.4 },
  { id: "p4", name: "Elias Whitmore", position: "Chaser", matches: 3, goals: 5, assists: 3, saves: 0, rating: 4.1 },
  { id: "p5", name: "Corinne Vale", position: "Beater", matches: 3, goals: 0, assists: 2, saves: 1, rating: 3.9 },
  { id: "p6", name: "Bram Wexler", position: "Beater", matches: 3, goals: 0, assists: 1, saves: 2, rating: 3.7 },
  { id: "p7", name: "Isolde Marsh", position: "Keeper", matches: 3, goals: 0, assists: 0, saves: 12, rating: 4.5 },
];

export const announcements: Announcement[] = [
  { id: "an1", title: "End-of-Term Feast", body: "The end-of-term feast will be held in the Great Hall on the final Saturday. Feast begins at six o'clock sharp; formal robes required.", date: "2026-08-04", author: "Headmaster's Office", tag: "School" },
  { id: "an2", title: "Library Restricted Section Night", body: "Sixth and seventh years may access the Restricted Section under supervision this Thursday night for research purposes.", date: "2026-08-03", author: "Madam Pince", tag: "Library" },
  { id: "an3", title: "Dueling Club Finals", body: "The club championship will be decided Friday evening in the Trophy Room. Spectators welcome; charm refreshments provided.", date: "2026-08-01", author: "Dueling Club", tag: "Club" },
  { id: "an4", title: "O.W.L. Revision Timetable", body: "Revision timetable for O.W.L. examinations is now available from your Head of House. Begin revision early.", date: "2026-07-28", author: "Examinations Office", tag: "Exams" },
  { id: "an5", title: "Hogsmeade Visit", body: "Permission slips for the next Hogsmeade visit are due by Friday. Unsigned slips will forfeit the trip.", date: "2026-07-25", author: "Administration", tag: "Trip" },
];

export const events: Event[] = [
  { id: "e1", title: "Quidditch: Ravenclaw vs Gryffindor", date: "2026-08-16", time: "16:00", location: "Quidditch Pitch", category: "Quidditch" },
  { id: "e2", title: "End-of-Term Feast", date: "2026-08-22", time: "18:00", location: "Great Hall", category: "School" },
  { id: "e3", title: "Dueling Club Finals", date: "2026-08-07", time: "19:00", location: "Trophy Room", category: "Club" },
  { id: "e4", title: "Astronomy Night: Meteor Shower", date: "2026-08-12", time: "21:00", location: "Observatory", category: "Academics" },
  { id: "e5", title: "Hogsmeade Visit", date: "2026-08-15", time: "09:00", location: "Hogsmeade Village", category: "Trip" },
  { id: "e6", title: "Potions Workshop", date: "2026-08-13", time: "15:00", location: "Dungeon 2", category: "Academics" },
];

export const initialNotifications: Notification[] = [
  { id: "n1", title: "New grade published", body: "Your Charms Mid-Year Exam has been graded: Outstanding.", time: 12, read: false, type: "grade" },
  { id: "n2", title: "Owl from Professor Lumina", body: "Revision notes for the Charms practical are waiting.", time: 48, read: false, type: "mail" },
  { id: "n3", title: "Quidditch practice", body: "Rescheduled to 7am — weather forecast changed.", time: 180, read: false, type: "event" },
  { id: "n4", title: "Homework due soon", body: "\"Amortentia Essence Essay\" is due in 3 days.", time: 1440, read: true, type: "homework" },
  { id: "n5", title: "House points awarded", body: "+15 points for excellence in runes translation.", time: 2880, read: true, type: "system" },
];

export const housePoints: HousePoint[] = [
  { id: "hp1", house: "Gryffindor", points: 1240, delta: 40, reason: "Weekly tally", date: "2026-08-01" },
  { id: "hp2", house: "Slytherin", points: 1180, delta: 55, reason: "Weekly tally", date: "2026-08-01" },
  { id: "hp3", house: "Ravenclaw", points: 1420, delta: 30, reason: "Weekly tally", date: "2026-08-01" },
  { id: "hp4", house: "Hufflepuff", points: 1310, delta: 25, reason: "Weekly tally", date: "2026-08-01" },
  { id: "hp5", house: "Ravenclaw", points: 1420, delta: 15, reason: "Runes excellence", date: "2026-08-03" },
  { id: "hp6", house: "Gryffindor", points: 1240, delta: 40, reason: "Dueling club win", date: "2026-08-04" },
  { id: "hp7", house: "Slytherin", points: 1180, delta: 10, reason: "Potion brew", date: "2026-08-05" },
];

export const castleLocations: CastleLocation[] = [
  { id: "cl1", name: "Great Hall", description: "The heart of the castle, where all students gather for feasts and ceremonies beneath an enchanted ceiling that mirrors the sky above.", x: 50, y: 32, icon: "hall", status: "Open", color: "#D4AF37" },
  { id: "cl2", name: "Library", description: "Thousands of towering shelves holding the knowledge of centuries. The Restricted Section lies beyond a locked gate at the far end.", x: 32, y: 44, icon: "library", status: "Open", color: "#C0C0C0" },
  { id: "cl3", name: "Dormitories", description: "The cosy common rooms and sleeping quarters of each house, guarded by portraits and passwords known only to their members.", x: 66, y: 46, icon: "bed", status: "Open", color: "#6A1B1A" },
  { id: "cl4", name: "Potion Lab", description: "A damp, atmospheric dungeon classroom where cauldrons bubble and shelves groan under jars of strange ingredients.", x: 18, y: 60, icon: "flask", status: "Open", color: "#1E5631" },
  { id: "cl5", name: "Greenhouse", description: "Beyond the castle walls, greenhouses nurture everything from Mandrakes to Venomous Tentacula under careful supervision.", x: 76, y: 22, icon: "leaf", status: "Open", color: "#228B22" },
  { id: "cl6", name: "Observatory", description: "The tallest tower, home to telescopes aimed at the stars and Professor Celeste's meticulous star charts.", x: 42, y: 14, icon: "telescope", status: "Open", color: "#7B68EE" },
  { id: "cl7", name: "Training Grounds", description: "Open fields and the Quidditch pitch where students practise flying, duelling and everything athletic.", x: 88, y: 58, icon: "target", status: "Reserved", color: "#D4AF37" },
];

export const calendarEvents: CalendarEvent[] = [
  { id: "ce1", date: "2026-08-05", title: "Charms revision", time: "09:00", color: "#D4AF37" },
  { id: "ce2", date: "2026-08-07", title: "Dueling finals", time: "19:00", color: "#6A1B1A" },
  { id: "ce3", date: "2026-08-08", title: "Potions essay due", time: "23:59", color: "#1E5631" },
  { id: "ce4", date: "2026-08-12", title: "Meteor shower night", time: "21:00", color: "#7B68EE" },
  { id: "ce5", date: "2026-08-15", title: "Hogsmeade visit", time: "09:00", color: "#D4AF37" },
  { id: "ce6", date: "2026-08-16", title: "Quidditch match", time: "16:00", color: "#C0C0C0" },
  { id: "ce7", date: "2026-08-22", title: "End-of-term feast", time: "18:00", color: "#6A1B1A" },
];

export const quotes: Quote[] = [
  { text: "It matters not what someone is born, but what they grow to be.", author: "Albus Dumbledore" },
  { text: "Happiness can be found even in the darkest of times, if one only remembers to turn on the light.", author: "Albus Dumbledore" },
  { text: "The things we lose have a way of coming back to us in the end, if not always in the way we expect.", author: "Luna Lovegood" },
  { text: "Curiosity is not a sin. But we should exercise caution with our curiosity.", author: "Albus Dumbledore" },
  { text: "It is our choices that show what we truly are, far more than our abilities.", author: "J.K. Rowling" },
  { text: "Words are, in my not-so-humble opinion, our most inexhaustible source of magic.", author: "Albus Dumbledore" },
];

export const weather: Weather = {
  condition: "Misty Rain",
  temperature: 13,
  feelsLike: 11,
  wind: 14,
  humidity: 87,
  forecast: [
    { day: "Mon", icon: "cloud-rain", high: 14, low: 9 },
    { day: "Tue", icon: "cloud", high: 16, low: 10 },
    { day: "Wed", icon: "cloud-sun", high: 18, low: 11 },
    { day: "Thu", icon: "sun", high: 19, low: 12 },
    { day: "Fri", icon: "cloud-rain", high: 15, low: 9 },
  ],
};

export const houseMeta: Record<
  string,
  { color: string; bg: string; border: string; motto: string; gradient: string }
> = {
  Gryffindor: {
    color: "#B33A3A",
    bg: "rgba(179,58,58,0.12)",
    border: "rgba(179,58,58,0.4)",
    motto: "Courage, nerve and chivalry.",
    gradient: "from-[#B33A3A] to-[#7E2222]",
  },
  Slytherin: {
    color: "#2E7D46",
    bg: "rgba(46,125,70,0.12)",
    border: "rgba(46,125,70,0.4)",
    motto: "Cunning, ambition and resourcefulness.",
    gradient: "from-[#2E7D46] to-[#1B4D2B]",
  },
  Ravenclaw: {
    color: "#4A6FA5",
    bg: "rgba(74,111,165,0.12)",
    border: "rgba(74,111,165,0.4)",
    motto: "Wit beyond measure is man's greatest treasure.",
    gradient: "from-[#4A6FA5] to-[#2E4673]",
  },
  Hufflepuff: {
    color: "#C9A227",
    bg: "rgba(201,162,39,0.12)",
    border: "rgba(201,162,39,0.4)",
    motto: "Patience, loyalty and hard work.",
    gradient: "from-[#C9A227] to-[#8A6E1B]",
  },
};

export const achievementIcons: Record<string, string> = {
  scroll: "scroll",
  shield: "shield",
  swords: "swords",
  bird: "bird",
};
