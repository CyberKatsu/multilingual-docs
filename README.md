# DevDocs — Multilingual Documentation Platform

A production-quality multilingual documentation site demonstrating real-world i18n engineering: locale-aware routing, translation workflows, graceful fallbacks, and static generation across all language × page combinations.

**Live demo:** https://multilingual-docs.vercel.app
**Stack:** Next.js 14 · next-intl · MDX · Tailwind CSS · TypeScript · Vercel

---

## What this demonstrates

| Capability | Implementation |
|---|---|
| Locale-aware routing | `/en/docs/getting-started`, `/fr/docs/démarrage` |
| Language switcher | Client component using `next-intl` typed router |
| Locale detection | `Accept-Language` header via next-intl middleware |
| Translation fallback | English served with visible banner when locale missing |
| Translation status | Central manifest + per-page frontmatter tracking |
| Coverage dashboard | `/[locale]/status` — matrix view of all docs × locales |
| SSG | All `locale × slug` paths pre-rendered at build time |
| Dark mode | `prefers-color-scheme` + manual toggle, persisted to localStorage |
| Type safety | Fully typed locale params, frontmatter, and manifest schema |

---

## Architecture

```
Browser → next-intl middleware (locale detect + redirect)
       → App Router [locale]/docs/[slug]
       → content loader (locale MDX → English fallback)
       → MDXRemote (RSC rendering)
       → FallbackBanner if isFallback === true
```

### Directory structure

```
multilingual-docs/
├── messages/                    # UI strings (JSON) — one file per locale
│   ├── en.json
│   ├── fr.json
│   └── es.json
│
├── content/                     # MDX documentation content
│   ├── en/docs/                 # English (canonical source)
│   │   ├── getting-started.mdx
│   │   ├── api-reference.mdx
│   │   └── deployment.mdx
│   ├── fr/docs/                 # French translations
│   └── es/docs/                 # Spanish translations
│
├── translation-manifest.json    # Translation coverage tracker
│
├── src/
│   ├── i18n/
│   │   ├── routing.ts           # Locale list — single source of truth
│   │   ├── request.ts           # next-intl server config
│   │   └── navigation.ts        # Locale-aware Link, useRouter, etc.
│   │
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx       # Root layout with NextIntlClientProvider
│   │   │   ├── page.tsx         # Home page
│   │   │   ├── docs/[slug]/
│   │   │   │   └── page.tsx     # Doc renderer with MDXRemote
│   │   │   └── status/
│   │   │       └── page.tsx     # Translation coverage dashboard
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── LanguageSwitcher.tsx # Locale select — preserves current path
│   │   ├── FallbackBanner.tsx   # Warning shown when serving English fallback
│   │   ├── TranslationStatusBadge.tsx
│   │   ├── DocNav.tsx           # Sidebar with per-page status badges
│   │   ├── SiteHeader.tsx
│   │   └── ThemeToggle.tsx
│   │
│   └── lib/
│       ├── content.ts           # MDX loader with fallback logic
│       └── manifest.ts          # Translation manifest reader + coverage stats
│
└── middleware.ts                # next-intl locale detection + redirect
```

---

## i18n strategy

### Two-tier translation model

The project separates two distinct layers of translatable content:

**1. UI strings** (`messages/[locale].json`)
Navigation labels, banner text, metadata, and any string rendered by a React component. Managed by `next-intl`'s `useTranslations` hook and `getTranslations` server function.

**2. Content** (`content/[locale]/docs/*.mdx`)
The actual documentation pages, authored in MDX. Each file is independently translated and carries a `translationStatus` field in its frontmatter.

This separation reflects real-world practice: UI strings are typically sent to a translation management system (TMS) like Phrase or Lokalise in bulk; long-form documentation is translated page by page, often by different teams.

### Locale routing

All routes are prefixed with the locale code:

```
/en/docs/getting-started
/fr/docs/getting-started
/es/docs/getting-started
```

The `localePrefix: 'always'` setting (in `src/i18n/routing.ts`) is intentional. The alternative (`'as-needed'`, which omits the prefix for the default locale) is tempting for aesthetics but creates CDN cache collisions: `/docs/getting-started` would need to vary its cache by `Accept-Language` header, which most CDNs handle poorly. An explicit locale prefix gives every locale its own cache key with zero extra configuration.

### Fallback strategy

When a user requests `/fr/docs/api-reference` and no French translation exists:

