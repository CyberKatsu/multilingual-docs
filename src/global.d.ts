/**
 * next-intl v4 type augmentation.
 *
 * The `export {}` is required — it turns this into a TypeScript module file,
 * which means `declare module 'next-intl'` is treated as a module *augmentation*
 * (adding to next-intl's existing exports). Without it, the file is an ambient
 * script and the declare block becomes a full module replacement, hiding all of
 * next-intl's real exports (NextIntlClientProvider, useTranslations, etc.).
 */
export {};

declare module 'next-intl' {
  interface AppConfig {
    // typeof import() is a pure type expression — no runtime import emitted.
    Messages: typeof import('../messages/en.json');
  }
}
