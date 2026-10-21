import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Features",
  description:
    "Explore TaskFlow features: Kanban boards, team workspaces, subtasks, comments, notifications, dashboards, dark mode, and full Khmer language support.",
  path: "/features",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
