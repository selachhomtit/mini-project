/**
 * Static demo workspace used by the dashboard.
 * There is no backend: this data is the "database". Changes made in the UI are
 * saved to localStorage (see src/lib/services/localDb.ts).
 */
import type {
  Comment,
  MemberRole,
  Notification,
  TaskPriority,
  TaskStatus,
  UserProfile,
} from "@/lib/features/types/task-type";

/** ISO date `days` from now (negative = in the past). */
const daysFromNow = (days: number, hour = 9) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};
const dateOnly = (days: number) => daysFromNow(days).slice(0, 10);

// ── Users ──────────────────────────────────────────────────────────────────
export type SeedUser = UserProfile & { password: string };

export const DEMO_EMAIL = "demo@taskflow.com";
export const DEMO_PASSWORD = "Demo@1234";

export const USERS: SeedUser[] = [
  { id: "u1", fullName: "Sokha Chan", username: "sokha", email: DEMO_EMAIL, password: DEMO_PASSWORD, gender: "MALE", isVerified: true, createdAt: daysFromNow(-120) },
  { id: "u2", fullName: "Dara Meas", username: "dara", email: "dara@taskflow.com", password: DEMO_PASSWORD, gender: "MALE", isVerified: true, createdAt: daysFromNow(-110) },
  { id: "u3", fullName: "Sreyleak Phan", username: "sreyleak", email: "sreyleak@taskflow.com", password: DEMO_PASSWORD, gender: "FEMALE", isVerified: true, createdAt: daysFromNow(-100) },
  { id: "u4", fullName: "Vichea Kim", username: "vichea", email: "vichea@taskflow.com", password: DEMO_PASSWORD, gender: "MALE", isVerified: true, createdAt: daysFromNow(-90) },
  { id: "u5", fullName: "Bopha Sok", username: "bopha", email: "bopha@taskflow.com", password: DEMO_PASSWORD, gender: "FEMALE", isVerified: true, createdAt: daysFromNow(-80) },
  { id: "u6", fullName: "Rithy Heng", username: "rithy", email: "rithy@taskflow.com", password: DEMO_PASSWORD, gender: "MALE", isVerified: true, createdAt: daysFromNow(-70) },
];

// ── Teams ──────────────────────────────────────────────────────────────────
export type SeedTeam = { id: string; name: string; description: string; ownerId: string; createdAt: string };
export type SeedMember = { id: string; teamId: string; userId: string; role: MemberRole; joinedAt: string };

export const TEAMS: SeedTeam[] = [
  { id: "t1", name: "ISTAD Capstone", description: "Final-year group project: TaskFlow web app.", ownerId: "u1", createdAt: daysFromNow(-60) },
  { id: "t2", name: "Angkor Coffee Startup", description: "Delivery app and marketing for a Siem Reap coffee shop.", ownerId: "u2", createdAt: daysFromNow(-45) },
  { id: "t3", name: "Read Cambodia NGO", description: "Workshops and donor reporting across three provinces.", ownerId: "u3", createdAt: daysFromNow(-30) },
];

export const MEMBERS: SeedMember[] = [
  { id: "m1", teamId: "t1", userId: "u1", role: "OWNER", joinedAt: daysFromNow(-60) },
  { id: "m2", teamId: "t1", userId: "u4", role: "ADMIN", joinedAt: daysFromNow(-58) },
  { id: "m3", teamId: "t1", userId: "u5", role: "MEMBER", joinedAt: daysFromNow(-57) },
  { id: "m4", teamId: "t1", userId: "u6", role: "MEMBER", joinedAt: daysFromNow(-55) },
  { id: "m5", teamId: "t2", userId: "u2", role: "OWNER", joinedAt: daysFromNow(-45) },
  { id: "m6", teamId: "t2", userId: "u1", role: "ADMIN", joinedAt: daysFromNow(-44) },
  { id: "m7", teamId: "t2", userId: "u5", role: "MEMBER", joinedAt: daysFromNow(-40) },
  { id: "m8", teamId: "t3", userId: "u3", role: "OWNER", joinedAt: daysFromNow(-30) },
  { id: "m9", teamId: "t3", userId: "u1", role: "MEMBER", joinedAt: daysFromNow(-29) },
];

// ── Projects ───────────────────────────────────────────────────────────────
export type SeedProject = {
  id: string;
  name: string;
  description: string;
  color: string;
  teamId: string;
  startDate: string;
  dueDate: string;
};

