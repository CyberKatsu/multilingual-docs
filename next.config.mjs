import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const config = {
  /**
   * next-mdx-remote v6 ships as ESM only.
   * transpilePackages tells Next.js to compile it through its own bundler
   * rather than treating it as a pre-compiled CJS module.
   */
  transpilePackages: ['next-mdx-remote'],
};

export default withNextIntl(config);
