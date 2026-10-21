import Link from "next/link";
import { PLANS } from "@/data/pricing";
import SectionHeader from "@/components/common/SectionHeader";
import PricingCard from "./PricingCard";

export default function Pricing() {
  return (
    <section id="pricing" className="py-16 sm:py-24 bg-slate-50 dark:bg-ink-soft/60 transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="Pricing"
          title="Simple, honest pricing"
          subtitle="Free for students. Affordable for Cambodian startups. Pay in USD or riel."
        />

        <div className="mx-auto grid max-w-5xl grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-slate-500 dark:text-slate-400">
          Need the details?{" "}
          <Link href="/pricing" className="font-semibold text-brand-500 hover:underline">
            Compare all plans →
          </Link>
        </p>
      </div>
    </section>
  );
}
