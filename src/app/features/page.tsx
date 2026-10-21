import Link from "next/link";
import { CORE_FEATURES, LOCAL_FEATURES } from "@/data/features";
import SectionHeader from "@/components/common/SectionHeader";
import Reveal from "@/components/common/Reveal";
import FeatureCard from "@/components/landing/FeatureCard";
import HowItWorks from "@/components/landing/HowItWorks";
import FinalCTA from "@/components/landing/FinalCTA";

const HIGHLIGHTS = [
  { value: "4", label: "Task statuses" },
  { value: "2", label: "Languages" },
  { value: "7", label: "Dashboard charts" },
  { value: "360px", label: "Smallest screen tested" },
];

export default function FeaturesPage() {
  return (
    <div className="bg-white dark:bg-ink">
      {/* ── Section 1: Hero ── */}
      <section className="relative overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pt-36">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 size-[520px] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl dark:bg-brand-500/25"
        />
        <div className="relative mx-auto max-w-4xl text-center animate-fade-up">
          <SectionHeader
            as="h1"
            eyebrow="Features"
            title={
              <>
                Everything your team needs to{" "}
                <span className="text-gradient-brand animate-shimmer">ship on time</span>
              </>
            }
            subtitle="Boards, subtasks, comments, notifications, and dashboards — designed for students, startups, and NGOs in Cambodia."
          />
          <dl className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {HIGHLIGHTS.map((h) => (
              <div
                key={h.label}
                className="rounded-2xl border border-slate-200 bg-white/70 p-4 backdrop-blur dark:border-slate-800 dark:bg-ink-soft/70"
              >
                <dt className="text-xs text-slate-500 dark:text-slate-400">{h.label}</dt>
                <dd className="mt-1 text-2xl font-extrabold text-brand-500">{h.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Section 2: Core features ── */}
      <section className="bg-slate-50 py-16 dark:bg-ink-soft/60 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Core"
            title="Plan, track, and finish work"
            subtitle="The tools you use every day, without the clutter."
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_FEATURES.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 0.06}>
                <FeatureCard feature={feature} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Made for Cambodia ── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeader
              align="left"
              eyebrow="Made in Phnom Penh"
              title={
                <>
                  Designed for <span className="text-brand-500">Cambodian teams</span>
                </>
              }
              subtitle="Khmer language, phone-first layouts, and planning that respects local holidays."
            />
            <Link href="/about" className="text-sm font-semibold text-brand-500 hover:underline">
              Read our story →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {LOCAL_FEATURES.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 0.06}>
                <FeatureCard feature={feature} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4: How it works ── */}
      <HowItWorks />

      {/* ── Section 5: Call to action ── */}
      <FinalCTA />
    </div>
  );
}
