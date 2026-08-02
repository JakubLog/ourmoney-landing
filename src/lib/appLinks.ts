// Jedyne zrodlo prawdy dla linkow do aplikacji.
// Landing nigdy nie linkuje bezposrednio do app.ourmoney.pl - wszystkie CTA
// prowadza do dynamicznej strony przejscia /[locale]/start, ktora dopiero
// tam rozpoznaje urzadzenie i przekierowuje na wlasciwy target.

export type AppPlatform = 'ios' | 'android' | 'web';
export type AppPlan = 'premium';
export type AppLocale = 'pl' | 'en';

/** Origin aplikacji - jedyna domena, do ktorej doklejamy `?locale=`. */
export const APP_ORIGIN = 'https://app.ourmoney.pl';

/**
 * Docelowe adresy per platforma.
 * Android i iOS czekaja na publikacje w store - do tego czasu obie platformy
 * trafiaja na PWA. Gdy store'y ruszą, podmien wartosci na deep-linki
 * (np. `ourmoney://start` z fallbackiem) lub adresy App Store / Google Play.
 *
 * UWAGA: linki do App Store / Google Play NIE przyjmuja `?locale=` - aplikacja
 * natywna bierze jezyk z systemu. `withAppLocale` pomija je automatycznie,
 * bo sprawdza origin.
 */
export const APP_TARGETS: Record<AppPlatform, string> = {
  web: 'https://app.ourmoney.pl/',
  ios: 'https://app.ourmoney.pl/',
  android: 'https://app.ourmoney.pl/',
};

/** Flagi store'ow - steruja komunikatem "juz wkrotce" na stronie przejscia. */
export const STORE_AVAILABLE: Record<Exclude<AppPlatform, 'web'>, boolean> = {
  ios: false,
  android: false,
};

/** Detekcja po User-Agent - dziala tak samo po stronie serwera i klienta. */
export function detectPlatform(userAgent: string): AppPlatform {
  const ua = userAgent.toLowerCase();
  if (ua.includes('android')) return 'android';
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  return 'web';
}

/**
 * Detekcja w przegladarce - dokladniejsza niz sam UA, bo iPadOS 13+ podaje sie
 * za Maca i rozpoznajemy go dopiero po liczbie punktow dotyku.
 */
export function detectPlatformClient(): AppPlatform {
  if (typeof navigator === 'undefined') return 'web';
  const ua = navigator.userAgent;
  const platform = detectPlatform(ua);
  if (platform !== 'web') return platform;
  if (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return 'ios';
  return 'web';
}

/**
 * Aplikacja obsluguje wylacznie `pl` i `en` (lowercase) - wszystko inne
 * traktuje jak `pl`. Normalizujemy po naszej stronie, zeby nigdy nie wyslac
 * `pl-PL`, `en-US` ani `PL`.
 */
export function normalizeAppLocale(locale: string): AppLocale {
  // Tniemy ewentualny region ('en-US' -> 'en'), reszta leci na domyslne 'pl'
  return locale.toLowerCase().split('-')[0] === 'en' ? 'en' : 'pl';
}

/** Czy URL prowadzi do aplikacji? Adresy wzgledne i obce domeny -> false. */
export function isAppUrl(url: string): boolean {
  try {
    return new URL(url).origin === APP_ORIGIN;
  } catch {
    return false;
  }
}

/**
 * Dokleja `?locale=` do linku na domene aplikacji. Jezyk bierzemy z aktualnego
 * locale landingu, nie z `navigator.language`.
 *
 * - dziala tylko na URL-ach z origin aplikacji (obce domeny wraca bez zmian),
 * - dokleja przez `URLSearchParams`, wiec istniejace utm/ref przezywaja,
 * - parametr laduje w query, przed `#` - hash zostaje nietkniety (aplikacja
 *   trzyma tam tokeny auth).
 */
export function withAppLocale(url: string, locale: string): string {
  if (!isAppUrl(url)) return url;
  const parsed = new URL(url);
  parsed.searchParams.set('locale', normalizeAppLocale(locale));
  return parsed.toString();
}

/**
 * Parametry kampanii, ktore maja przezyc przejscie przez `/start`.
 * Redirect gubiacy atrybucje to taki sam bug jak redirect gubiacy `locale`.
 */
const FORWARDED_PARAMS = ['ref', 'gclid', 'fbclid', 'msclkid'];
const FORWARDED_PREFIXES = ['utm_'];

/** Wyciaga z query strony `/start` parametry do przeniesienia na aplikacje. */
export function pickForwardedParams(
  query: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const forwarded: Record<string, string> = {};

  for (const [key, value] of Object.entries(query)) {
    const raw = Array.isArray(value) ? value[0] : value;
    if (!raw) continue;

    const normalized = key.toLowerCase();
    // `plan` i `locale` maja wlasna sciezke - nie duplikujemy ich tutaj
    if (normalized === 'plan' || normalized === 'locale') continue;

    if (
      FORWARDED_PARAMS.includes(normalized) ||
      FORWARDED_PREFIXES.some((prefix) => normalized.startsWith(prefix))
    ) {
      forwarded[key] = raw;
    }
  }

  return forwarded;
}

/** Adres docelowy aplikacji z przeniesionym locale, planem i atrybucja. */
export function buildAppUrl(
  platform: AppPlatform,
  locale: string,
  plan?: AppPlan | null,
  forwarded?: Record<string, string>,
): string {
  const url = new URL(APP_TARGETS[platform]);

  // Najpierw atrybucja, potem nasze parametry - kolejnosc doklejania, nie nadpisywania
  for (const [key, value] of Object.entries(forwarded ?? {})) {
    url.searchParams.set(key, value);
  }
  if (plan) url.searchParams.set('plan', plan);

  return withAppLocale(url.toString(), locale);
}

/**
 * Link do strony przejscia. `plan` podajemy WYLACZNIE przy CTA planu platnego -
 * przy wersji darmowej parametru po prostu nie ma.
 */
export function startHref(locale: string, plan?: AppPlan): string {
  return `/${locale}/start${plan ? `?plan=${plan}` : ''}`;
}

/** Walidacja `?plan=` z URL - nieznane wartosci traktujemy jak brak planu. */
export function parsePlan(value: string | string[] | undefined): AppPlan | null {
  return value === 'premium' ? 'premium' : null;
}
