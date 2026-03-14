# Contributing translations

Thank you for helping make DevDocs available in more languages. This guide explains the full translation workflow — from claiming a page to opening a pull request.

---

## Who can contribute

Anyone. You do not need to be a developer. If you can read and write a supported language fluently, you can contribute a translation.

---

## How content is organised

```
content/
├── en/docs/           ← English source (canonical — do not edit these for translations)
├── fr/docs/           ← French translations
├── es/docs/           ← Spanish translations
├── ja/docs/           ← Japanese translations
└── [locale]/docs/     ← add your language here
```

The English files in `content/en/docs/` are the source of truth. Every page in English must exist before it can be translated. Translations are entirely optional — if a translated file is missing, English is served automatically with a visible fallback banner.

---

## Claiming a page to translate

Before starting, check `translation-manifest.json` in the project root to see the current status of each page:

| Status | Meaning |
|---|---|
| `missing` | Not started — available to claim |
| `machine-translated` | Machine draft exists — needs human review |
| `needs-review` | Translation done — needs a second reader |
| `complete` | Fully translated and reviewed |

Open a GitHub issue titled **"Translation: [page] into [language]"** (e.g. `Translation: api-reference into Japanese`) before starting work. This prevents two people translating the same page simultaneously.

---

## Translating a page

**1. Copy the English source file**

```bash
cp content/en/docs/getting-started.mdx content/ja/docs/getting-started.mdx
```

**2. Update the frontmatter**

```yaml
---
title: はじめに                    ← translate
description: ...                   ← translate
translationStatus: needs-review    ← set to needs-review when done
lastUpdated: "2024-11-01"          ← keep the original date
translator: Your Name              ← add your name
readingTime: 5                     ← keep as-is
---
```

**3. Translate the body**

- Translate all prose and headings
- Keep all code blocks in English — code is language-neutral
- Keep all URLs unchanged
- Keep MDX component names unchanged (e.g. `<FallbackBanner>`)
- Tables, lists, and callouts should be translated

**4. Update the manifest**

In `translation-manifest.json`, update the entry for your language:

```json
"docs/getting-started": {
  "ja": {
    "status": "needs-review",
    "lastUpdated": "2024-11-01",
    "translator": "Your Name"
  }
}
```

**5. Open a pull request**

Title format: `[ja] Translate getting-started`

The PR description should include:
- Which page you translated
- Your confidence level (native speaker / fluent / intermediate)
- Any sections you are uncertain about

---

## Reviewing a translation

Pages with `needs-review` status need a second fluent speaker to check them before they are marked `complete`.

To review:
1. Read the translation alongside the English source
2. Check that meaning is preserved (not just literal word-for-word)
3. Check that technical terms are used correctly for that language community
4. If satisfied, update `translationStatus` to `complete` in the frontmatter and manifest
5. Open a PR titled `[ja] Review getting-started`

---

## Adding a new language

If your language is not yet supported, here is the complete process:

**1. Add the locale code to `src/i18n/routing.ts`:**

```typescript
locales: ['en', 'fr', 'es', 'ja', 'de'],  // ← add your code
```

**2. Create `messages/[locale].json`** — copy `messages/en.json` and translate all string values. Do not change any keys.

**3. Create `content/[locale]/docs/`** — add at least one translated MDX file to get started. The rest will fall back to English automatically.

**4. Update `translation-manifest.json`** — add your locale key to every existing doc entry with `"status": "missing"`.

**5. Update `vercel.json`** — add your locale code to the header source pattern:

```json
"source": "/:locale(en|fr|es|ja|de)/(.*)"
```

**6. Update locale name maps** — add your locale to `LOCALE_LABELS` and `LOCALE_FLAG` in:
- `src/components/LanguageSwitcher.tsx`
- `src/components/FallbackBanner.tsx`
- `src/app/[locale]/status/page.tsx`
- `src/app/[locale]/page.tsx`

**7. Open a PR** titled `Add [language] locale`.

---

## Style guidelines

- Use formal register for documentation (vous in French, usted in Spanish, です/ます in Japanese)
- Preserve technical terms in English when no established equivalent exists in the target language — this is common for API documentation
- Do not translate product names, company names, or proper nouns
- Keep sentence length similar to the English source — very long or very short translations often signal a problem

---

## Questions

Open a GitHub Discussion if you are unsure about any of the above. Maintainers are happy to help.
