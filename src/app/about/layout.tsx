import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About Us",
  description:
    "Meet the TaskFlow team and advisors from Phnom Penh, and learn why we build task management for Cambodian students, startups, and NGOs.",
  path: "/about",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
