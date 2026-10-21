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

export type ComparisonRow = { label: string; values: [string, string, string] };

export const COMPARISON: ComparisonRow[] = [
  { label: "Projects", values: ["3", "Unlimited", "Unlimited"] },
  { label: "Members per team", values: ["5", "Unlimited", "Unlimited"] },
  { label: "Subtasks & comments", values: ["—", "✓", "✓"] },
  { label: "Dashboard charts", values: ["Basic", "Full", "Full"] },
  { label: "Khmer interface", values: ["✓", "✓", "✓"] },
  { label: "Support", values: ["Community", "Email (24h)", "Dedicated manager"] },
  { label: "Payment", values: ["—", "ABA / KHQR / Card", "Invoice"] },
];

export type Faq = { q: string; a: string };

export const PRICING_FAQ: Faq[] = [
  {
    q: "Is the Student plan really free?",
    a: "Yes. The Student plan is free forever with no credit card. It is designed for university and bootcamp group projects.",
  },
  {
    q: "Can I pay in Cambodian riel?",
    a: "Prices are set in US dollars, but you can pay the riel equivalent through ABA Pay or any bank that supports Bakong KHQR.",
  },
  {
    q: "What happens when my Pro trial ends?",
    a: "Your workspace moves back to the Student plan. Nothing is deleted — you just can't create more than 3 projects until you upgrade.",
  },
  {
    q: "Do you offer discounts for NGOs?",
    a: "Registered NGOs and public schools in Cambodia get 50% off the Organization plan. Contact us with your registration letter.",
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
