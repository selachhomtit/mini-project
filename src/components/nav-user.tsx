import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout } from "@/lib/features/auth/authSlice";
import { useGetUnreadCountQuery } from "@/lib/services/notificationService";
import { useMounted } from "@/hooks/use-mounted";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { LogOut, Settings, User, Bell, Moon, Sun } from "lucide-react";

export function NavUser() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);
  const [open, setOpen] = useState(false);
  const mounted = useMounted();
  const { theme, toggleTheme } = useTheme();


  const { data: unread } = useGetUnreadCountQuery(undefined, {
    skip: !mounted,
  });
  const unreadCount = mounted ? (unread?.count ?? 0) : 0;

  const displayName = mounted ? (user?.name ?? "User") : "User";
  const displayEmail = mounted ? (user?.email ?? "") : "";
  const avatar = mounted ? user?.avatar : null;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="border-t border-[#E8E8EF] dark:border-sidebar-border px-3 py-2 relative group-data-[collapsible=icon]:px-1">
      <button
        onClick={() => setOpen(!open)}
        title={displayName}
        className="flex items-center gap-3 w-full rounded-lg hover:bg-[#F8F8FC] dark:hover:bg-sidebar-accent transition-colors p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1"
      >
        <div className="w-8 h-8 rounded-full bg-[#059669]/10 flex items-center justify-center shrink-0 text-[#059669] text-xs font-bold overflow-hidden">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        <div className="flex-1 text-left min-w-0 group-data-[collapsible=icon]:hidden">
          <p className="text-sm font-semibold text-[#1E293B] dark:text-slate-100 truncate leading-none">
            {displayName}
          </p>
          <p className="text-xs text-[#94A3B8] truncate mt-0.5">
            {displayEmail}
          </p>
        </div>

        {unreadCount > 0 && (
          <span className="group-data-[collapsible=icon]:hidden w-5 h-5 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-2 right-2 bottom-full mb-1 min-w-52 bg-white border border-[#E8E8EF] rounded-xl shadow-xl z-20 py-1 overflow-hidden dark:bg-slate-900 dark:border-slate-700">
            <div className="px-3 py-2.5 border-b border-[#F1F5F9] dark:border-slate-800">
              <p className="text-sm font-semibold text-[#1E293B] dark:text-white">{displayName}</p>
              <p className="text-xs text-[#94A3B8]">{displayEmail}</p>
            </div>

            <Link
              to="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-[#64748B] hover:bg-[#F8F8FC] transition-colors dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <User size={14} /> Profile
            </Link>

            <Link
              to="/dashboard/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-[#64748B] hover:bg-[#F8F8FC] transition-colors dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <Settings size={14} /> Settings
            </Link>

            <Link
              to="/dashboard/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between w-full px-3 py-2.5 text-sm text-[#64748B] hover:bg-[#F8F8FC] transition-colors dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <span className="flex items-center gap-2.5">
                <Bell size={14} /> Notifications
              </span>
              {unreadCount > 0 && (
                <span className="bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleTheme}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-[#64748B] hover:bg-[#F8F8FC] transition-colors dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>

            <div className="border-t border-[#F1F5F9] mt-1 dark:border-slate-800" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-[#EF4444] hover:bg-red-50 transition-colors dark:hover:bg-red-950"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}