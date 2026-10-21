import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact Us",
  description:
    "Get in touch with the TaskFlow team in Phnom Penh. Ask about pricing, demos, partnerships, or support — we reply within 24 hours.",
  path: "/contact",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
