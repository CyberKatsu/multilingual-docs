import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

/**
 * next-intl middleware handles:
 *   - Detecting the user's preferred locale from Accept-Language header
 *   - Redirecting to the correct locale-prefixed URL
 *   - Setting the NEXT_LOCALE cookie so the preference persists
 *
 * The matcher intentionally excludes Next.js internals (_next/),
 * API routes, and static files (favicon, images, fonts).
 */
export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except internals and files
    '/((?!_next|_vercel|api|.*\\..*).*)',
  ],
};
