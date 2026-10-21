import { HOW_IT_WORKS, SPRINT_PREVIEW } from "@/data/features";
import { Link } from "react-router";
import SectionHeader from "@/components/common/SectionHeader";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-24 bg-slate-50 dark:bg-ink-soft/60 transition-colors">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeader
            align="left"
            eyebrow="How it works"
            title={
              <>
                From backlog to shipped <span className="text-brand-500">in minutes</span>
              </>
            }
          />

          <ol className="space-y-6">
            {HOW_IT_WORKS.map((step) => (
              <li key={step.num} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white shadow-lg shadow-brand-500/30">
                  {step.num}
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>

          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/30"
          >
            Try it now →
          </Link>
        </div>

        {/* Sprint board preview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-ink sm:p-5">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex gap-1.5" aria-hidden>
              <span className="size-3 rounded-full bg-red-400" />
              <span className="size-3 rounded-full bg-amber-400" />
              <span className="size-3 rounded-full bg-emerald-400" />
            </div>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Capstone Project · Sprint 3
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {SPRINT_PREVIEW.map((col) => (
              <div key={col.label} className="rounded-xl bg-slate-100 p-3 dark:bg-ink-soft">
                <div className="mb-3 flex items-center gap-2">
                  <span className={`size-2 rounded-full ${col.dot}`} />
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                    {col.label}
                  </span>
                  <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">{col.items.length}</span>
                </div>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-lg bg-white px-3 py-2 text-xs text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-300"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
