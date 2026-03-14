/**
 * Translation manifest utilities
 *
 * Provides typed access to translation-manifest.json and helpers
 * for the /status dashboard and DocNav status badges.
 */

import manifest from '../../translation-manifest.json';
import { routing, type Locale } from '@/i18n/routing';
import type { TranslationStatus } from './content';

export type ManifestEntry = {
  status: TranslationStatus;
  lastUpdated?: string;
  translator?: string;
};

export type ManifestDoc = Record<string, ManifestEntry>;
export type Manifest = Record<string, ManifestDoc>;

const typedManifest = manifest as unknown as Manifest;

/**
 * All doc keys in the manifest (e.g. ['docs/getting-started', ...])
 */
export function getManifestKeys(): string[] {
  return Object.keys(typedManifest);
}

/**
 * Status for a specific doc + locale combination.
 */
export function getTranslationStatus(
  docKey: string,
  locale: Locale
): ManifestEntry | null {
  return typedManifest[docKey]?.[locale] ?? null;
}

/**
 * Full coverage matrix for the status dashboard:
 * Returns an array of { docKey, statuses: Record<Locale, ManifestEntry | null> }
 */
export function getCoverageMatrix() {
  return getManifestKeys().map((docKey) => ({
    docKey,
    statuses: Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        getTranslationStatus(docKey, locale),
      ])
    ) as Record<Locale, ManifestEntry | null>,
  }));
}

/**
 * Percentage of docs with 'complete' status for a given locale.
 */
export function getLocaleCompletionPercent(locale: Locale): number {
  const keys = getManifestKeys();
  if (keys.length === 0) return 0;
  const complete = keys.filter(
    (k) => typedManifest[k]?.[locale]?.status === 'complete'
  ).length;
  return Math.round((complete / keys.length) * 100);
}

/**
 * CSS class + label for each status value — single source of truth
 * for status badge styling used across DocNav and the status dashboard.
 */
export const STATUS_CONFIG: Record<
  TranslationStatus,
  { label: string; className: string; dotClass: string }
> = {
  complete: {
    label: 'complete',
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    dotClass: 'bg-emerald-500',
  },
  'needs-review': {
    label: 'needs review',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    dotClass: 'bg-amber-500',
  },
  'machine-translated': {
    label: 'machine translated',
    className: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300',
    dotClass: 'bg-sky-500',
  },
  missing: {
    label: 'not translated',
    className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    dotClass: 'bg-zinc-400',
  },
};
