import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/data/testimonials";
import SectionHeader from "@/components/common/SectionHeader";

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-white dark:bg-ink transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Stories"
          title="Loved by teams across Cambodia"
          subtitle="From Phnom Penh classrooms to Siem Reap startups."
        />

        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-ink-soft"
            >
              <div className="mb-4 flex gap-1" role="img" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-4 fill-amber-400 text-amber-400" aria-hidden />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  className={`flex size-10 items-center justify-center rounded-full text-sm font-bold text-white ${t.avatarBg}`}
                >
                  {t.initials}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900 dark:text-white">{t.name}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400">{t.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
