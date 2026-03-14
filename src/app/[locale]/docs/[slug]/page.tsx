import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getDocContent, getAllStaticParams } from '@/lib/content';
import DocNav from '@/components/DocNav';
import FallbackBanner from '@/components/FallbackBanner';
import TranslationStatusBadge from '@/components/TranslationStatusBadge';
import type { Locale } from '@/i18n/routing';
import { Calendar, Clock } from 'lucide-react';

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

export async function generateStaticParams() {
  return getAllStaticParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const doc = await getDocContent(locale, `docs/${slug}`);
  if (!doc) return {};
  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    alternates: {
      languages: {
        en: `/en/docs/${slug}`,
        fr: `/fr/docs/${slug}`,
        es: `/es/docs/${slug}`,
      },
    },
  };
}

export default async function DocPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const doc = await getDocContent(locale, `docs/${slug}`);
  if (!doc) notFound();

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-10 sm:px-6">
      {/* Sidebar */}
      <aside className="hidden lg:block">
        <DocNav locale={locale} currentSlug={slug} />
      </aside>

      {/* Main content */}
      <article className="min-w-0 flex-1">
        {/* Fallback banner */}
        {doc.isFallback && (
          <FallbackBanner requestedLocale={locale} />
        )}

        {/* Doc header */}
        <header className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <TranslationStatusBadge
              status={doc.frontmatter.translationStatus}
              showLabel
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {doc.frontmatter.title}
          </h1>
          <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400">
            {doc.frontmatter.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
            {doc.frontmatter.lastUpdated && (
              <span className="flex items-center gap-1">
                <Calendar size={12} aria-hidden="true" />
                {doc.frontmatter.lastUpdated}
              </span>
            )}
            {doc.frontmatter.readingTime && (
              <span className="flex items-center gap-1">
                <Clock size={12} aria-hidden="true" />
                {doc.frontmatter.readingTime} min read
              </span>
            )}
            {doc.frontmatter.translator && (
              <span className="text-zinc-400">
                Translated by {doc.frontmatter.translator}
              </span>
            )}
          </div>
        </header>

        {/* MDX content — dark-mode prose colours set via globals.css @layer components */}
        <div className="prose prose-zinc max-w-none prose-headings:font-semibold prose-a:text-brand-600 prose-code:text-brand-700 dark:prose-a:text-brand-400 dark:prose-code:text-brand-300">
          <MDXRemote source={doc.content} />
        </div>
      </article>
    </div>
  );
}
