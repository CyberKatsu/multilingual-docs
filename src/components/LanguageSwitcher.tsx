'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import { useTransition } from 'react';

/**
 * LanguageSwitcher
 *
 * Switches between supported locales while preserving the current path.
 * Uses next-intl's typed router to ensure correct locale-prefixed redirects.
 *
 * The locale is persisted via the NEXT_LOCALE cookie set by next-intl's
 * middleware, so returning users are redirected to their preferred language.
 */

const LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
};

const LOCALE_FLAG: Record<string, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  es: '🇪🇸',
};

export default function LanguageSwitcher() {
  const t = useTranslations('translation');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = e.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      <Globe
        size={15}
        className="text-zinc-400 flex-shrink-0"
        aria-hidden="true"
      />
      <label htmlFor="locale-select" className="sr-only">
        {t('language_switcher_label')}
      </label>
      <select
        id="locale-select"
        value={locale}
        onChange={handleChange}
        disabled={isPending}
        className={[
          'text-sm bg-transparent border-none outline-none cursor-pointer',
          'text-zinc-700 dark:text-zinc-300',
          'focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 rounded',
          isPending ? 'opacity-50' : '',
        ].join(' ')}
        aria-label={t('language_switcher_label')}
      >
        {routing.locales.map((l) => (
          <option key={l} value={l}>
            {LOCALE_FLAG[l]} {LOCALE_LABELS[l]}
          </option>
        ))}
      </select>
    </div>
  );
}
