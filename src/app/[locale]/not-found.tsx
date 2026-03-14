import { Link } from '@/i18n/navigation';
import { FileQuestion } from 'lucide-react';

/**
 * 404 page — rendered when a doc slug doesn't match any content file.
 * Uses the locale-aware Link so the "back" link is also locale-prefixed.
 */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
      <FileQuestion
        size={48}
        className="mb-6 text-zinc-300 dark:text-zinc-600"
        aria-hidden="true"
      />
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        Page not found
      </h1>
      <p className="mt-3 text-zinc-500 dark:text-zinc-400">
        The page you&apos;re looking for doesn&apos;t exist or hasn&apos;t been
        created in this language yet.
      </p>
      <Link
        href="/docs/getting-started"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700"
      >
        Go to documentation
      </Link>
    </div>
  );
}
