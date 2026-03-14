import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { getDocNavItems } from '@/lib/content';
import TranslationStatusBadge from './TranslationStatusBadge';
import type { Locale } from '@/i18n/routing';

/**
 * DocNav
 *
 * Sidebar navigation for the docs section. Each item shows:
 *   - The page title (in the current locale if available, else English)
 *   - A translation status badge (hidden for English locale — no status needed)
 *
 * This is a server component — it reads the filesystem at build time
 * via getDocNavItems(), which is fully SSG-compatible.
 */

interface Props {
  locale: Locale;
  currentSlug: string;
}

export default function DocNav({ locale, currentSlug }: Props) {
  const t = useTranslations('docs');
  const items = getDocNavItems(locale);

  return (
    <nav aria-label="Documentation navigation" className="w-60 flex-shrink-0">
      <ul className="space-y-0.5">
        {items.map((item) => {
          const isActive = item.slug === currentSlug;
          return (
            <li key={item.slug}>
              <Link
                href={`/docs/${item.slug}`}
                className={[
                  'flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-brand-50 font-medium text-brand-700 dark:bg-brand-900/20 dark:text-brand-300'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100',
                ].join(' ')}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="truncate">{item.title}</span>
                {locale !== 'en' && (
                  <TranslationStatusBadge
                    status={item.translationStatus}
                    showLabel={false}
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