1. `getDocContent('fr', 'docs/api-reference')` checks for `content/fr/docs/api-reference.mdx`
2. File not found → falls back to `content/en/docs/api-reference.mdx`
3. Returns `{ isFallback: true, frontmatter: { translationStatus: 'missing', ... } }`
4. The page renders with a `<FallbackBanner>` explaining the situation and linking to the contribution guide

This approach means **no page ever 404s due to a missing translation** — a key UX principle for multilingual docs.

### Translation status

Each doc has one of four statuses:

| Status | Source | Meaning |
|---|---|---|
| `complete` | MDX frontmatter + manifest | Human-translated and reviewed |
| `needs-review` | MDX frontmatter + manifest | Translated but not peer-reviewed |
| `machine-translated` | MDX frontmatter + manifest | MT output; needs human verification |
| `missing` | Inferred (file absent) | No translation; English served |

Status is tracked in two places:
- **MDX frontmatter** — the authoritative status for that file
- **`translation-manifest.json`** — a cache for the sidebar and dashboard, so the app doesn't need to read every MDX file on every request

### Static generation

At build time, `generateStaticParams()` in `[locale]/docs/[slug]/page.tsx` returns every valid `locale × slug` combination. For 3 locales and 3 docs, this produces 9 pre-rendered HTML files. Adding languages or pages scales this linearly — no runtime cost.

```typescript
export async function generateStaticParams() {
  const slugs = getAllDocSlugs();                    // reads English /content/en/docs/
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}
```

The English directory is the **canonical source of truth** for which pages exist. A page in `content/en/docs/` is guaranteed to be accessible in all locales (with fallback). A page only in `content/fr/docs/` would never be served.

---

## Adding a new language

1. Add the locale code to `src/i18n/routing.ts`:
   ```typescript
   locales: ['en', 'fr', 'es', 'de'],  // ← add 'de'
   ```

2. Create `messages/de.json` (copy `messages/en.json` and translate all values)

3. Create `content/de/docs/` and add translated MDX files (optional — English fallback applies automatically)

4. Update `translation-manifest.json` with `de` entries for each doc

5. Run `npm run build` — all `de × slug` paths are pre-rendered automatically

No other code changes are required. The language switcher, status dashboard, and fallback logic all respond to the locale list in `routing.ts`.

---

## Adding new content

1. Create `content/en/docs/my-new-page.mdx` with valid frontmatter:
   ```yaml
   ---
   title: My New Page
   description: Page description for SEO.
   translationStatus: complete
   lastUpdated: "2024-11-01"
   readingTime: 3
   ---
   ```

2. Add an entry to `translation-manifest.json`:
   ```json
   "docs/my-new-page": {
     "en": { "status": "complete", "lastUpdated": "2024-11-01" },
     "fr": { "status": "missing" },
     "es": { "status": "missing" }
   }
   ```

3. The page is immediately available at `/en/docs/my-new-page` (and `/fr/`, `/es/` with English fallback)

---

## Scaling to a headless CMS

The content loading layer in `src/lib/content.ts` is intentionally filesystem-based for simplicity, but it is designed to be swapped out. The interface contract — `getDocContent(locale, slug) → Doc | null` — stays the same whether the source is:

- **MDX files** (current implementation)
- **Contentful** — swap `fs.readFileSync` for Contentful's Delivery API, filtering by `locale` field
- **Strapi** — query `/api/docs?locale=fr&filters[slug][$eq]=getting-started`
- **Sanity** — GROQ query with `_lang` projection

The rest of the app (routing, fallback logic, status tracking) does not change.

---

## Local development

```bash
npm install
npm run dev
```

Then visit:
- http://localhost:3000 → redirects to your browser's preferred locale
- http://localhost:3000/en/docs/getting-started
- http://localhost:3000/fr/docs/getting-started
- http://localhost:3000/es/docs/getting-started ← shows English fallback with banner
- http://localhost:3000/en/status → translation coverage dashboard

---

## Deployment

```bash
# Vercel (recommended)
npx vercel --prod

# Or push to GitHub and connect to vercel.com/new
```

`vercel.json` sets `Content-Language` and `Cache-Control` headers per locale path. See [Deployment docs](/en/docs/deployment) for full details.

---

## Background

This project was built to demonstrate applied i18n engineering for developer-facing roles at API-first companies and documentation platforms. The author has 15 years of international web experience at a telecommunications infrastructure company (7 languages, EMEA + North America), holds an MSc in Computer Science, and is natively bilingual in English and French.

---

## Licence

MIT
