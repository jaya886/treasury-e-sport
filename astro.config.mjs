// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://jaya886.github.io',
  base: '/treasury-e-sport',
  trailingSlash: 'ignore',
  i18n: {
    // Bahasa Indonesia is the only locale for now. Add 'en' here (and in src/i18n) to localize later.
    locales: ['id'],
    defaultLocale: 'id',
    routing: { prefixDefaultLocale: false },
  },
});
