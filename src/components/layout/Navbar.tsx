"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setLanguage } from "@/lib/features/i18n/i18nSlice";
import { logout } from "@/lib/features/auth/authSlice";
import { useGetUnreadCountQuery } from "@/lib/services/notificationService";
import { useMounted } from "@/hooks/use-mounted";
import { Sun, Moon, Globe, Bell, User, LogOut, Settings, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Features", path: "/features" },
  { name: "Pricing", path: "/pricing" },
  { name: "About Us", path: "/about" },
  { name: "Contact Us", path: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const mounted = useMounted();
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useTranslation();

  const storedUser = useAppSelector((s) => s.auth.user);
  // Auth is read from cookies on the client only, so wait for mount to avoid a hydration mismatch.
  const user = mounted ? storedUser : null;
  const { data: unread } = useGetUnreadCountQuery(undefined, {
    skip: !mounted || !user,
  });
  const unreadCount = mounted ? (unread?.count ?? 0) : 0;

  const displayName = mounted && user ? (user.name ?? "User") : "User";
  const avatar = mounted && user ? user.avatar : null;


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageChange = (newLang: "en" | "kh") => {
    dispatch(setLanguage(newLang));
    setLangOpen(false);
  };

  useEffect(() => {
    document.documentElement.lang = language === "kh" ? "km" : "en";
  }, [language]);

  const isActive = (path: string) => (path === "/" ? pathname === "/" : pathname.startsWith(path));

  return (
    <header className="sticky top-0 z-50">
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled || menuOpen
            ? "bg-white/95 dark:bg-ink/95 backdrop-blur-md border-b border-slate-200/20 dark:border-slate-700/50 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="12" rx="1.5" fill="white" />
                <rect x="9" y="2" width="5" height="8" rx="1.5" fill="white" opacity=".8" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">TaskFlow</span>
          </Link>

          <div className="hidden md:flex items-center gap-7 flex-1 justify-center">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                aria-current={isActive(item.path) ? "page" : undefined}
                className={`relative text-sm font-medium transition-colors duration-200 after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:rounded-full after:bg-brand-500 after:transition-all ${
                  isActive(item.path)
                    ? "text-brand-500 after:w-full"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white after:w-0 hover:after:w-full"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? (
                <Moon size={18} className="text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun size={18} className="text-gray-600 dark:text-yellow-400" />
              )}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                title="Change language"
              >
                <Globe size={18} className="text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-semibold dark:text-gray-300">
                  {language.toUpperCase()}
                </span>
              </button>

              {langOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setLangOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-20 min-w-[120px] overflow-hidden">
                    <button
                      onClick={() => handleLanguageChange("en")}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${
                        language === "en"
                          ? "bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold"
                          : "dark:text-gray-300"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleLanguageChange("kh")}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${
                        language === "kh"
                          ? "bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold"
                          : "dark:text-gray-300"
                      }`}
                    >
                      ខ្មែរ
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* User Actions */}
            {user ? (
              <>
                {/* Notification Bell */}
                <Link
                  href="/dashboard/notifications"
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 relative"
                  title="Notifications"
                >
                  <Bell size={18} className="text-slate-600 dark:text-slate-300" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-9 h-12 rounded-xl hover:ring-2 hover:ring-emerald-500 transition-all duration-300 overflow-hidden flex items-center justify-center bg-emerald-100 dark:bg-slate-700"
                  >
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </button>

                  {profileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setProfileOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20 min-w-[200px] overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {displayName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {user.email}
                          </p>
                        </div>

                        <Link
                          href="/dashboard/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                        >
                          <User size={14} /> Profile
                        </Link>

                        <Link
                          href="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                        >
                          <Settings size={14} /> Dashboard
                        </Link>

                        <Link
                          href="/dashboard/notifications"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
                        >
                          <span className="flex items-center gap-2.5">
                            <Bell size={14} /> Notifications
                          </span>
                          {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </Link>

                        <div className="border-t border-slate-200 dark:border-slate-700 my-1" />

                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            dispatch(logout());
                            router.push("/login");
                          }}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors duration-200"
                        >
                          <LogOut size={14} /> Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline-flex bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 shadow-emerald-500/25"
                >
                  {t("nav.getStarted")}
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-ink px-4 py-3 animate-fade-up"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(item.path) ? "page" : undefined}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive(item.path)
                        ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              {!user && (
                <li>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    {t("nav.login")}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
