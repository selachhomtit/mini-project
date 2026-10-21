# TaskFlow — Smart Task Manager for Cambodian Teams

ISTAD Frontend Mini Project. TaskFlow is a task and project manager for students, startups, and NGOs in Cambodia. It has Kanban boards, team workspaces, subtasks, comments, notifications, and dashboard charts, in **English and ខ្មែរ**.

## Tech stack

| Area | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, React Compiler |
| Language | TypeScript (strict) |
| Styling | **Tailwind CSS v4** (`@theme` brand tokens, custom animations, class-based dark mode) |
| UI | shadcn/ui (Radix), lucide-react icons, Framer Motion |
| State | Redux Toolkit + RTK Query (local data, no backend) |
| Validation | Zod |

## Pages (each has 3+ sections)

| Route | Sections |
| --- | --- |
| `/` Home | Hero + interactive Kanban demo, audiences, features, how it works, testimonials, pricing, CTA |
| `/features` | Hero + stats, core features, "Designed for Cambodian teams", how it works, CTA |
| `/pricing` | Plans (USD + KHR), comparison table, FAQ, CTA |
| `/about` | Hero, stats, advisors, team |
| `/contact` | Hero, contact info + form, office hours + map |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Auth |
| `/dashboard/*` | Dashboard, tasks, projects, teams, notifications, settings |

All content is **static data** in [`src/data/`](src/data). There is no backend or API:

- Public pages read `features.ts`, `pricing.ts`, and `testimonials.ts`.
- The dashboard reads the demo workspace in `workspace.ts` through [`src/lib/services/`](src/lib/services). These RTK Query endpoints use `queryFn` to read and write a local database ([`localDb.ts`](src/lib/services/localDb.ts)), which saves changes to `localStorage`.

### Demo account

| Email | Password |
| --- | --- |
| `demo@taskflow.com` | `Demo@1234` |

The login page has a **Use demo** button that fills these in. You can also register a new account.

## Features checklist

- **Responsive**: mobile-first layouts and a mobile navigation menu, tested down to 360px.
- **Dark mode**: toggle in the navbar. It follows the OS setting by default, is saved in `localStorage`, and is applied before first paint so the page never flashes white.
- **SEO**: per-page `metadata` (title template, description, canonical URL, Open Graph, Twitter), generated `sitemap.xml`, `robots.txt`, web manifest, Open Graph image, and JSON-LD (`SoftwareApplication`, `FAQPage`). Private pages are `noindex`.
- **i18n**: English / Khmer switcher, with the Suwannaphum Khmer font.
- **Brand identity**: `brand-*` colour scale and animations defined in [`src/app/globals.css`](src/app/globals.css).

## Project structure

```
src/
├── app/                 # Routes (App Router), layouts, SEO files (sitemap, robots, manifest, OG image)
├── components/
│   ├── common/          # Shared building blocks (SectionHeader, Reveal)
│   ├── landing/         # Marketing sections (Hero, Features, Pricing, ...)
│   ├── layout/          # Navbar, Footer
│   ├── team/ charts/    # Dashboard features
│   └── ui/              # shadcn/ui primitives
├── data/                # Static content (features, pricing, testimonials)
├── hooks/               # Custom hooks
└── lib/
    ├── services/        # Local data layer (replaces the old API)
    └── ...              # Redux store, i18n, SEO helper, utils
```

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
```

Optional `.env.local`:

```
NEXT_PUBLIC_SITE_URL=https://your-domain.com # used for canonical URLs and sitemap
```

To reset the demo data, clear the `taskflow-demo-db-v1` key in your browser's localStorage.

## Demo video

_Add your video link here._
