import { redirect } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: Locale }>;
}

/**
 * /[locale]/docs → redirect to the first doc.
 *
 * Without this, navigating to /en/docs returns a 404 because there is no
 * page.tsx at [locale]/docs/ — only at [locale]/docs/[slug]/.
 * This redirect is instant (server-side, no client JS needed).
 */
export default async function DocsIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  redirect(`/${locale}/docs/getting-started`);
}
