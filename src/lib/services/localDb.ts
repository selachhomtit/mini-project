/**
 * In-browser "database" for the demo dashboard.
 * Seeds from the static data in src/data/workspace.ts and saves every change to
 * localStorage, so the app works with no backend and survives page reloads.
 */
import {
  ACTIVITY,
  COMMENTS,
  INVITATIONS,
  MEMBERS,
  NOTIFICATIONS,
  PROJECTS,
  TASKS,
  TEAMS,
  USERS,
} from "@/data/workspace";
import { getAvatarColor, getInitials } from "@/lib/features/team/team.utils";
import type {
  Comment,
  PageResponse,
  Project,
  Task,
  Team,
  TeamMember,
  UserProfile,
} from "@/lib/features/types/task-type";

const STORAGE_KEY = "taskflow-demo-db-v1";

const seed = () => ({
  users: structuredClone(USERS),
  teams: structuredClone(TEAMS),
  members: structuredClone(MEMBERS),
  projects: structuredClone(PROJECTS),
  tasks: structuredClone(TASKS),
  comments: structuredClone(COMMENTS),
  notifications: structuredClone(NOTIFICATIONS),
  invitations: structuredClone(INVITATIONS),
  activity: structuredClone(ACTIVITY),
});

export type Db = ReturnType<typeof seed>;

let cache: Db | null = null;

/** Returns the database, loading it from localStorage (or the seed) on first use. */
export function db(): Db {
  if (cache) return cache;
  try {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    cache = saved ? (JSON.parse(saved) as Db) : seed();
  } catch {
    cache = seed();
  }
  return cache;
}

/** Persists the database after a change. */
export function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db()));
  } catch {
    // Storage full or blocked (private mode) — keep working in memory.
  }
}

/** Restores the original static demo data. */
export function resetDb() {
  cache = seed();
  save();
}

export const newId = (prefix: string) => `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export const now = () => new Date().toISOString();

/** Small delay so loading skeletons are visible, like a real network request. */
export const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export function paginate<T>(items: T[], page = 0, size = 20): PageResponse<T> {
  return {
    content: items.slice(page * size, page * size + size),
    totalElements: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / size)),
    number: page,
    size,
  };
}

/** RTK Query `queryFn` result helpers. */
export const ok = <T>(data: T) => ({ data });
export const fail = (message: string, status = 400) => ({ error: { status, data: { message } } });

// ── Views: turn stored rows into the shapes the UI expects ────────────────

export function toProfile(userId: string): UserProfile {
  const u = db().users.find((x) => x.id === userId);
  if (!u) return { id: userId, fullName: "Unknown", username: "unknown", email: "" };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...profile } = u;
  return profile;
}

export function toTask(row: Db["tasks"][number]): Task {
  const d = db();
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    projectId: row.projectId,
    parentTaskId: row.parentTaskId,
    dueDate: row.dueDate,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    assignees: row.assigneeIds.map((id) => {
      const p = toProfile(id);
      return { id, name: p.fullName, avatar: p.profilePhoto, initials: getInitials(p.fullName), color: getAvatarColor(id) };
    }),
    subtaskCount: d.tasks.filter((t) => t.parentTaskId === row.id).length,
    commentCount: d.comments.filter((c) => c.taskId === row.id).length,
    attachmentsCount: 0,
  };
}

export function toProject(row: Db["projects"][number]): Project {
  const d = db();
  const parents = d.tasks.filter((t) => t.projectId === row.id && !t.parentTaskId);
  const done = parents.filter((t) => t.status === "DONE").length;
  return {
    ...row,
    tasksCount: parents.length,
    totalTasks: parents.length,
    tasksDone: done,
    progress: parents.length ? Math.round((done / parents.length) * 100) : 0,
    status: done === parents.length && parents.length > 0 ? "COMPLETED" : "ACTIVE",
    members: d.members
      .filter((m) => m.teamId === row.teamId)
      .map((m) => ({ id: m.userId, initials: getInitials(toProfile(m.userId).fullName), color: getAvatarColor(m.userId) })),
  };
}

export function toTeam(row: Db["teams"][number]): Team {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    createdAt: row.createdAt,
    owner: toProfile(row.ownerId),
    memberCount: db().members.filter((m) => m.teamId === row.id).length,
  };
}

export function toMember(row: Db["members"][number]): TeamMember {
  return { id: row.id, user: toProfile(row.userId), role: row.role, joinedAt: row.joinedAt };
}

export function toComment(row: Db["comments"][number]): Comment {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { authorId, ...rest } = row;
  return { ...rest, author: toProfile(row.authorId) };
}

/** Teams the given user belongs to. */
export const teamIdsOf = (userId: string) =>
  db().members.filter((m) => m.userId === userId).map((m) => m.teamId);
