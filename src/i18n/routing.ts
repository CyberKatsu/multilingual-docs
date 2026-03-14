import { defineRouting } from 'next-intl/routing';

/**
 * Central routing configuration for next-intl.
 *
 * To add a new language:
 *   1. Add the locale code here
 *   2. Add messages/[locale].json
 *   3. Add content/[locale]/docs/ directory (optional — English fallback applies automatically)
 *   4. Update translation-manifest.json
 *
 * That's it. No other changes required.
 */
export const routing = defineRouting({
  locales: ['en', 'fr', 'es'],
  defaultLocale: 'en',

  /**
   * Always prefix the URL with the locale, including the default.
   * /en/docs/getting-started  ← clear, cache-friendly, unambiguous
   * /fr/docs/getting-started
   * /es/docs/getting-started
   *
   * Alternative: 'as-needed' removes the prefix for defaultLocale,
   * but this makes CDN cache invalidation harder for multilingual sites.
   */
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
export const locales = routing.locales;
export const defaultLocale = routing.defaultLocale;
