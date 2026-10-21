import { useGetProjectsQuery } from "@/lib/services/taskService";
import { Link } from "react-router";

export function NavProjects() {
  const { data: pageData, isLoading } = useGetProjectsQuery({});
  const projects = pageData?.content ?? [];

  return (
    <div className="px-3 mt-2 group-data-[collapsible=icon]:px-2">
      <p className="group-data-[collapsible=icon]:hidden px-3 text-[10px] font-bold text-[#94A3B8] mb-2 uppercase tracking-wider flex items-center gap-1.5">
        <span>+</span> Add Projects
      </p>
      <nav className="space-y-0.5">
        {isLoading && (
          <div className="space-y-1 px-3 py-1">
            {[1,2,3].map((i) => <div key={i} className="h-7 bg-[#ECFDF5] dark:bg-sidebar-accent rounded-md animate-pulse" />)}
          </div>
        )}
        {projects.slice(0, 6).map(({ id, name, color }) => (
          <Link key={id} to={`/dashboard/projects?projectId=${id}`} title={name}
            className="flex items-center gap-3 px-3 py-2 rounded-lg group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 text-sm text-[#64748B] hover:bg-[#F8F8FC] hover:text-[#344054] dark:text-slate-400 dark:hover:bg-sidebar-accent dark:hover:text-slate-100 transition-colors">
            <span className="w-4 h-4 rounded flex items-center justify-center shrink-0 border border-[#E2E8F0] dark:border-slate-700" style={{ backgroundColor: color + '18' }}>
              <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />
            </span>
            <span className="truncate flex-1 group-data-[collapsible=icon]:hidden">{name}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#CBD5E1] shrink-0 group-data-[collapsible=icon]:hidden"><path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        ))}
        {!isLoading && projects.length === 0 && (
          <p className="px-3 py-2 text-xs text-[#94A3B8]">No projects yet</p>
        )}
        <Link to="/dashboard/projects"
          className="group-data-[collapsible=icon]:hidden flex items-center px-3 py-2 rounded-lg text-sm text-[#94A3B8] hover:bg-[#F8F8FC] hover:text-brand-500 dark:hover:bg-sidebar-accent transition-colors font-medium">
          All Projects →
        </Link>
      </nav>
    </div>
  );
}