export const PROJECTS: SeedProject[] = [
  { id: "p1", name: "TaskFlow Web App", description: "Next.js + Tailwind v4 frontend for the capstone.", color: "#059669", teamId: "t1", startDate: dateOnly(-50), dueDate: dateOnly(12) },
  { id: "p2", name: "Capstone Report", description: "Written report and slides for the final defense.", color: "#0EA5E9", teamId: "t1", startDate: dateOnly(-20), dueDate: dateOnly(20) },
  { id: "p3", name: "Delivery App MVP", description: "Order coffee and pay with ABA KHQR.", color: "#84CC16", teamId: "t2", startDate: dateOnly(-40), dueDate: dateOnly(6) },
  { id: "p4", name: "Khmer New Year Campaign", description: "Social media promotion for April.", color: "#F59E0B", teamId: "t2", startDate: dateOnly(-10), dueDate: dateOnly(30) },
  { id: "p5", name: "Battambang Reading Workshops", description: "Plan and report on reading workshops for grade 3–6 students.", color: "#EF4444", teamId: "t3", startDate: dateOnly(-25), dueDate: dateOnly(15) },
];

// ── Tasks ──────────────────────────────────────────────────────────────────
export type SeedTask = {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId?: string;
  parentTaskId?: string;
  assigneeIds: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
};

const task = (
  id: string,
  title: string,
  status: TaskStatus,
  priority: TaskPriority,
  due: number | undefined,
  extra: Partial<SeedTask> = {}
): SeedTask => ({
  id,
  title,
  status,
  priority,
  assigneeIds: ["u1"],
  dueDate: due === undefined ? undefined : dateOnly(due),
  createdAt: daysFromNow(-14),
  updatedAt: daysFromNow(-2),
  ...extra,
});

export const TASKS: SeedTask[] = [
  // Personal tasks (no project)
  task("k1", "Prepare demo video script", "TODO", "HIGH", 1, { description: "Outline the 5 pages and the dashboard flow for the recording." }),
  task("k2", "Review Tailwind v4 @theme docs", "IN_PROGRESS", "MEDIUM", 2),
  task("k3", "Pay internet bill (Cellcard)", "TODO", "LOW", 4),
  task("k4", "Buy Khmer New Year gifts", "DONE", "LOW", -3),
  task("k5", "Submit scholarship form", "TODO", "URGENT", -1, { description: "Bring a copy of the ID card and transcript." }),

  // p1 — TaskFlow Web App
  task("k10", "Build landing page sections", "DONE", "HIGH", -6, { projectId: "p1", assigneeIds: ["u1", "u5"] }),
  task("k11", "Dark mode for all pages", "DONE", "MEDIUM", -2, { projectId: "p1", assigneeIds: ["u4"] }),
  task("k12", "SEO metadata & sitemap", "IN_REVIEW", "HIGH", 1, { projectId: "p1", assigneeIds: ["u1"] }),
  task("k13", "Dashboard charts", "IN_PROGRESS", "MEDIUM", 4, { projectId: "p1", assigneeIds: ["u6"] }),
  task("k14", "Khmer translations", "TODO", "MEDIUM", 7, { projectId: "p1", assigneeIds: ["u5"] }),
  task("k15", "Mobile testing on 360px", "TODO", "LOW", 9, { projectId: "p1", assigneeIds: ["u4", "u6"] }),
  task("k16", "Fix navbar on iPhone SE", "DONE", "URGENT", -4, { projectId: "p1", parentTaskId: "k15", assigneeIds: ["u4"] }),
  task("k17", "Test Android Chrome", "TODO", "LOW", 8, { projectId: "p1", parentTaskId: "k15", assigneeIds: ["u6"] }),

  // p2 — Capstone Report
  task("k20", "Write chapter 1: Introduction", "DONE", "MEDIUM", -5, { projectId: "p2", assigneeIds: ["u5"] }),
  task("k21", "System design diagrams", "IN_PROGRESS", "HIGH", 3, { projectId: "p2", assigneeIds: ["u4"] }),
  task("k22", "Defense slides", "TODO", "HIGH", 15, { projectId: "p2", assigneeIds: ["u1"] }),

  // p3 — Delivery App MVP
  task("k30", "ABA KHQR payment screen", "IN_PROGRESS", "URGENT", 2, { projectId: "p3", assigneeIds: ["u1"] }),
  task("k31", "Menu with Khmer & English names", "DONE", "MEDIUM", -8, { projectId: "p3", assigneeIds: ["u5"] }),
  task("k32", "Rider tracking map", "TODO", "HIGH", 5, { projectId: "p3", assigneeIds: ["u2"] }),
  task("k33", "Survey 20 customers at Pub Street", "IN_REVIEW", "LOW", -2, { projectId: "p3", assigneeIds: ["u2", "u5"] }),

  // p4 — Khmer New Year Campaign
  task("k40", "Design Facebook banners", "TODO", "MEDIUM", 10, { projectId: "p4", assigneeIds: ["u5"] }),
  task("k41", "Book photographer", "TODO", "LOW", 14, { projectId: "p4", assigneeIds: ["u2"] }),

  // p5 — Battambang Reading Workshops
  task("k50", "Print 300 storybooks", "DONE", "HIGH", -10, { projectId: "p5", assigneeIds: ["u3"] }),
  task("k51", "Train 12 volunteer teachers", "IN_PROGRESS", "HIGH", 3, { projectId: "p5", assigneeIds: ["u3", "u1"] }),
  task("k52", "Donor report for Q3", "TODO", "URGENT", 6, { projectId: "p5", assigneeIds: ["u1"] }),
];

