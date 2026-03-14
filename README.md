# DevDocs — Multilingual Documentation Platform

[![CI](https://github.com/your-username/multilingual-docs/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/multilingual-docs/actions/workflows/ci.yml)

A production-quality multilingual documentation site demonstrating real-world i18n engineering: locale-aware routing, translation workflows, graceful fallbacks, and static generation across all language × page combinations.

**Live demo:** https://multilingual-docs.vercel.app  
**Stack:** Next.js 15 · next-intl 4 · MDX · Tailwind CSS 4 · TypeScript · Vercel

---

## What this demonstrates

| Capability | Implementation |
|---|---|
| Locale-aware routing | `/en/docs/getting-started`, `/fr/`, `/es/`, `/ja/` |
| Language switcher | Client component using next-intl typed router, preserves current path |
| Locale detection | `Accept-Language` header via next-intl middleware |
| Translation fallback | English served with visible amber banner when locale missing |
| Translation status | 4-state tracking: `complete`, `needs-review`, `machine-translated`, `missing` |
| Coverage dashboard | `/[locale]/status` — matrix view of all docs × locales with completion % |
| SSG | All `locale × slug` paths pre-rendered at build time |
| Dark mode | `prefers-color-scheme` + manual toggle, persisted to localStorage |
| Type safety | Fully typed locale params, frontmatter, manifest schema, and message keys |
| CI | GitHub Actions runs type-check, lint, build, and manifest validation on every PR |

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
│   ├── es.json
│   └── ja.json
├── content/                     # MDX documentation content
│   ├── en/docs/                 # English (canonical source)
│   ├── fr/docs/                 # French (2/3 complete)
│   ├── es/docs/                 # Spanish (1/3 complete)
│   └── ja/docs/                 # Japanese (1/3 complete)
├── translation-manifest.json    # Translation coverage tracker
├── scripts/
│   └── validate-manifest.mjs   # CI + local validation script
├── .github/workflows/ci.yml    # Type-check · lint · build · validate
└── src/
    ├── i18n/
    │   ├── routing.ts           # Locale list — single source of truth
    │   ├── request.ts           # next-intl server config
    │   └── navigation.ts        # Locale-aware Link, useRouter, etc.
    ├── app/
    │   ├── layout.tsx           # Root layout — owns <html>, <body>, providers
    │   ├── page.tsx             # Root redirect → /[defaultLocale]
    │   └── [locale]/
    │       ├── layout.tsx       # Locale validation + setRequestLocale
    │       ├── page.tsx         # Home page
    │       ├── docs/
    │       │   ├── page.tsx     # /docs redirect → /docs/getting-started
    │       │   └── [slug]/page.tsx
    │       └── status/page.tsx  # Translation coverage dashboard
    ├── components/
    │   ├── LanguageSwitcher.tsx
    │   ├── FallbackBanner.tsx
    │   ├── TranslationStatusBadge.tsx
    │   ├── DocNav.tsx
    │   ├── SiteHeader.tsx
    │   └── ThemeToggle.tsx
    └── lib/
        ├── content.ts           # MDX loader with fallback logic
        └── manifest.ts          # Manifest reader + coverage stats
```

---

## i18n strategy

### Two-tier translation model

**UI strings** (`messages/[locale].json`) — navigation labels, banner text, metadata. Managed by next-intl's `useTranslations` and `getTranslations`.

**Content** (`content/[locale]/docs/*.mdx`) — documentation pages authored in MDX, translated independently per page per locale.

This separation reflects real-world practice: UI strings are typically sent to a TMS (Phrase, Lokalise) in bulk; long-form docs are translated page by page, often by different contributors.

### Locale routing

All routes carry an explicit locale prefix:

```
/en/docs/getting-started
/fr/docs/getting-started
/ja/docs/getting-started
```

`localePrefix: 'always'` is intentional. The `'as-needed'` alternative removes the prefix for the default locale but creates CDN cache collisions — `/docs/getting-started` would need to vary by `Accept-Language`, which most CDNs handle poorly. An explicit prefix gives every locale its own independent cache key.

### Fallback strategy

When a user requests `/ja/docs/api-reference` and no Japanese file exists:

1. `getDocContent('ja', 'docs/api-reference')` checks for `content/ja/docs/api-reference.mdx`
2. Not found → loads `content/en/docs/api-reference.mdx`
3. Returns `{ isFallback: true, frontmatter: { translationStatus: 'missing' } }`
4. Page renders with `<FallbackBanner>` linking to CONTRIBUTING.md

**No page ever 404s due to a missing translation.**

### Translation status

| Status | Badge colour | Meaning |
|---|---|---|
| `complete` | Green | Human-translated and reviewed |
| `needs-review` | Amber | Translated, awaiting peer review |
| `machine-translated` | Sky | MT output, needs human verification |
| `missing` | Gray | No translation; English served |

### Static generation

```typescript
export async function generateStaticParams() {
  const slugs = getAllDocSlugs();           // reads content/en/docs/
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}
```

4 locales × 3 docs = 12 pre-rendered HTML files. Scales linearly as you add languages or pages.

### Manifest validation

```bash
npm run validate
# ✅  Manifest valid — 3 docs × 4 locales (12 entries)
```

Runs automatically in CI. Catches missing locale entries or invalid status values before they reach production.

---

## Adding a new language

1. Add locale code to `src/i18n/routing.ts` — the single source of truth
2. Create `messages/[locale].json`
3. Add locale entries to `translation-manifest.json`
4. Add locale to `LOCALE_LABELS`/`LOCALE_FLAG` in 4 component files
5. Add locale to `vercel.json` header pattern
6. (Optional) add translated MDX files to `content/[locale]/docs/`
7. Run `npm run validate`

No other code changes required.

---

## Adding new content

1. Create `content/en/docs/[slug].mdx` with frontmatter
2. Add manifest entry for all locales
3. Run `npm run validate`
4. Available immediately at `/en/docs/[slug]` — other locales fall back to English

---

## Local development

```bash
npm install
npm run dev          # dev server with HMR
npm run type-check   # TypeScript — zero errors expected
npm run lint         # ESLint
npm run validate     # check translation-manifest.json
npm run build        # production build — pre-renders all static paths
```

Key URLs in dev:
- `http://localhost:3000` — redirects to your browser's preferred locale
- `http://localhost:3000/ja/docs/api-reference` — English fallback with amber banner
- `http://localhost:3000/en/status` — translation coverage dashboard

---

## Deployment

```bash
npx vercel --prod
```

`vercel.json` sets `Content-Language` and `Cache-Control` response headers per locale path, ensuring correct CDN cache isolation between languages.

---

## Scaling to a headless CMS

`src/lib/content.ts` is filesystem-based for zero-dependency simplicity. The interface contract — `getDocContent(locale, slug) → Doc | null` — stays identical whether the source is the local filesystem, Contentful, Strapi, or Sanity. Swap the function body; nothing else changes.

---

## Background

Built to demonstrate applied i18n engineering for developer-facing roles at API-first companies and documentation platforms. The author has 15 years of international web experience at a global telecommunications infrastructure company (7 languages, EMEA + North America), holds an MSc in Computer Science (Wrexham University, 2024), and is natively bilingual in English and French.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full translator onboarding guide.

---

## Licence

MIT
