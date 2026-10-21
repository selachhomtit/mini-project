export type Testimonial = {
  name: string;
  role: string;
  initials: string;
  /** Tailwind background class for the avatar */
  avatarBg: string;
  quote: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sokha Chan",
    role: "Year-4 IT student · Phnom Penh",
    initials: "SC",
    avatarBg: "bg-brand-500",
    quote:
      "Our capstone group used to lose deadlines in Telegram chats. With TaskFlow every task has an owner and a date, and we finished two weeks early.",
  },
  {
    name: "Dara Meas",
    role: "Co-founder · coffee delivery startup, Siem Reap",
    initials: "DM",
    avatarBg: "bg-emerald-600",
    quote:
      "The Kanban board is the first thing our team opens every morning. Being able to switch to Khmer means our riders actually use it too.",
  },
  {
    name: "Sreyleak Phan",
    role: "Program officer · education NGO, Battambang",
    initials: "SP",
    avatarBg: "bg-amber-600",
    quote:
      "We run workshops in three provinces. The dashboard shows me which activities are late before the donor report is due.",
  },
];
