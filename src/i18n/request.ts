import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  /**
   * next-intl v4: requestLocale is now a Promise<string | undefined>.
   * Always await it before use.
   */
  let locale = await requestLocale;

  // Fall back to the default locale if the value is missing or unsupported
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
