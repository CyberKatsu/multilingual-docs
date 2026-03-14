/**
 * Content loading library
 *
 * Handles all MDX file I/O, locale fallback logic, and translation status
 * resolution. This is the single boundary between the filesystem and the app.
 *
 * Fallback chain: locale MDX → English MDX → null
 * If the locale-specific file is missing, `isFallback: true` is set on
 * the returned Doc so the UI can render the FallbackBanner.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import manifest from '../../translation-manifest.json';
import { routing, type Locale } from '@/i18n/routing';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TranslationStatus =
  | 'complete'
  | 'needs-review'
  | 'machine-translated'
  | 'missing';

export interface DocFrontmatter {
  title: string;
  description: string;
  translationStatus: TranslationStatus;
  lastUpdated?: string;
  translator?: string;
  readingTime?: number;
}

export interface Doc {
  slug: string;
  locale: Locale;
  frontmatter: DocFrontmatter;
  content: string;       // Raw MDX string — serialised by the page component
  isFallback: boolean;   // True when English fallback is being served
  resolvedLocale: Locale; // The locale the content was actually loaded from
}

export interface DocNavItem {
  slug: string;
  title: string;
  isFallback: boolean;
  translationStatus: TranslationStatus;
}

// ---------------------------------------------------------------------------
// Path helpers
// ---------------------------------------------------------------------------

const CONTENT_ROOT = path.join(process.cwd(), 'content');

function contentPath(locale: string, slug: string): string {
  return path.join(CONTENT_ROOT, locale, `${slug}.mdx`);
}

// ---------------------------------------------------------------------------
// Core loader
// ---------------------------------------------------------------------------

/**
 * Load a doc for the given locale and slug.
 * Falls back to English if the locale-specific file does not exist.
 * Returns null only if neither locale nor English file exists.
 */
export async function getDocContent(
  locale: Locale,
  slug: string
): Promise<Doc | null> {
  const localePath = contentPath(locale, slug);
  const englishPath = contentPath('en', slug);

  let filePath: string;
  let isFallback: boolean;

  if (fs.existsSync(localePath)) {
    filePath = localePath;
    isFallback = false;
  } else if (fs.existsSync(englishPath)) {
    filePath = englishPath;
    isFallback = true;
  } else {
    return null;
  }

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);

  const frontmatter = data as DocFrontmatter;

  // Override status when serving as fallback — the doc is "missing" in the
  // requested locale even if the English source says "complete".
  if (isFallback) {
    frontmatter.translationStatus = 'missing';
  }

  return {
    slug,
    locale,
    frontmatter,
    content,
    isFallback,
    resolvedLocale: isFallback ? 'en' : locale,
  };
}

// ---------------------------------------------------------------------------
// Static params (used by generateStaticParams)
// ---------------------------------------------------------------------------

/**
 * Returns all slugs derived from the English source directory.
 * The English directory is the canonical source of truth for which pages exist.
 */
export function getAllDocSlugs(): string[] {
  const enDir = path.join(CONTENT_ROOT, 'en', 'docs');
  if (!fs.existsSync(enDir)) return [];
  return fs
    .readdirSync(enDir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}

/**
 * Returns all locale × slug combinations for generateStaticParams.
 */
export function getAllStaticParams(): Array<{ locale: string; slug: string }> {
  const slugs = getAllDocSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  );
}

// ---------------------------------------------------------------------------
// Navigation
// ---------------------------------------------------------------------------

/**
 * Returns DocNavItems for the sidebar.
 * Reads titles from English files (for slugs) and checks if a locale
 * version exists to determine isFallback and translationStatus.
 *
 * This is intentionally synchronous-ish (using readFileSync) because it
 * is called at build time during SSG, not in a hot request path.
 */
export function getDocNavItems(locale: Locale): DocNavItem[] {
  const slugs = getAllDocSlugs();

  return slugs.map((slug) => {
    const manifestKey = `docs/${slug}` as keyof typeof manifest;
    const manifestEntry = manifest[manifestKey];
    const localeEntry = manifestEntry?.[locale as keyof typeof manifestEntry];

    // Read title from the locale file if available, otherwise fall back to English
    let title = slug;
    const localeMdxPath = contentPath(locale, `docs/${slug}`);
    const englishMdxPath = contentPath('en', `docs/${slug}`);

    const localeFileExists = fs.existsSync(localeMdxPath);
    const isFallback = !localeFileExists;
    const filePath = localeFileExists ? localeMdxPath : englishMdxPath;

    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(raw);
      title = (data as DocFrontmatter).title || slug;
    }

    const translationStatus: TranslationStatus =
      (localeEntry as any)?.status ?? (isFallback ? 'missing' : 'complete');

    return { slug, title, isFallback, translationStatus };
  });
}
