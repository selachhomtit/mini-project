export const SITE = {
  name: "Ponleu",
  url: import.meta.env.VITE_SITE_URL ?? "http://localhost:5173",
  tagline: "Where Cambodian teams move work forward",
  description:
    "Ponleu is a smart task manager built in Phnom Penh. Plan projects with Kanban boards, assign tasks to your team, and track progress in English or Khmer.",
  keywords: [
    "task manager",
    "project management",
    "kanban board",
    "team collaboration",
    "Cambodia",
    "Phnom Penh",
    "Khmer",
    "ISTAD",
    "Ponleu",
  ],
  locale: "en_US",
} as const;

type PageSeo = {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
};

/**
 * Per-page metadata (title, canonical URL, Open Graph, Twitter).
 * React 19 hoists these tags into <head> automatically.
 */
export function PageMeta({ title, description = SITE.description, path, noIndex = false }: PageSeo) {
  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      {path !== undefined && <link rel="canonical" href={`${SITE.url}${path}`} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {path !== undefined && <meta property="og:url" content={`${SITE.url}${path}`} />}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </>
  );
}
