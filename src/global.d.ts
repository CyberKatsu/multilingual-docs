/**
 * next-intl v4 type augmentation.
 *
 * Registers the shape of your messages so that useTranslations() and
 * getTranslations() provide compile-time autocomplete and catch missing keys.
 *
 * Previously (v3) this lived in a separate global.d.ts with IntlMessages.
 * In v4 it is scoped to the next-intl module via AppConfig.
 *
 * Docs: https://next-intl.dev/docs/workflows/typescript
 */

import en from '../messages/en.json';

declare module 'next-intl' {
  interface AppConfig {
    // The English file is the canonical type source — all other locales must
    // match this shape. TypeScript will error if a key is used that does not
    // exist in en.json.
    Messages: typeof en;
  }
}
