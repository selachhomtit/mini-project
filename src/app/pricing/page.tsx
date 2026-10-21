import { ChevronDown } from "lucide-react";
import { COMPARISON, KHR_PER_USD, PLANS, PRICING_FAQ } from "@/data/pricing";
import SectionHeader from "@/components/common/SectionHeader";
import PricingCard from "@/components/landing/PricingCard";
import FinalCTA from "@/components/landing/FinalCTA";

// FAQ structured data for rich results in search engines.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PRICING_FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function PricingPage() {
  return (
    <div className="bg-white dark:bg-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      {/* ── Section 1: Plans ── */}
      <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pt-36">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-0 size-[420px] rounded-full bg-brand-500/15 blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl">
          <div className="animate-fade-up">
            <SectionHeader
              as="h1"
              eyebrow="Pricing"
              title="Pick the plan that fits your team"
              subtitle={`Prices in US dollars, with the riel equivalent at ${KHR_PER_USD.toLocaleString("en-US")}៛ per $1. Cancel anytime.`}
            />
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Comparison table ── */}
      <section className="bg-slate-50 py-16 dark:bg-ink-soft/60 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeader eyebrow="Compare" title="Plan comparison" />
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-ink">
            <table className="w-full min-w-[520px] text-left text-sm">
              <caption className="sr-only">Feature comparison between TaskFlow plans</caption>
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th scope="col" className="p-4 font-semibold text-slate-500 dark:text-slate-400">
                    Feature
                  </th>
                  {PLANS.map((p) => (
                    <th
                      key={p.name}
                      scope="col"
                      className={`p-4 text-center font-bold ${p.highlight ? "text-brand-500" : "text-slate-900 dark:text-white"}`}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr
                    key={row.label}
                    className="border-b border-slate-100 last:border-0 odd:bg-slate-50/60 dark:border-slate-800/60 dark:odd:bg-white/[0.02]"
                  >
                    <th scope="row" className="p-4 font-medium text-slate-700 dark:text-slate-300">
                      {row.label}
                    </th>
                    {row.values.map((v, i) => (
                      <td key={i} className="p-4 text-center text-slate-600 dark:text-slate-400">
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Section 3: FAQ ── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <SectionHeader eyebrow="FAQ" title="Frequently asked questions" />
          <div className="space-y-3">
            {PRICING_FAQ.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-slate-200 bg-white p-5 transition-colors open:border-brand-200 dark:border-slate-800 dark:bg-ink-soft dark:open:border-brand-500/40"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900 dark:text-white [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="size-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: Call to action ── */}
      <FinalCTA />
    </div>
  );
}
