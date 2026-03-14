import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getLocaleCompletionPercent } from '@/lib/manifest';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/routing';
import { Globe, Zap, GitBranch, ArrowRight, CheckCircle } from 'lucide-react';

interface Props {
  params: Promise<{ locale: Locale }>;
}

const LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  ja: '日本語',
};

const LOCALE_FLAG: Record<string, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  es: '🇪🇸',
  ja: '🇯🇵',
};

// URL demo rows — shows the routing story visually
const URL_DEMO_SLUG = 'getting-started';
const URL_DEMO_TRANSLATIONS: Record<string, string> = {
  en: 'getting-started',
  fr: 'getting-started',
  es: 'getting-started',
  ja: 'getting-started',
};

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
          {routing.locales.length} languages · fully open source
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

      {/* Live URL routing demo */}
      <section className="mb-16">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
          Locale-prefixed routing in action
        </p>
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50 overflow-hidden">
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-amber-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-2 text-xs text-zinc-400 font-mono">browser</span>
          </div>
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {routing.locales.map((l) => {
              const slug = URL_DEMO_TRANSLATIONS[l] ?? URL_DEMO_SLUG;
              const path = `/${l}/docs/${slug}`;
              const isActive = l === locale;
              return (
                <li key={l}>
                  <Link
                    href={`/docs/${slug}`}
                    locale={l as Locale}
                    className={[
                      'flex items-center gap-3 px-4 py-3 text-sm font-mono transition-colors',
                      isActive
                        ? 'bg-brand-50 dark:bg-brand-900/20'
                        : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60',
                    ].join(' ')}
                  >
                    <span className="text-base">{LOCALE_FLAG[l]}</span>
                    <span className={isActive ? 'text-brand-600 dark:text-brand-400 font-medium' : 'text-zinc-500 dark:text-zinc-400'}>
                      {path}
                    </span>
                    <span className="ml-auto text-xs text-zinc-400">{LOCALE_LABELS[l]}</span>
                    {isActive && (
                      <span className="flex items-center gap-1 rounded-full bg-brand-100 px-2 py-0.5 text-xs font-sans font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                        <CheckCircle size={10} aria-hidden="true" />
                        current
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Feature grid */}
      <section className="pb-16 grid gap-6 sm:grid-cols-3">
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
            <Icon size={20} className="mb-3 text-brand-600 dark:text-brand-400" aria-hidden="true" />
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{title}</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* Tech stack badges */}
      <section className="border-t border-zinc-200 py-10 dark:border-zinc-800">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">
          Built with
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { label: 'Next.js 15', href: 'https://nextjs.org' },
            { label: 'next-intl 4', href: 'https://next-intl.dev' },
            { label: 'Tailwind CSS 4', href: 'https://tailwindcss.com' },
            { label: 'MDX', href: 'https://mdxjs.com' },
            { label: 'TypeScript', href: 'https://www.typescriptlang.org' },
            { label: 'Vercel', href: 'https://vercel.com' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200"
            >
              {label}
            </a>
          ))}
        </div>
      </section>

      {/* Language coverage strip */}
      <section className="border-t border-zinc-200 py-12 dark:border-zinc-800">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6">
          Translation coverage
        </p>
        <div className="flex flex-wrap justify-center gap-8">
          {routing.locales.map((l) => {
            const pct = getLocaleCompletionPercent(l as Locale);
            return (
              <Link key={l} href="/status" className="flex flex-col items-center gap-1.5 group">
                <span className="text-3xl font-bold text-zinc-900 group-hover:text-brand-600 dark:text-zinc-100 dark:group-hover:text-brand-400 transition-colors">
                  {pct}%
                </span>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <span>{LOCALE_FLAG[l]}</span>
                  <span className="uppercase tracking-wider">{l}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

    </div>
  );
}
