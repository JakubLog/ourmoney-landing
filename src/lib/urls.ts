import { getPathname } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

export const SITE_URL = 'https://ourmoney.pl';

type Href = Parameters<typeof getPathname>[0]['href'];

function toLocale(locale: string): Locale {
  return routing.locales.includes(locale as Locale)
    ? (locale as Locale)
    : routing.defaultLocale;
}

/**
 * Absolutny adres publiczny dla sciezki wewnetrznej. Jedyne miejsce, ktore wie
 * jak locale przeklada sie na slug - dzieki temu zmiana mapy w routing.ts
 * przenosi sie od razu na canonical, hreflang, JSON-LD i sitemape.
 */
export function absoluteUrl(href: Href, locale: string): string {
  return `${SITE_URL}${getPathname({ href, locale: toLocale(locale) })}`;
}

/** Adres dynamicznego obrazka OG (1200x630) dla podanego tytulu i lidu. */
export function ogImageUrl(title: string, subtitle?: string): string {
  const params = new URLSearchParams({ title });
  if (subtitle) params.set('subtitle', subtitle);
  return `${SITE_URL}/og?${params.toString()}`;
}

/** canonical + hreflang (z x-default) dla danej sciezki wewnetrznej. */
export function alternatesFor(href: Href, locale: string) {
  return {
    canonical: absoluteUrl(href, locale),
    languages: {
      pl: absoluteUrl(href, 'pl'),
      en: absoluteUrl(href, 'en'),
      'x-default': absoluteUrl(href, routing.defaultLocale),
    },
  };
}
