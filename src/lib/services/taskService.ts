import type { Comment, PageResponse, Project, Task, TaskPriority, TaskStatus } from "@/lib/features/types/task-type";
import { baseService, currentUserId } from "./baseService";
import {
  db,
  delay,
  fail,
  newId,
  now,
  ok,
  paginate,
  save,
  teamIdsOf,
  toComment,
  toProject,
  toTask,
} from "./localDb";

type TaskInput = {
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  assigneeId?: string;
  parentTaskId?: string;
  status?: string;
};

type TaskPatch = {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  assigneeId?: string;
};

const ALL_TASK_TAGS = ["Task", "PersonalTask", "ProjectTask", "Project", "Dashboard"] as const;

function insertTask(input: TaskInput & { projectId?: string }, userId: string) {
  const row = {
    id: newId("k"),
    title: input.title,
    description: input.description,
    status: (input.status as TaskStatus) ?? "TODO",
    priority: (input.priority as TaskPriority) ?? "MEDIUM",
    projectId: input.projectId,
    parentTaskId: input.parentTaskId,
    assigneeIds: [input.assigneeId ?? userId],
    dueDate: input.dueDate,
    createdAt: now(),
    updatedAt: now(),
  };
  db().tasks.unshift(row);
  save();
  return toTask(row);
}

function patchTask(id: string, data: TaskPatch) {
  const row = db().tasks.find((t) => t.id === id);
  if (!row) return null;
  if (data.title !== undefined) row.title = data.title;
  if (data.description !== undefined) row.description = data.description;
  if (data.status) row.status = data.status as TaskStatus;
  if (data.priority) row.priority = data.priority as TaskPriority;
  if (data.dueDate !== undefined) row.dueDate = data.dueDate;
  if (data.assigneeId) row.assigneeIds = [data.assigneeId];
  row.updatedAt = now();
  save();
  return toTask(row);
}

