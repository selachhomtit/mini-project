import { Suspense } from "react";
import { Outlet } from "react-router";
import { AuthRehydrator } from "@/components/AuthRehydrator";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

function PageLoading() {
  return (
    <div className="flex flex-1 items-center justify-center p-10" role="status" aria-label="Loading">
      <div className="size-8 rounded-full border-2 border-brand-500/20 border-t-brand-500 animate-spin" />
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* min-w-0 keeps wide content (e.g. kanban boards) scrolling inside the page instead of widening it */}
      <SidebarInset className="min-w-0">
        <AuthRehydrator />
        {/* Each page sets its own title (see App.tsx) and is loaded on demand. */}
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
        <SidebarTrigger
          aria-label="Open menu"
          className="fixed bottom-4 right-4 z-40 size-11 rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600 hover:text-white md:hidden"
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
