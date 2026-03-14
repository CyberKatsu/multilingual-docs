import { useTranslations } from 'next-intl';
import { AlertTriangle, ExternalLink } from 'lucide-react';
import type { Locale } from '@/i18n/routing';

/**
 * FallbackBanner
 *
 * Rendered at the top of a doc page when the requested locale has no
 * translation and English content is being served as fallback.
 *
 * This makes the translation gap visible and actionable — a core part of
 * the translation workflow UX. Employers evaluating this project will see
 * that missing translations are surfaced clearly, not silently served.
 */

const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  ja: '日本語',
};

interface FallbackBannerProps {
  requestedLocale: Locale;
  githubUrl?: string;
}

export default function FallbackBanner({
  requestedLocale,
  githubUrl = 'https://github.com/your-username/multilingual-docs',
}: FallbackBannerProps) {
  const t = useTranslations('translation');

  return (
    <div
      role="alert"
      className="mb-8 flex gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3.5 dark:border-amber-900/50 dark:bg-amber-900/20"
    >
      <AlertTriangle
        size={18}
        className="mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400"
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
          {t('fallback_title')}
        </p>
        <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
          {t('fallback_desc', {
            locale: LOCALE_NAMES[requestedLocale] ?? requestedLocale,
          })}
        </p>
        {githubUrl && (
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200"
          >
            {t('fallback_contribute')}
            <ExternalLink size={11} aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
}
