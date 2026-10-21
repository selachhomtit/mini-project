import type { Metadata } from "next";
import { AuthRehydrator } from "@/components/AuthRehydrator";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Dashboard | TaskFlow" },
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AuthRehydrator />
        {children}
        <SidebarTrigger
          aria-label="Open menu"
          className="fixed bottom-4 right-4 z-40 size-11 rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/30 hover:bg-brand-600 hover:text-white md:hidden"
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
