import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { BookOpen, Github } from 'lucide-react';

/**
 * SiteHeader
 *
 * Top navigation bar. Server component that renders the locale-aware Link
 * items and embeds the LanguageSwitcher (client component) and ThemeToggle.
 */

export default function SiteHeader() {
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100"
          aria-label={`${t('site.name')} — home`}
        >
          <BookOpen size={18} className="text-brand-600" aria-hidden="true" />
          <span>{t('site.name')}</span>
        </Link>

        {/* Centre nav */}
        <nav
          className="hidden items-center gap-1 sm:flex"
          aria-label="Primary navigation"
        >
          {[
            { href: '/docs/getting-started', label: t('nav.docs') },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/status"
            className="rounded-md px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            i18n status
          </Link>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <a
            href="https://github.com/your-username/multilingual-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 sm:block"
            aria-label={t('nav.github')}
          >
            <Github size={18} aria-hidden="true" />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
