import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
  localeDetection: true,
  // Klucz = sciezka wewnetrzna (zgodna z katalogiem w app/), wartosc = adres
  // publiczny per locale. Angielskie slugi to warunek rankowania /en na frazy
  // angielskie - "/en/kalkulator" nie niesie zadnego sygnalu dla EN.
  // Zmiana adresu wymaga 301 ze starego - patrz redirects() w next.config.ts.
  pathnames: {
    '/': '/',
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
    '/blog/kategoria/[slug]': {
      pl: '/blog/kategoria/[slug]',
      en: '/blog/category/[slug]',
    },
    '/start': '/start',
    '/kalkulator': { pl: '/kalkulator', en: '/calculator' },
    '/o-nas': { pl: '/o-nas', en: '/about' },
    '/kontakt': { pl: '/kontakt', en: '/contact' },
    '/autor/[slug]': { pl: '/autor/[slug]', en: '/author/[slug]' },
    '/polityka-prywatnosci': { pl: '/polityka-prywatnosci', en: '/privacy-policy' },
    '/regulamin': { pl: '/regulamin', en: '/terms' },
  },
});

export type Locale = (typeof routing.locales)[number];
