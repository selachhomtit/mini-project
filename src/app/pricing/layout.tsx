import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Pricing",
  description:
    "Simple TaskFlow pricing in US dollars: free for students and small teams, Pro for growing companies, and custom plans for organizations in Cambodia.",
  path: "/pricing",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
