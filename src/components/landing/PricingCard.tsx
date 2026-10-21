import Link from "next/link";
import { Check } from "lucide-react";
import { formatPrice, type Plan } from "@/data/pricing";

export default function PricingCard({ plan }: { plan: Plan }) {
  const { main, sub } = formatPrice(plan);
  const highlight = plan.highlight;

  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 ${
        highlight
          ? "border-brand-500 bg-white shadow-2xl shadow-brand-500/20 dark:bg-ink-soft lg:scale-105"
          : "border-slate-200 bg-white hover:shadow-lg dark:border-slate-800 dark:bg-ink-soft"
      }`}
    >
      {highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          Most popular
        </span>
      )}

      <h3
        className={`text-sm font-bold uppercase tracking-wider ${
          highlight ? "text-brand-500" : "text-slate-500 dark:text-slate-400"
        }`}
      >
        {plan.name}
      </h3>
      <p className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{main}</span>
        {plan.priceUsd ? <span className="text-sm text-slate-500 dark:text-slate-400">/user/mo</span> : null}
      </p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{sub}</p>
      <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{plan.description}</p>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
            <Check className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={plan.href}
        className={`mt-8 inline-flex justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-colors ${
          highlight
            ? "bg-brand-500 text-white hover:bg-brand-600"
            : "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        }`}
      >
        {plan.cta}
      </Link>
    </article>
  );
}
