import { LayoutDashboard, FolderKanban, CheckSquare, Users, Settings, Bell } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useGetUnreadCountQuery } from "@/lib/services/notificationService";

const navItems = [
  { label: "Dashboard",     href: "/dashboard",               icon: LayoutDashboard },
  { label: "Projects",      href: "/dashboard/projects",      icon: FolderKanban },
  { label: "My Tasks",      href: "/dashboard/tasks",         icon: CheckSquare },
  { label: "Team",          href: "/dashboard/team",          icon: Users },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: true },
  { label: "Settings",      href: "/dashboard/settings",      icon: Settings },
];

export function NavMain() {
  const { pathname } = useLocation();
  const { data: unread } = useGetUnreadCountQuery();
  const unreadCount = unread?.count ?? 0;

  return (
    <div className="px-3 group-data-[collapsible=icon]:px-2">
      <nav className="space-y-1">
        {navItems.map(({ label, href, icon: Icon, badge }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} to={href} title={label}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 text-sm transition-colors group ${
                isActive ? "bg-[#ECFDF5] text-brand-500 font-semibold dark:bg-sidebar-accent dark:text-brand-400" : "text-[#64748B] hover:bg-[#F8F8FC] hover:text-[#344054] dark:text-slate-400 dark:hover:bg-sidebar-accent dark:hover:text-slate-100"
              }`}>
              <Icon size={17} className={"shrink-0 " + (isActive ? "text-brand-500 dark:text-brand-400" : "text-[#94A3B8] group-hover:text-[#64748B] dark:group-hover:text-slate-200")} />
              <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">{label}</span>
              {badge && unreadCount > 0 && (
                <span className="bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:-top-0.5 group-data-[collapsible=icon]:right-0.5 group-data-[collapsible=icon]:px-1">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
