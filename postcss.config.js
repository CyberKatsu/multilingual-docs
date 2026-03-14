/**
 * Tailwind CSS v4: the PostCSS plugin is now @tailwindcss/postcss (not tailwindcss).
 * autoprefixer is no longer required — Tailwind v4 handles vendor prefixes internally.
 */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
