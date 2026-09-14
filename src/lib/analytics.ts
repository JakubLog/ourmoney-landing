type EventParams = Record<string, string | number | boolean>;

// Komenda gtag: gtag.js rozpoznaje komendy wylacznie jako obiekt `arguments`
// (nie tablice, nie zwykly obiekt) - stad klasyczna funkcja zamiast arrow.
// To jedyny poprawny kanal do GA4 przy recznie ladowanym gtag.js.
export function gtagCommand(...args: unknown[]): void {
  if (typeof window === 'undefined') return;
  const w = window as Window & { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- parametry sa czytane przez `arguments`
  function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  }
  gtag(...args);
}

// Kazdy event idzie dwoma kanalami:
// 1. komenda gtag (push obiektu `arguments`) - trafia bezposrednio do GA4;
//    nie uzywamy sendGAEvent z @next/third-parties, bo dziala tylko z ich
//    komponentem <GoogleAnalytics>, a my ladujemy gtag.js recznie w layout.tsx
// 2. dataLayer.push({event}) - obiektowy push, na ktory reaguja triggery GTM
//    (Meta Pixel, Ads). gtag-owych komend GTM nie widzi, stad dwa pushe.
// W kontenerze GTM NIE podpinac tagow GA4 pod te eventy - podwojne liczenie.
function pushEvent(name: string, params: EventParams) {
  if (typeof window === 'undefined') return;
  const w = window as Window & { dataLayer?: unknown[] };
  gtagCommand('event', name, params);
  w.dataLayer!.push({ event: name, ...params });
}

// Core Web Vitals -> GA4. Tylko komenda gtag, bez obiektowego pushu: te eventy
// nie maja triggerow w GTM, a leca kilka razy na odslone.
export function trackWebVital(params: EventParams & { name: string }) {
  const { name, ...rest } = params;
  gtagCommand('event', name, rest);
}

// Wlasciwosc uzytkownika `locale` - komenda `set`, nie event.
export function setLocaleUserProperty(locale: string) {
  gtagCommand('set', 'user_properties', { locale });
}

export function trackCTAClick({
  location,
  text,
  locale,
  postSlug,
}: {
  location: string;
  text: string;
  locale: string;
  postSlug?: string;
}) {
  pushEvent('cta_click', {
    cta_location: location,
    cta_text: text,
    locale,
    ...(postSlug && { post_slug: postSlug }),
  });
}

// Strona przejscia /start - moment faktycznego wyjscia z landingu do aplikacji
export function trackAppOpen({
  platform,
  plan,
  locale,
}: {
  platform: 'ios' | 'android' | 'web';
  plan: 'premium' | null;
  locale: string;
}) {
  pushEvent('app_open', {
    platform,
    plan: plan ?? 'free',
    locale,
  });
}

export function trackLanguageSwitch(fromLocale: string, toLocale: string) {
  pushEvent('language_switch', {
    from_locale: fromLocale,
    to_locale: toLocale,
  });
}

export function trackBlogPostRead(slug: string, locale: string) {
  pushEvent('blog_post_read', {
    post_slug: slug,
    locale,
  });
}

// Kalkulator podzialu - raz na sesje, zeby nie zalewac GA4 przy kazdym wpisanym znaku
export function trackCalculatorUsed(locale: string, placement: string) {
  if (typeof window === 'undefined') return;
  const key = 'om_calculator_used';
  try {
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, '1');
  } catch {
    // sessionStorage niedostepny (tryb prywatny) - wysylamy event mimo to
  }
  pushEvent('calculator_used', { locale, placement });
}

export function trackCalculatorModeChange(mode: string, placement: string, locale: string) {
  pushEvent('calculator_mode_change', { mode, placement, locale });
}

export function trackContactFormSubmit(status: 'success' | 'error', locale: string) {
  pushEvent('contact_form_submit', { form_status: status, locale });
}

export function trackCookieConsent(choice: 'granted' | 'denied', locale: string) {
  pushEvent('cookie_consent', { choice, locale });
}

export function trackFaqOpen(question: string, locale: string) {
  pushEvent('faq_open', { question, locale });
}

// Stepper "Jak to dziala" - raportujemy WYLACZNIE reczny wybor kroku. Auto-przejscia
// nie sa interakcja, a event po kazdym cyklu zalalby GA4 (12 zdarzen na minute widoku).
export function trackStepSelect(section: string, step: number, locale: string) {
  pushEvent('step_select', { section, step_index: step, locale });
}

export function trackShareClick(postSlug: string, locale: string) {
  pushEvent('share_click', { post_slug: postSlug, locale });
}

export function trackEmailCopy(page: string, locale: string) {
  pushEvent('email_copy', { page, locale });
}

export function trackSectionView(section: string, locale: string) {
  pushEvent('section_view', { section, locale });
}

// ---------------------------------------------------------------------------
// Zgoda na cookies - wspolne zrodlo prawdy dla banera i skryptow marketingowych
// ---------------------------------------------------------------------------

export const CONSENT_KEY = 'ourmoney_cookie_consent';
export const CONSENT_EVENT = 'ourmoney:consent-change';

export type ConsentStatus = 'granted' | 'denied';

// 'unknown' tylko na serwerze - konsumenci montuja sie dopiero po hydracji,
// zeby nie migac uzytkownikom, ktorzy juz podjeli decyzje
export type StoredConsent = ConsentStatus | 'unknown' | null;

export function subscribeToConsent(onChange: () => void) {
  // storage: decyzja w innej karcie; custom event: decyzja w tej karcie
  window.addEventListener('storage', onChange);
  window.addEventListener(CONSENT_EVENT, onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener(CONSENT_EVENT, onChange);
  };
}

export function getConsentSnapshot(): StoredConsent {
  try {
    return localStorage.getItem(CONSENT_KEY) as ConsentStatus | null;
  } catch {
    // localStorage zablokowany (tryb prywatny / polityka ciasteczek)
    return null;
  }
}

export function getConsentServerSnapshot(): StoredConsent {
  return 'unknown';
}
