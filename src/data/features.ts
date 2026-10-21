import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  CalendarClock,
  Columns3,
  Languages,
  ListChecks,
  MessageSquare,
  MoonStar,
  ShieldCheck,
  Smartphone,
  Users,
  Workflow,
} from "lucide-react";

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Tailwind classes for the icon badge (light + dark) */
  tone: string;
};

export const CORE_FEATURES: Feature[] = [
  {
    icon: Columns3,
    title: "Kanban Boards",
    description:
      "Move cards from To Do to Done and see the whole sprint at a glance. Columns match how your team really works.",
    tone: "bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400",
  },
  {
    icon: ListChecks,
    title: "Tasks & Subtasks",
    description:
      "Break big work into subtasks with priorities, due dates, and assignees. Nothing slips through the cracks.",
    tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  {
    icon: Users,
    title: "Team Workspaces",
    description:
      "Invite classmates or co-workers, create projects per team, and control who can edit with member roles.",
    tone: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
  },
  {
    icon: MessageSquare,
    title: "Comments",
    description:
      "Discuss a task right where the work lives. Every decision stays attached to the card it belongs to.",
    tone: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Get notified when you are assigned, mentioned, or invited — and see unread counts from anywhere in the app.",
    tone: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
  },
  {
    icon: BarChart3,
    title: "Dashboard & Charts",
    description:
      "Completion gauges, status donuts, and due-date timelines show exactly where every project stands.",
    tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
];

/** Features that make Ponleu fit teams in Cambodia. */
export const LOCAL_FEATURES: Feature[] = [
  {
    icon: Languages,
    title: "English & ខ្មែរ",
    description:
      "Switch the whole interface between English and Khmer with one click, using the Suwannaphum Khmer typeface.",
    tone: "bg-brand-100 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400",
  },
  {
    icon: Smartphone,
    title: "Mobile-first",
    description:
      "Most Cambodian users browse on phones. Every screen is designed to work on a 360px display over 4G.",
    tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  {
    icon: CalendarClock,
    title: "Local holidays aware",
    description:
      "Plan sprints around Khmer New Year, Pchum Ben, and the Water Festival so deadlines stay realistic.",
    tone: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
  {
    icon: MoonStar,
    title: "Dark mode",
    description:
      "Late-night study sessions are easier on the eyes. Ponleu remembers your theme on every visit.",
    tone: "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
  },
  {
    icon: Workflow,
    title: "Built for group projects",
    description:
      "Made for university capstones and bootcamp teams: one board per project, one place for every deadline.",
    tone: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-400",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description:
      "JWT sign-in, protected dashboard routes, and HTTP-only API proxying keep your workspace private.",
    tone: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
  },
];

export type Step = { num: string; title: string; description: string };

export const HOW_IT_WORKS: Step[] = [
  {
    num: "01",
    title: "Create your team",
    description:
      "Sign up free, create a team for your class, startup, or NGO, and invite members by email.",
  },
  {
    num: "02",
    title: "Add projects & tasks",
    description:
      "Each project gets its own board. Add tasks with priority, due date, assignee, and subtasks.",
  },
  {
    num: "03",
    title: "Move work forward",
    description:
      "Drag cards across columns as work progresses. Everyone sees the same source of truth.",
  },
];

export const SPRINT_PREVIEW = [
  { label: "To Do", dot: "bg-slate-400", items: ["Survey Phsar Thmei vendors", "Write user stories", "Khmer copy review"] },
  { label: "In Progress", dot: "bg-blue-500", items: ["Design ABA payment screen", "API: task comments"] },
  { label: "Done", dot: "bg-emerald-500", items: ["Logo & brand colors", "Login page"] },
];

export const AUDIENCES = [
  "Universities",
  "Bootcamps",
  "Startups",
  "NGOs",
  "Agencies",
  "Cafés & SMEs",
  "Student clubs",
  "Freelancers",
];
