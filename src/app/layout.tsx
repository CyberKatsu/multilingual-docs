/**
 * Root layout — required by Next.js 15 App Router.
 *
 * The real layout (with <html lang={locale}> and NextIntlClientProvider) lives in
 * src/app/[locale]/layout.tsx. This root layout is only reached for the bare `/`
 * path, which the next-intl middleware redirects before the page renders —
 * so this component never actually runs in practice.
 *
 * suppressHydrationWarning prevents a mismatch warning caused by the
 * ThemeToggle script patching the <html> class before hydration.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
