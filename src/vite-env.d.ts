/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public site origin used for canonical URLs, robots.txt and sitemap.xml. */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
