export type Plan = {
  name: string;
  /** Monthly price in USD; null = custom quote */
  priceUsd: number | null;
  description: string;
  cta: string;
  href: string;
  highlight?: boolean;
  features: string[];
};

/** Exchange rate used to show approximate prices in Cambodian riel. */
export const KHR_PER_USD = 4100;

export const PLANS: Plan[] = [
  {
    name: "Student",
    priceUsd: 0,
    description: "For individuals and class projects getting started.",
    cta: "Start for free",
    href: "/register",
    features: ["Up to 3 projects", "5 members per team", "Kanban & list views", "English & Khmer UI", "Dark mode"],
  },
  {
    name: "Pro",
    priceUsd: 5,
    description: "For startups and growing teams that ship every week.",
    cta: "Start 14-day trial",
    href: "/register",
    highlight: true,
    features: [
      "Unlimited projects",
      "Unlimited members",
      "Subtasks & comments",
      "Dashboard charts",
      "Priority email support",
      "Pay with ABA or Bakong KHQR",
    ],
  },
  {
    name: "Organization",
    priceUsd: null,
    description: "For NGOs, universities, and companies with many teams.",
    cta: "Contact sales",
    href: "/contact",
    features: [
      "Everything in Pro",
      "Multiple workspaces",
      "Admin roles & audit log",
      "On-site onboarding in Phnom Penh",
      "Invoice billing in USD or KHR",
    ],
  },
];

export function formatPrice(plan: Plan): { main: string; sub: string } {
  if (plan.priceUsd === null) return { main: "Custom", sub: "Tailored to your organization" };
  if (plan.priceUsd === 0) return { main: "$0", sub: "Free forever" };
  return {
    main: `$${plan.priceUsd}`,
    sub: `≈ ${(plan.priceUsd * KHR_PER_USD).toLocaleString("en-US")}៛ / user / month`,
  };
}