// ── Comments ───────────────────────────────────────────────────────────────
export type SeedComment = Omit<Comment, "author"> & { authorId: string };

export const COMMENTS: SeedComment[] = [
  { id: "c1", taskId: "k12", authorId: "u4", content: "Canonical URLs look good. Can you add the Open Graph image too?", createdAt: daysFromNow(-1, 10), updatedAt: daysFromNow(-1, 10) },
  { id: "c2", taskId: "k12", authorId: "u1", content: "Done — it's generated by app/opengraph-image.tsx.", createdAt: daysFromNow(-1, 14), updatedAt: daysFromNow(-1, 14) },
  { id: "c3", taskId: "k30", authorId: "u2", content: "Please test with the ABA sandbox QR before Friday.", createdAt: daysFromNow(-2, 11), updatedAt: daysFromNow(-2, 11) },
  { id: "c4", taskId: "k51", authorId: "u3", content: "Workshop venue confirmed at the provincial library.", createdAt: daysFromNow(-3, 9), updatedAt: daysFromNow(-3, 9) },
];

// ── Notifications ──────────────────────────────────────────────────────────
export const NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "TASK_ASSIGNED", message: "Dara Meas assigned you “ABA KHQR payment screen”.", referenceId: "k30", referenceType: "TASK", isRead: false, createdAt: daysFromNow(0, 8) },
  { id: "n2", type: "DUE_DATE_REMINDER", message: "“SEO metadata & sitemap” is due tomorrow.", referenceId: "k12", referenceType: "TASK", isRead: false, createdAt: daysFromNow(0, 7) },
  { id: "n3", type: "OVERDUE_TASK", message: "“Submit scholarship form” is overdue.", referenceId: "k5", referenceType: "TASK", isRead: false, createdAt: daysFromNow(-1, 18) },
  { id: "n4", type: "TEAM_INVITATION", message: "Rithy Heng invited you to join “Phnom Penh Hackathon 2026”.", referenceId: "inv1", referenceType: "INVITATION", isRead: false, createdAt: daysFromNow(-1, 12) },
  { id: "n5", type: "COMMENT_ADDED", message: "Vichea Kim commented on “SEO metadata & sitemap”.", referenceId: "k12", referenceType: "TASK", isRead: true, createdAt: daysFromNow(-1, 10) },
  { id: "n6", type: "PROJECT_UPDATED", message: "“Battambang Reading Workshops” due date was updated.", referenceId: "p5", referenceType: "PROJECT", isRead: true, createdAt: daysFromNow(-3, 15) },
];

/** Pending invitations that the TEAM_INVITATION notification points to. */
export const INVITATIONS = [
  { id: "inv1", teamName: "Phnom Penh Hackathon 2026", description: "48-hour hackathon team.", invitedById: "u6" },
];

export const ACTIVITY = [
  { activityType: "TASK_COMPLETED", description: "Vichea Kim completed “Dark mode for all pages”", timestamp: daysFromNow(-2, 16) },
  { activityType: "TASK_CREATED", description: "Sokha Chan created “SEO metadata & sitemap”", timestamp: daysFromNow(-3, 10) },
  { activityType: "COMMENT_ADDED", description: "Dara Meas commented on “ABA KHQR payment screen”", timestamp: daysFromNow(-2, 11) },
  { activityType: "TASK_COMPLETED", description: "Sreyleak Phan completed “Print 300 storybooks”", timestamp: daysFromNow(-4, 9) },
  { activityType: "PROJECT_CREATED", description: "Dara Meas created “Khmer New Year Campaign”", timestamp: daysFromNow(-5, 14) },
  { activityType: "TASK_COMPLETED", description: "Bopha Sok completed “Menu with Khmer & English names”", timestamp: daysFromNow(-6, 13) },
  { activityType: "MEMBER_JOINED", description: "Rithy Heng joined “ISTAD Capstone”", timestamp: daysFromNow(-6, 9) },
];
