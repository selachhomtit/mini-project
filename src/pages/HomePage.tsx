import Hero from "@/components/landing/Hero";
import Logos from "@/components/landing/Logos";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import FinalCTA from "@/components/landing/FinalCTA";
import { SITE } from "@/lib/seo";
import { PLANS } from "@/data/pricing";

// Structured data so search engines understand Ponleu is a web application with offers.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  inLanguage: ["en", "km"],
  offers: PLANS.filter((p) => p.priceUsd !== null).map((p) => ({
    "@type": "Offer",
    name: p.name,
    price: p.priceUsd,
    priceCurrency: "USD",
  })),
};

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white dark:bg-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <Logos />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FinalCTA />
    </div>
  );
}
