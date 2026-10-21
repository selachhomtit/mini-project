import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const PUBLIC_ROUTES = [
  { path: "", priority: 1 },
  { path: "/features", priority: 0.9 },
  { path: "/contact", priority: 0.7 },
  { path: "/login", priority: 0.4 },
  { path: "/register", priority: 0.6 },
];

/** Emits robots.txt and sitemap.xml at build time (replaces Next's robots.ts / sitemap.ts). */
function seoFiles(siteUrl: string): Plugin {
  return {
    name: "ponleu-seo-files",
    apply: "build",
    generateBundle() {
      const lastmod = new Date().toISOString();
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: [
          "User-Agent: *",
          "Allow: /",
          "Disallow: /dashboard/",
          "Disallow: /forgot-password",
          "Disallow: /reset-password",
          "",
          `Sitemap: ${siteUrl}/sitemap.xml`,
          "",
        ].join("\n"),
      });
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          PUBLIC_ROUTES.map(
            ({ path: p, priority }) =>
              `  <url><loc>${siteUrl}${p}</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>${priority}</priority></url>`,
          ).join("\n") +
          `\n</urlset>\n`,
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const siteUrl = env.VITE_SITE_URL ?? "http://localhost:5173";

  return {
    plugins: [
      react({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
      tailwindcss(),
      seoFiles(siteUrl),
    ],
    resolve: {
      alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    },
    build: {
      rollupOptions: {
        output: {
          // Long-lived vendor chunks: they change rarely, so browsers keep them cached across deploys.
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (/[\\/]node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/.test(id)) return "react";
            if (/[\\/]node_modules[\\/](@reduxjs|redux|react-redux|immer|reselect)[\\/]/.test(id)) return "redux";
            if (/[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/.test(id)) return "motion";
            if (/[\\/]node_modules[\\/](radix-ui|@radix-ui)[\\/]/.test(id)) return "radix";
          },
        },
      },
    },
  };
});
