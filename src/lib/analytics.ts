type EventParams = Record<string, string | number | boolean>;

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
  w.dataLayer = w.dataLayer || [];
  // gtag.js rozpoznaje komendy wylacznie jako obiekt `arguments` (nie tablice,
  // nie zwykly obiekt) - stad klasyczna funkcja zamiast arrow
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- parametry sa czytane przez `arguments`
  function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  }
  gtag('event', name, params);
  w.dataLayer.push({ event: name, ...params });
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

export function trackShareClick(postSlug: string, locale: string) {
  pushEvent('share_click', { post_slug: postSlug, locale });
}

export function trackEmailCopy(page: string, locale: string) {
  pushEvent('email_copy', { page, locale });
}

export function trackSectionView(section: string, locale: string) {
  pushEvent('section_view', { section, locale });
}
