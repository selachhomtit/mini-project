import type { TaskStatus } from "@/lib/features/types/task-type";
import { baseService, currentUserId } from "./baseService";
import { db, delay, ok, teamIdsOf, toProject } from "./localDb";

export interface ActivityResponse {
  activityType: string;
  description: string;
  timestamp: string;
}

export interface ProjectProgressResponse {
  projectId: string;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  progressPercent: number;
}

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface UpcomingTaskResponse {
  id: string;
  title: string;
  dueDate: string;
  priority: Priority;
  projectName: string;
}

export interface DashboardResponse {
  totalProjects: number;
  totalTasks: number;
  myTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  /** Open tasks due within the next 7 days (today included). */
  dueSoonTasks: number;
  /** Top-level task count per board column. */
  statusCounts: Record<TaskStatus, number>;
  personalTasks: number;
  personalCompleted: number;
  totalTeams: number;
  totalTeamMembers: number;
  upcomingDueDates: UpcomingTaskResponse[];
  recentActivities: ActivityResponse[];
  projectProgressSummary: ProjectProgressResponse[];
}

/** Computes the dashboard summary from the local static data. */
function buildDashboard(userId: string): DashboardResponse {
  const d = db();
  const teams = new Set(teamIdsOf(userId));
  const projects = d.projects.filter((p) => teams.has(p.teamId));
  const projectIds = new Set(projects.map((p) => p.id));
  const tasks = d.tasks.filter((t) => !t.parentTaskId && (!t.projectId || projectIds.has(t.projectId)));
  const today = new Date().toISOString().slice(0, 10);
  const weekAhead = new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
  const open = tasks.filter((t) => t.status !== "DONE");
  const personal = tasks.filter((t) => !t.projectId);
  const countStatus = (s: TaskStatus) => tasks.filter((t) => t.status === s).length;

  return {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    myTasks: tasks.filter((t) => t.assigneeIds.includes(userId)).length,
    completedTasks: countStatus("DONE"),
    pendingTasks: open.filter((t) => !t.dueDate || t.dueDate >= today).length,
    overdueTasks: open.filter((t) => t.dueDate && t.dueDate < today).length,
    dueSoonTasks: open.filter((t) => t.dueDate && t.dueDate >= today && t.dueDate <= weekAhead).length,
    statusCounts: {
      TODO: countStatus("TODO"),
      IN_PROGRESS: countStatus("IN_PROGRESS"),
      IN_REVIEW: countStatus("IN_REVIEW"),
      DONE: countStatus("DONE"),
    },
    personalTasks: personal.length,
    personalCompleted: personal.filter((t) => t.status === "DONE").length,
    totalTeams: teams.size,
    totalTeamMembers: new Set(d.members.filter((m) => teams.has(m.teamId)).map((m) => m.userId)).size,
    upcomingDueDates: open
      .filter((t) => t.dueDate && t.dueDate >= today)
      .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!))
      .slice(0, 8)
      .map((t) => ({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate!,
        priority: t.priority,
        projectName: d.projects.find((p) => p.id === t.projectId)?.name ?? "Personal",
      })),
    recentActivities: d.activity,
    projectProgressSummary: projects.map((p) => {
      const view = toProject(p);
      return {
        projectId: p.id,
        projectName: p.name,
        totalTasks: view.tasksCount,
        completedTasks: view.tasksDone ?? 0,
        progressPercent: view.progress,
      };
    }),
  };
}

const dashboardService = baseService.injectEndpoints({
  // Hot reload re-runs this file in development; replace the old endpoints instead of warning.
  overrideExisting: import.meta.env.DEV,
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardResponse, void>({
      async queryFn(_arg, { getState }) {
        await delay();
        return ok(buildDashboard(currentUserId(getState)));
      },
      providesTags: ["Dashboard", "Task", "PersonalTask", "ProjectTask", "Project", "Team"],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardService;
