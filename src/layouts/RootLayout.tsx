import { Outlet, ScrollRestoration, useLocation } from "react-router";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";
import NavbarWrapper from "@/components/layout/NavbarWrapper";
import FooterWrapper from "@/components/layout/FooterWrapper";
import StoreProvider from "@/providers/StoreProvider";
import FeedbackProvider from "@/providers/FeedbackProvider";

const ROUTES_WITHOUT_CHROME = ["/login", "/register", "/forgot-password", "/reset-password"];

export default function RootLayout() {
  const { pathname } = useLocation();
  const showChrome = !ROUTES_WITHOUT_CHROME.includes(pathname);
  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <div className="font-sans min-h-full flex flex-col bg-white dark:bg-ink">
      <ThemeProvider>
        <StoreProvider>
          <FeedbackProvider>
            {showChrome && <NavbarWrapper />}
            <div className="flex-1">
              <Outlet />
            </div>
            {showChrome && !isDashboard && <FooterWrapper />}
          </FeedbackProvider>
        </StoreProvider>
      </ThemeProvider>
      <ScrollRestoration />
    </div>
  );
}
