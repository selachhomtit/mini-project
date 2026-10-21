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
  const open = tasks.filter((t) => t.status !== "DONE");

  return {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    myTasks: tasks.filter((t) => t.assigneeIds.includes(userId)).length,
    completedTasks: tasks.filter((t) => t.status === "DONE").length,
    pendingTasks: open.filter((t) => !t.dueDate || t.dueDate >= today).length,
    overdueTasks: open.filter((t) => t.dueDate && t.dueDate < today).length,
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
  overrideExisting: process.env.NODE_ENV === "development",
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardResponse, void>({
      async queryFn(_arg, { getState }) {
        await delay();
        return ok(buildDashboard(currentUserId(getState)));
      },
      providesTags: ["Dashboard", "Task", "Project", "Team"],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardService;
