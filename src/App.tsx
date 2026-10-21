import { lazy, type ReactNode } from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "@/layouts/RootLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import { RedirectIfAuthenticated, RequireAuth } from "@/routes/guards";
import { PageMeta } from "@/lib/seo";

import HomePage from "@/pages/HomePage";
import ContactPage from "@/pages/ContactPage";
import FeaturesPage from "@/pages/FeaturesPage";
import NotFoundPage from "@/pages/NotFoundPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";

// Dashboard pages load on demand so the public site ships a smaller bundle.
const DashboardPage = lazy(() => import("@/pages/dashboard/DashboardPage"));
const NotificationsPage = lazy(() => import("@/pages/dashboard/NotificationsPage"));
const ProjectsPage = lazy(() => import("@/pages/dashboard/ProjectsPage"));
const SettingsPage = lazy(() => import("@/pages/dashboard/SettingsPage"));
const TasksPage = lazy(() => import("@/pages/dashboard/TasksPage"));
const TeamPage = lazy(() => import("@/pages/dashboard/TeamPage"));
const TeamDetailPage = lazy(() => import("@/pages/dashboard/TeamDetailPage"));

/** A dashboard page with its own (non-indexed) tab title. */
const dash = (title: string, page: ReactNode) => (
  <>
    <PageMeta title={title} noIndex />
    {page}
  </>
);

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <><PageMeta path="/" /><HomePage /></> },
      {
        path: "contact",
        element: (
          <>
            <PageMeta
              title="Contact Us"
              description="Get in touch with the Ponleu team in Phnom Penh. Ask about pricing, demos, partnerships, or support — we reply within 24 hours."
              path="/contact"
            />
            <ContactPage />
          </>
        ),
      },
      {
        path: "features",
        element: (
          <>
            <PageMeta
              title="Features"
              description="Explore Ponleu features: Kanban boards, team workspaces, subtasks, comments, notifications, dashboards, dark mode, and full Khmer language support."
              path="/features"
            />
            <FeaturesPage />
          </>
        ),
      },

      {
        element: <RedirectIfAuthenticated />,
        children: [
          {
            path: "login",
            element: (
              <>
                <PageMeta
                  title="Log In"
                  description="Log in to your Ponleu workspace to manage tasks, projects, and teams."
                  path="/login"
                />
                <LoginPage />
              </>
            ),
          },
          {
            path: "register",
            element: (
              <>
                <PageMeta
                  title="Create Account"
                  description="Create a free Ponleu account and start organizing your team's work in minutes."
                  path="/register"
                />
                <RegisterPage />
              </>
            ),
          },
          {
            path: "forgot-password",
            element: (
              <>
                <PageMeta
                  title="Forgot Password"
                  description="Reset access to your Ponleu account."
                  path="/forgot-password"
                  noIndex
                />
                <ForgotPasswordPage />
              </>
            ),
          },
          {
            path: "reset-password",
            element: (
              <>
                <PageMeta
                  title="Reset Password"
                  description="Choose a new password for your Ponleu account."
                  path="/reset-password"
                  noIndex
                />
                <ResetPasswordPage />
              </>
            ),
          },
        ],
      },

      {
        path: "dashboard",
        element: <RequireAuth />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { index: true, element: dash("Dashboard", <DashboardPage />) },
              { path: "notifications", element: dash("Notifications", <NotificationsPage />) },
              { path: "projects", element: dash("Projects", <ProjectsPage />) },
              { path: "settings", element: dash("Settings", <SettingsPage />) },
              { path: "tasks", element: dash("My Tasks", <TasksPage />) },
              { path: "team", element: dash("Team", <TeamPage />) },
              { path: "team/:teamId", element: dash("Team", <TeamDetailPage />) },
            ],
          },
        ],
      },

      { path: "*", element: <><PageMeta title="Page Not Found" noIndex /><NotFoundPage /></> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
