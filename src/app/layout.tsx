/**
 * Root layout — the only place <html> and <body> should be rendered.
 *
 * Next.js App Router nests layouts inside each other's `children` slot, so
 * having <html><body> in both this file and [locale]/layout.tsx produces
 * nested html tags and a React hydration mismatch.
 */
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import SiteHeader from '@/components/SiteHeader';
import { routing } from '@/i18n/routing';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://multilingual-docs.vercel.app'),
  alternates: {
    languages: {
      // x-default points to the default locale — used by search engines when
      // no language-specific version matches the user's preference.
      'x-default': '/en',
      ...Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <NextIntlClientProvider>
          <SiteHeader />
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