export const taskService = baseService.injectEndpoints({
  // Hot reload re-runs this file in development; replace the old endpoints instead of warning.
  overrideExisting: import.meta.env.DEV,
  endpoints: (builder) => ({
    // ── Personal tasks (tasks without a project) ───────────────────────────
    getPersonalTasks: builder.query<
      PageResponse<Task>,
      { status?: string; search?: string; page?: number; size?: number }
    >({
      async queryFn({ status, search, page = 0, size = 50 }) {
        await delay();
        const q = search?.trim().toLowerCase();
        const rows = db().tasks.filter(
          (t) =>
            !t.projectId &&
            (!status || t.status === status) &&
            (!q || t.title.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q))
        );
        return ok(paginate(rows.map(toTask), page, size));
      },
      providesTags: ["PersonalTask"],
    }),

    createPersonalTask: builder.mutation<Task, TaskInput>({
      async queryFn(input, { getState }) {
        await delay();
        return ok(insertTask(input, currentUserId(getState)));
      },
      invalidatesTags: [...ALL_TASK_TAGS],
    }),

    // ── Project tasks ──────────────────────────────────────────────────────
    getProjectTasks: builder.query<
      PageResponse<Task>,
      { projectId: string; assigneeId?: string; status?: string; page?: number; size?: number }
    >({
      async queryFn({ projectId, assigneeId, status, page = 0, size = 50 }) {
        await delay();
        const rows = db().tasks.filter(
          (t) =>
            t.projectId === projectId &&
            (!status || t.status === status) &&
            (!assigneeId || t.assigneeIds.includes(assigneeId))
        );
        return ok(paginate(rows.map(toTask), page, size));
      },
      providesTags: ["ProjectTask"],
    }),

    createProjectTask: builder.mutation<Task, TaskInput & { projectId: string }>({
      async queryFn(input, { getState }) {
        await delay();
        return ok(insertTask(input, currentUserId(getState)));
      },
      invalidatesTags: [...ALL_TASK_TAGS],
    }),

    getTask: builder.query<Task, string>({
      async queryFn(id) {
        await delay();
        const row = db().tasks.find((t) => t.id === id);
        return row ? ok(toTask(row)) : fail("Task not found.", 404);
      },
      providesTags: ["Task"],
    }),

    updateTask: builder.mutation<Task, { id: string; data: TaskPatch }>({
      async queryFn({ id, data }) {
        await delay(80);
        const task = patchTask(id, data);
        return task ? ok(task) : fail("Task not found.", 404);
      },
      invalidatesTags: [...ALL_TASK_TAGS],
    }),

    updateProjectTask: builder.mutation<Task, { projectId: string; taskId: string; data: TaskPatch }>({
      async queryFn({ taskId, data }) {
        await delay(80);
        const task = patchTask(taskId, data);
        return task ? ok(task) : fail("Task not found.", 404);
      },
      invalidatesTags: [...ALL_TASK_TAGS],
    }),

    deleteTask: builder.mutation<null, string>({
      async queryFn(id) {
        await delay();
        const d = db();
        const ids = new Set([id, ...d.tasks.filter((t) => t.parentTaskId === id).map((t) => t.id)]);
        d.tasks = d.tasks.filter((t) => !ids.has(t.id));
        d.comments = d.comments.filter((c) => !ids.has(c.taskId));
        save();
        return ok(null);
      },
      invalidatesTags: [...ALL_TASK_TAGS, "Comment"],
    }),

    getSubtasks: builder.query<Task[], string>({
      async queryFn(taskId) {
        await delay();
        return ok(db().tasks.filter((t) => t.parentTaskId === taskId).map(toTask));
      },
      providesTags: ["Task", "ProjectTask"],
    }),

    // ── Comments ───────────────────────────────────────────────────────────
    getComments: builder.query<PageResponse<Comment>, { taskId: string; page?: number; size?: number }>({
      async queryFn({ taskId, page = 0, size = 50 }) {
        await delay();
        const rows = db().comments.filter((c) => c.taskId === taskId);
        return ok(paginate(rows.map(toComment), page, size));
      },
      providesTags: ["Comment"],
    }),

    addComment: builder.mutation<Comment, { taskId: string; content: string }>({
      async queryFn({ taskId, content }, { getState }) {
        await delay();
        const row = { id: newId("c"), taskId, content, authorId: currentUserId(getState), createdAt: now(), updatedAt: now() };
        db().comments.push(row);
        save();
        return ok(toComment(row));
      },
      invalidatesTags: ["Comment", "Task", "ProjectTask", "PersonalTask"],
    }),

    updateComment: builder.mutation<Comment, { taskId: string; commentId: string; content: string }>({
      async queryFn({ commentId, content }) {
        await delay();
        const row = db().comments.find((c) => c.id === commentId);
        if (!row) return fail("Comment not found.", 404);
        row.content = content;
        row.updatedAt = now();
        save();
        return ok(toComment(row));
      },
      invalidatesTags: ["Comment"],
    }),

    deleteComment: builder.mutation<null, { taskId: string; commentId: string }>({
      async queryFn({ commentId }) {
        await delay();
        const d = db();
        d.comments = d.comments.filter((c) => c.id !== commentId);
        save();
        return ok(null);
      },
      invalidatesTags: ["Comment", "Task", "ProjectTask", "PersonalTask"],
    }),

    // ── Projects ───────────────────────────────────────────────────────────
    getProjects: builder.query<PageResponse<Project>, { page?: number; size?: number }>({
      async queryFn({ page = 0, size = 50 }, { getState }) {
        await delay();
        const teams = new Set(teamIdsOf(currentUserId(getState)));
        const rows = db().projects.filter((p) => teams.has(p.teamId));
        return ok(paginate(rows.map(toProject), page, size));
      },
      providesTags: ["Project"],
    }),

    getProjectsByTeam: builder.query<PageResponse<Project>, { teamId: string; page?: number; size?: number }>({
      async queryFn({ teamId, page = 0, size = 50 }) {
        await delay();
        const rows = db().projects.filter((p) => p.teamId === teamId);
        return ok(paginate(rows.map(toProject), page, size));
      },
      providesTags: ["Project"],
    }),

    getProject: builder.query<Project, string>({
      async queryFn(id) {
        await delay();
        const row = db().projects.find((p) => p.id === id);
        return row ? ok(toProject(row)) : fail("Project not found.", 404);
      },
      providesTags: ["Project"],
    }),

    createProject: builder.mutation<
      Project,
      { name: string; description?: string; startDate?: string; dueDate?: string; color: string; teamId?: string }
    >({
      async queryFn(input, { getState }) {
        await delay();
        const teamId = input.teamId ?? teamIdsOf(currentUserId(getState))[0] ?? "t1";
        const row = {
          id: newId("p"),
          name: input.name,
          description: input.description ?? "",
          color: input.color,
          teamId,
          startDate: input.startDate ?? now().slice(0, 10),
          dueDate: input.dueDate ?? "",
        };
        db().projects.unshift(row);
        save();
        return ok(toProject(row));
      },
      invalidatesTags: ["Project", "Dashboard"],
    }),

    updateProject: builder.mutation<
      Project,
      { id: string; data: { name?: string; description?: string; startDate?: string; dueDate?: string; color?: string } }
    >({
      async queryFn({ id, data }) {
        await delay();
        const row = db().projects.find((p) => p.id === id);
        if (!row) return fail("Project not found.", 404);
        Object.assign(row, Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined)));
        save();
        return ok(toProject(row));
      },
      invalidatesTags: ["Project", "Dashboard"],
    }),

    deleteProject: builder.mutation<null, string>({
      async queryFn(id) {
        await delay();
        const d = db();
        d.projects = d.projects.filter((p) => p.id !== id);
        d.tasks = d.tasks.filter((t) => t.projectId !== id);
        save();
        return ok(null);
      },
      invalidatesTags: [...ALL_TASK_TAGS],
    }),
  }),
});

export const {
  useGetPersonalTasksQuery,
  useCreatePersonalTaskMutation,
  useGetProjectTasksQuery,
  useCreateProjectTaskMutation,
  useGetTaskQuery,
  useUpdateTaskMutation,
  useUpdateProjectTaskMutation,
  useDeleteTaskMutation,
  useGetSubtasksQuery,
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetProjectsQuery,
  useGetProjectsByTeamQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = taskService;
