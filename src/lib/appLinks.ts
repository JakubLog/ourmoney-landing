// Jedyne zrodlo prawdy dla linkow do aplikacji.
// Landing nigdy nie linkuje bezposrednio do app.ourmoney.pl - wszystkie CTA
// prowadza do dynamicznej strony przejscia /[locale]/start, ktora dopiero
// tam rozpoznaje urzadzenie i przekierowuje na wlasciwy target.

export type AppPlatform = 'ios' | 'android' | 'web';
export type AppPlan = 'premium';

/**
 * Docelowe adresy per platforma.
 * Android i iOS czekaja na publikacje w store - do tego czasu obie platformy
 * trafiaja na PWA. Gdy store'y ruszą, podmien wartosci na deep-linki
 * (np. `ourmoney://start` z fallbackiem) lub adresy App Store / Google Play.
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

/** Adres docelowy aplikacji z przeniesionym locale i wybranym planem. */
export function buildAppUrl(
  platform: AppPlatform,
  locale: string,
  plan?: AppPlan | null,
): string {
  const url = new URL(APP_TARGETS[platform]);
  if (locale !== 'pl') url.searchParams.set('locale', locale);
  if (plan) url.searchParams.set('plan', plan);
  return url.toString();
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
