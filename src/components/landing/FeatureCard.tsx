import type { Feature } from "@/data/features";

export default function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <article className="group h-full rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10 dark:border-slate-800 dark:bg-ink-soft dark:hover:border-brand-500/40">
      <div
        className={`mb-4 inline-flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${feature.tone}`}
      >
        <Icon className="size-5" aria-hidden />
      </div>
      <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white">{feature.title}</h3>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{feature.description}</p>
    </article>
  );
}
