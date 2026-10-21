"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Settings, Bell } from "lucide-react";
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
  const pathname = usePathname();
  const { data: unread } = useGetUnreadCountQuery();
  const unreadCount = unread?.count ?? 0;

  return (
    <div className="px-3 group-data-[collapsible=icon]:px-2">
      <nav className="space-y-1">
        {navItems.map(({ label, href, icon: Icon, badge }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} title={label}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 text-sm transition-colors group ${
                isActive ? "bg-[#ECFDF5] text-[#059669] font-semibold" : "text-[#64748B] hover:bg-[#F8F8FC] hover:text-[#344054]"
              }`}>
              <Icon size={17} className={"shrink-0 " + (isActive ? "text-[#059669]" : "text-[#94A3B8] group-hover:text-[#64748B]")} />
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
