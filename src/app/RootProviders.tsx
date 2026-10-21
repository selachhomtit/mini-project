"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import FooterWrapper from "@/components/layout/FooterWrapper";
import StoreProvider from "./StoreProvider";

const ROUTES_WITHOUT_CHROME = ["/login", "/register"];

export default function RootProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showChrome = !ROUTES_WITHOUT_CHROME.includes(pathname);
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <div className="font-sans min-h-full flex flex-col bg-white dark:bg-ink">
      <ThemeProvider>
        <StoreProvider>
          {showChrome && <NavbarWrapper />}
          <div className="flex-1">
            {children}
          </div>
          {showChrome && !isDashboard && <FooterWrapper />}
        </StoreProvider>
      </ThemeProvider>
    </div>
  );
}
