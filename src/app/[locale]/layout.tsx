import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import SiteHeader from '@/components/SiteHeader';
import '../globals.css';

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

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate locale — renders the nearest not-found.tsx for unknown values
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  /**
   * setRequestLocale must be called before any i18n function (getTranslations,
   * useTranslations, etc.) runs in this layout or any child server component.
   * It establishes the locale for the entire React tree below this point.
   *
   * Required in next-intl v4 for static rendering (SSG). Without it, next-intl
   * cannot determine the locale during generateStaticParams pre-rendering.
   */
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        {/*
          next-intl v4: NextIntlClientProvider inherits locale and messages
          automatically from the server request config — no props needed.
        */}
        <NextIntlClientProvider>
          <SiteHeader />
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
