/**
 * Root layout — the only place <html> and <body> should be rendered.
 *
 * Next.js App Router nests layouts inside each other's `children` slot, so
 * having <html><body> in both this file and [locale]/layout.tsx produces
 * nested html tags and a React hydration mismatch.
 *
 * getLocale() reads the locale the next-intl middleware already wrote into
 * the request context, so we get the correct `lang` attribute here without
 * needing to pass it down from the [locale] segment.
 */
import { NextIntlClientProvider } from 'next-intl';
import { getLocale } from 'next-intl/server';
import SiteHeader from '@/components/SiteHeader';
import './globals.css';

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
