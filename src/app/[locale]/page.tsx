import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getLocaleCompletionPercent } from '@/lib/manifest';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { Globe, Zap, GitBranch, ArrowRight } from 'lucide-react';

interface Props {
  params: Promise<{ locale: Locale }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('home');

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Hero */}
      <section className="py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-300 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
          </span>
          {routing.locales.length} languages supported
        </div>

        <h1 className="mx-auto max-w-2xl text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl whitespace-pre-line">
          {t('hero_title')}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {t('hero_subtitle')}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/docs/getting-started"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          >
            {t('cta_start')}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <Link
            href="/status"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {t('cta_architecture')}
          </Link>
        </div>
      </section>

      {/* Feature grid */}
      <section className="pb-20 grid gap-6 sm:grid-cols-3">
        {[
          {
            icon: Globe,
            title: t('feature_routing_title'),
            desc: t('feature_routing_desc'),
          },
          {
            icon: Zap,
            title: t('feature_fallback_title'),
            desc: t('feature_fallback_desc'),
          },
          {
            icon: GitBranch,
            title: t('feature_workflow_title'),
            desc: t('feature_workflow_desc'),
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-xl border border-zinc-200 bg-zinc-50/60 px-6 py-5 dark:border-zinc-800 dark:bg-zinc-900/40"
          >
            <Icon
              size={20}
              className="mb-3 text-brand-600 dark:text-brand-400"
              aria-hidden="true"
            />
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              {title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {desc}
            </p>
          </div>
        ))}
      </section>

      {/* Language coverage strip */}
      <section className="border-t border-zinc-200 py-12 dark:border-zinc-800">
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          Translation coverage
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {routing.locales.map((l) => {
            const pct = getLocaleCompletionPercent(l as Locale);
            return (
              <div key={l} className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {pct}%
                </span>
                <span className="text-xs uppercase tracking-wider text-zinc-400">
                  {l}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
