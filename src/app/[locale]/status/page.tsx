import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getCoverageMatrix, getLocaleCompletionPercent, STATUS_CONFIG } from '@/lib/manifest';
import { routing, type Locale } from '@/i18n/routing';
import TranslationStatusBadge from '@/components/TranslationStatusBadge';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Translation Status',
  description: 'Live view of documentation translation coverage across all supported languages.',
};

interface Props {
  params: Promise<{ locale: Locale }>;
}

const LOCALE_NAMES: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  ja: '日本語',
};

export default async function StatusPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('statusPage');
  const matrix = getCoverageMatrix();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t('title')}
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t('subtitle')}</p>
      </div>

      {/* Per-locale completion cards */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {routing.locales.map((l) => {
          const pct = getLocaleCompletionPercent(l as Locale);
          return (
            <div
              key={l}
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    {LOCALE_NAMES[l]}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    {pct}%
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">complete</p>
                </div>
                {/* Progress ring (CSS-only) */}
                <div
                  className="h-12 w-12 rounded-full"
                  style={{
                    background: `conic-gradient(rgb(99 102 241) ${pct}%, rgb(228 228 231) ${pct}%)`,
                  }}
                  aria-hidden="true"
                />
              </div>
              {/* Progress bar */}
              <div className="mt-4 h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div
                  className="h-1.5 rounded-full bg-brand-500 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-3">
        {(Object.entries(STATUS_CONFIG) as [string, typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(
          ([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <span className={['h-2 w-2 rounded-full', cfg.dotClass].join(' ')} aria-hidden="true" />
              {cfg.label}
            </div>
          )
        )}
      </div>

      {/* Coverage matrix */}
      <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60">
              <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
                Page
              </th>
              {routing.locales.map((l) => (
                <th
                  key={l}
                  className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400"
                >
                  {LOCALE_NAMES[l]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map(({ docKey, statuses }, idx) => (
              <tr
                key={docKey}
                className={[
                  'border-b border-zinc-100 dark:border-zinc-800/60',
                  idx % 2 === 0
                    ? 'bg-white dark:bg-transparent'
                    : 'bg-zinc-50/40 dark:bg-zinc-900/20',
                ].join(' ')}
              >
                <td className="px-4 py-3 font-mono text-xs text-zinc-600 dark:text-zinc-300">
                  {docKey}
                </td>
                {routing.locales.map((l) => {
                  const entry = statuses[l as Locale];
                  return (
                    <td key={l} className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <TranslationStatusBadge
                          status={entry?.status ?? 'missing'}
                          showLabel
                        />
                        {entry?.lastUpdated && (
                          <span className="text-xs text-zinc-400 dark:text-zinc-500">
                            {entry.lastUpdated}
                          </span>
                        )}
                        {entry?.translator && (
                          <span className="text-xs text-zinc-400 dark:text-zinc-500">
                            {entry.translator}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Architecture note */}
      <div className="mt-10 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/40">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          How this works
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          This dashboard reads from <code className="font-mono text-xs">translation-manifest.json</code> — a
          flat JSON file that maps every doc path to a per-locale status object. It is updated manually
          (or via CI) when translations change, and is consumed at build time so the status page is
          fully static with zero runtime queries. The same manifest powers the status badges in the
          sidebar DocNav.
        </p>
      </div>
    </div>
  );
}
