import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Create Account",
  description:
    "Create a free TaskFlow account and start organizing your team's work in minutes.",
  path: "/register",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
