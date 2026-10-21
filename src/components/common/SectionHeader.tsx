type SectionHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
  /** Use h1 for the first heading on a page, h2 elsewhere (SEO heading order). */
  as?: "h1" | "h2";
};

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "center",
  as: Heading = "h2",
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div className={`mb-10 sm:mb-14 ${centered ? "text-center mx-auto max-w-2xl" : "max-w-xl"}`}>
      {eyebrow && (
        <span className="inline-block mb-3 rounded-full bg-brand-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
          {eyebrow}
        </span>
      )}
      <Heading
        className={`font-extrabold tracking-tight text-slate-900 dark:text-white ${
          Heading === "h1" ? "text-4xl sm:text-5xl md:text-6xl" : "text-3xl sm:text-4xl"
        }`}
      >
        {title}
      </Heading>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}
