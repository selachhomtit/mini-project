import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "How it works", href: "/#how-it-works" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Testimonials", href: "/#testimonials" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Create account", href: "/register" },
      { label: "Forgot password", href: "/forgot-password" },
    ],
  },
];

export default function FooterWrapper() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 pb-6 pt-10 text-slate-500 transition-colors dark:border-slate-800 dark:bg-ink dark:text-slate-400 sm:px-8 sm:pb-8 sm:pt-14">
      <div className="mx-auto mb-10 grid max-w-5xl grid-cols-2 gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <Link href="/" className="mb-3.5 flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand-500 shadow-md shadow-brand-500/30">
              <svg viewBox="0 0 16 16" fill="none" width="15" height="15" aria-hidden>
                <rect x="2" y="2" width="5" height="12" rx="1.5" fill="white" />
                <rect x="9" y="2" width="5" height="8" rx="1.5" fill="white" opacity=".8" />
              </svg>
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white">TaskFlow</span>
          </Link>
          <p className="max-w-60 text-xs leading-relaxed">
            Smart task management for students, startups, and NGOs across Cambodia. Available in English and ខ្មែរ.
          </p>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-900 dark:text-white">
              {col.title}
            </h2>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-xs transition-colors hover:text-brand-500">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <hr className="mx-auto mb-6 max-w-5xl border-slate-200 dark:border-slate-800" />

      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500">
        <span>© 2026 TaskFlow. All rights reserved.</span>
        <span>Made with ♥ in Phnom Penh</span>
      </div>
    </footer>
  );
}
