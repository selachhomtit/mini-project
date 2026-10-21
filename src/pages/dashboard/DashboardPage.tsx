import { useMounted } from "@/hooks/use-mounted";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import {
  Bell, AlertTriangle, ListTodo,
  ChevronRight, MoreHorizontal, Calendar, Users, FolderKanban,
  Settings, LayoutDashboard, CheckSquare, X, LogOut,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { logout } from "@/lib/features/auth/authSlice";
import { useGetUnreadCountQuery } from "@/lib/services/notificationService";
import { useGetPersonalTasksQuery } from "@/lib/services/taskService";
import { StatCard } from "@/components/Card";
import { TextCard } from "@/components/TextCard";
import { useGetDashboardQuery } from "@/lib/services/dashboardService";

import {
  TaskStatusDonut,
  CompletionGauge,
  ProjectTasksDonut,
  ProjectStackedBar,
  UpcomingPriorityBar,
  DueDateTimeline,
  ActivityVolumeChart,
} from "@/components/charts";

// ─────────────────────────────────────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 dark:bg-slate-700 rounded-lg ${className}`} />;
}

const PRIORITY_LABEL: Record<string, string> = {
  LOW:    "bg-slate-50  text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  MEDIUM: "bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-900/40 dark:text-orange-300",
  HIGH:   "bg-red-50    text-red-600   border border-red-200 dark:bg-red-900/40 dark:text-red-300",
  URGENT: "bg-red-100   text-red-800   border border-red-300 dark:bg-red-900/60 dark:text-red-200",
};

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const mounted = useMounted();

  const handleLogout = () => { dispatch(logout()); navigate("/login"); };

  const today = mounted
    ? new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : "";

  // ── ONE unified dashboard call ──────────────────────────────────────────────
  const { data: dashboard, isLoading: dashLoading, error: dashError } = useGetDashboardQuery();

  // My tasks (in-progress) — kept as separate call because it paginates
  const { data: myTasksPage, isLoading: tasksLoading } =
    useGetPersonalTasksQuery({ status: "IN_PROGRESS" });
  const myTasks = myTasksPage?.content ?? [];

  const { data: unread } = useGetUnreadCountQuery();
  const unreadCount = unread?.count ?? 0;

  // ── Derived values ──────────────────────────────────────────────────────────
  const projects = dashboard?.projectProgressSummary ?? [];
  const totalTasks     = dashboard?.totalTasks ?? 0;
  const completedTasks = dashboard?.completedTasks ?? 0;
  const overdueTasks   = dashboard?.overdueTasks ?? 0;
  const avgProgress = projects.length
    ? Math.round(projects.reduce((sum, p) => sum + p.progressPercent, 0) / projects.length)
    : 0;
  const teamCount = dashboard?.totalTeams ?? 0;

  const statCards = [
    {
      label: "Total Tasks",
      value: totalTasks,
      change: `${completedTasks} done`,
      changeLabel: `· ${totalTasks - completedTasks} open`,
      trend: "up" as const,
      icon: <ListTodo size={18} className="text-[#059669]" />, iconBg: "bg-[#ECFDF5] dark:bg-emerald-950",
    },
    {
      label: "Team Members",
      value: dashboard?.totalTeamMembers ?? 0,
      change: `${teamCount}`,
      changeLabel: teamCount === 1 ? "team" : "teams",
      trend: "neutral" as const,
      icon: <Users size={18} className="text-[#6366F1]" />, iconBg: "bg-[#EEF2FF] dark:bg-indigo-950",
    },
    {
      label: "Projects",
      value: dashboard?.totalProjects ?? 0,
      change: `${avgProgress}%`,
      changeLabel: "average progress",
      trend: "neutral" as const,
      icon: <FolderKanban size={18} className="text-[#0EA5E9]" />, iconBg: "bg-[#E0F2FE] dark:bg-sky-950",
    },
    {
      label: "Overdue",
      value: overdueTasks,
      change: `${dashboard?.dueSoonTasks ?? 0}`,
      changeLabel: "due in the next 7 days",
      trend: overdueTasks > 0 ? ("down" as const) : ("neutral" as const),
      icon: <AlertTriangle size={18} className="text-[#EF4444]" />, iconBg: "bg-[#FEE2E2] dark:bg-red-950",
    },
  ];

  // Personal tasks have no project; show them as their own slice so the
  // project charts add up to the same total as the stat cards.
  const chartProjects = dashboard && dashboard.personalTasks > 0
    ? [
        ...projects,
        {
          projectId: "personal",
          projectName: "Personal",
          totalTasks: dashboard.personalTasks,
          completedTasks: dashboard.personalCompleted,
          progressPercent: Math.round((dashboard.personalCompleted / dashboard.personalTasks) * 100),
        },
      ]
    : projects;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <>
      {/* ── Header (unchanged from your original) ── */}
      <header className="h-14 sm:h-16 bg-white dark:bg-slate-900 border-b border-[#E8E8EF] dark:border-slate-700 flex items-center justify-between px-3 sm:px-5 gap-2 shrink-0 sticky top-0 z-30">
        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-[#059669] flex items-center justify-center shadow-md shadow-[#059669]/30">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="4" height="12" rx="1" fill="white"/>
              <rect x="7" y="1" width="6" height="8" rx="1" fill="white" opacity=".8"/>
            </svg>
          </div>
          <span className="font-bold text-[15px] text-[#1E293B] dark:text-white tracking-tight hidden xs:block">Ponleu</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link to="/dashboard/notifications" className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#64748B] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${menuOpen ? "bg-[#059669] text-white" : "text-[#64748B] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              {menuOpen ? <X size={17} /> : <MoreHorizontal size={18} />}
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-black/15 border border-[#E8E8EF] dark:border-slate-700 z-50 overflow-hidden">
                  {user && (
                    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#F1F5F9] dark:border-slate-800">
                      <div className="w-9 h-9 rounded-full bg-[#059669]/10 flex items-center justify-center text-[#059669] text-sm font-bold shrink-0">
                        {user.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1E293B] dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-[#94A3B8] truncate">{user.email}</p>
                      </div>
                    </div>
                  )}
                  <nav className="p-2">
                    {[
                      { label: "Dashboard",    href: "/dashboard",               icon: LayoutDashboard },
                      { label: "Projects",      href: "/dashboard/projects",      icon: FolderKanban },
                      { label: "My Tasks",      href: "/dashboard/tasks",         icon: CheckSquare },
                      { label: "Team",          href: "/dashboard/team",          icon: Users },
                      { label: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: unreadCount },
                      { label: "Settings",      href: "/dashboard/settings",      icon: Settings },
                    ].map(({ label, href, icon: Icon, badge }) => (
                      <Link key={href} to={href} onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#64748B] dark:text-slate-300 hover:bg-[#ECFDF5] hover:text-[#059669] dark:hover:bg-[#059669]/10 transition-colors group">
                        <Icon size={17} className="shrink-0 text-[#94A3B8] group-hover:text-[#059669]" />
                        <span className="flex-1">{label}</span>
                        {badge ? <span className="bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge > 9 ? "9+" : badge}</span> : null}
                      </Link>
                    ))}
                  </nav>
                  <div className="px-2 pb-2 border-t border-[#F1F5F9] dark:border-slate-800 pt-1">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-950/30">
                      <LogOut size={16} className="shrink-0" />Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>


      <div className="flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Greeting */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#E8E8EF] dark:border-slate-700 px-4 sm:px-6 py-4 sm:py-5 shadow-sm">
            <h1 className="text-[22px] font-bold text-slate-950 dark:text-white leading-tight">
              {greeting}, {mounted ? (user?.name?.split(" ")[0] ?? "there") : "there"} 👋
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{today}</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashLoading
              ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-[140px]" />)
              : dashError
              ? <div className="col-span-full bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl p-4">
                  <p className="text-red-600 text-sm">Failed to load dashboard. Please refresh.</p>
                </div>
              : statCards.map((s) => <StatCard key={s.label} {...s} />)
            }
          </div>

          {/* ── ROW 1: Donut + Gauge ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dashLoading ? (
              <>
                <Skeleton className="h-56" />
                <Skeleton className="h-56" />
              </>
            ) : dashboard ? (
              <>
                <TaskStatusDonut
                  statusCounts={dashboard.statusCounts}
                  overdueTasks={dashboard.overdueTasks}
                  totalTasks={dashboard.totalTasks}
                />
                <CompletionGauge
                  completedTasks={dashboard.completedTasks}
                  totalTasks={dashboard.totalTasks}
                />
              </>
            ) : null}
          </div>

          {/* ── ROW 2: Project donuts + stacked bars ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dashLoading ? (
              <>
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
              </>
            ) : dashboard ? (
              <>
                <ProjectTasksDonut projects={chartProjects} />
                <ProjectStackedBar projects={chartProjects} />
              </>
            ) : null}
          </div>

          {/* ── ROW 3: Due date timeline + Priority bar ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dashLoading ? (
              <>
                <Skeleton className="h-72" />
                <Skeleton className="h-72" />
              </>
            ) : dashboard ? (
              <>
                <DueDateTimeline tasks={dashboard.upcomingDueDates} />
                <UpcomingPriorityBar tasks={dashboard.upcomingDueDates} />
              </>
            ) : null}
          </div>

          {/* ── ROW 4: Activity volume (full width) ── */}
          {dashLoading ? (
            <Skeleton className="h-56" />
          ) : dashboard ? (
            <ActivityVolumeChart activities={dashboard.recentActivities} />
          ) : null}

          {/* ── Original: Projects + My Tasks ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TextCard
              title="Projects"
              action={
                <Link to="/dashboard/projects" className="flex items-center gap-1 text-sm text-[#059669] font-semibold hover:underline">
                  View all <ChevronRight size={14} />
                </Link>
              }
            >
              {dashLoading ? (
                <div className="space-y-4">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
              ) : projects.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No projects yet.</p>
              ) : (
                <div className="space-y-4">
                  {projects.slice(0, 4).map(({ projectId, projectName, progressPercent }) => (
                    <div key={projectId} className="space-y-2 border border-[#E8E8EF] dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-900">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-slate-950 dark:text-white">{projectName}</span>
                        <span className="text-sm font-semibold text-slate-500">{progressPercent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#E8E8EF] dark:bg-slate-700 overflow-hidden">
                        <div className="h-full rounded-full bg-[#059669]" style={{ width: `${progressPercent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TextCard>

            <TextCard
              title="My Tasks"
              action={
                <Link to="/dashboard/tasks" className="flex items-center gap-1 text-sm text-[#059669] font-semibold hover:underline">
                  View all <ChevronRight size={14} />
                </Link>
              }
            >
              {tasksLoading ? (
                <div className="space-y-3">{Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
              ) : myTasks.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No tasks in progress.</p>
              ) : (
                <div className="space-y-3">
                  {myTasks.slice(0, 2).map((task) => (
                    <div key={task.id} className="border border-[#E8E8EF] dark:border-slate-700 rounded-xl p-4 space-y-3 hover:border-[#D1D5DB] transition-colors bg-slate-50 dark:bg-slate-900">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-sm font-semibold text-slate-950 dark:text-white">{task.title}</h4>
                        <Link to={`/dashboard/tasks?taskId=${task.id}`} aria-label={`Open ${task.title}`} className="text-slate-500 hover:text-brand-500 transition-colors"><ChevronRight size={15} /></Link>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${PRIORITY_LABEL[task.priority] ?? ""}`}>
                          {task.priority.toLowerCase()}
                        </span>
                        {task.dueDate && (
                          <span className="flex items-center gap-1 text-xs text-slate-500 ml-auto">
                            <Calendar size={11} /> {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TextCard>
          </div>
        </div>
      </div>
    </>
  );
}