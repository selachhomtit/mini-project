import type { Metadata } from "next";

export const SITE = {
  name: "TaskFlow",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  tagline: "Where Cambodian teams move work forward",
  description:
    "TaskFlow is a smart task manager built in Phnom Penh. Plan projects with Kanban boards, assign tasks to your team, and track progress in English or Khmer.",
  keywords: [
    "task manager",
    "project management",
    "kanban board",
    "team collaboration",
    "Cambodia",
    "Phnom Penh",
    "Khmer",
    "ISTAD",
    "TaskFlow",
  ],
  locale: "en_US",
} as const;

type PageSeo = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

/** Builds per-page metadata (title, canonical URL, Open Graph, Twitter) from one place. */
export function createMetadata({ title, description, path, noIndex = false }: PageSeo): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: `${title} | ${SITE.name}`,
      description,
      url: path,
      locale: SITE.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE.name}`,
      description,
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
