/**
 * Root page — explicit redirect fallback.
 *
 * The next-intl middleware handles the / → /en redirect in production and
 * most dev scenarios. This component is a belt-and-suspenders fallback for
 * cases where middleware hasn't fired (e.g. cold starts in dev, certain
 * edge-cache misses, or direct file-system serving without the middleware layer).
 *
 * redirect() is a Next.js 15 server-side redirect — it never reaches the client.
 */
import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/routing';

export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
