import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/lib/hooks";

// Client-side replacement for the old Next.js proxy: auth state is loaded
// synchronously from the "token" cookie when the store is created.

/** Only signed-in users may enter; everyone else goes to /login. */
export function RequireAuth() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

/** Signed-in users skip the auth pages and land on the dashboard. */
export function RedirectIfAuthenticated() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
