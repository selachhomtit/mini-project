"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";
import { CORE_FEATURES } from "@/data/features";
import SectionHeader from "@/components/common/SectionHeader";
import Reveal from "@/components/common/Reveal";
import FeatureCard from "./FeatureCard";

export default function Features() {
  const { t } = useTranslation();

  return (
    <section id="features" className="py-16 sm:py-24 bg-white dark:bg-ink transition-colors">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="The system"
          title={t("landing.features.title")}
          subtitle={t("landing.features.subtitle")}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {CORE_FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.06}>
              <FeatureCard feature={feature} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
