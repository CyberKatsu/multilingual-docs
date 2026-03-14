/**
 * Locale-aware navigation primitives from next-intl.
 *
 * Import these instead of the standard next/navigation equivalents.
 * They automatically prepend the current locale to all paths.
 *
 * Usage:
 *   import { Link, useRouter, usePathname, redirect } from '@/i18n/navigation';
 */
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
