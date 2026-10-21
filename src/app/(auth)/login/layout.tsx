import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Log In",
  description:
    "Log in to your TaskFlow workspace to manage tasks, projects, and teams.",
  path: "/login",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
