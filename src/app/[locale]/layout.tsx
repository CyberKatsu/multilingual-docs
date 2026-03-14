import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'site' });
  return {
    title: {
      template: `%s — ${t('name')}`,
      default: t('name'),
    },
    description: t('tagline'),
    metadataBase: new URL('https://multilingual-docs.vercel.app'),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `/${l}`])
      ),
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Locale layout — validates the locale param and establishes the next-intl
 * request context for all child server components via setRequestLocale().
 *
 * Does NOT render <html> or <body> — those live in app/layout.tsx (the root
 * layout), which is the only layout that should ever render those tags in the
 * Next.js App Router. Rendering them here too would produce nested <html><body>
 * tags and a React hydration mismatch.
 */
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  return <>{children}</>;
}
