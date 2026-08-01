import { sendGAEvent } from '@next/third-parties/google';

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
  sendGAEvent('event', 'cta_click', {
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
  sendGAEvent('event', 'app_open', {
    platform,
    plan: plan ?? 'free',
    locale,
  });
}

export function trackLanguageSwitch(fromLocale: string, toLocale: string) {
  sendGAEvent('event', 'language_switch', {
    from_locale: fromLocale,
    to_locale: toLocale,
  });
}

export function trackBlogPostRead(slug: string, locale: string) {
  sendGAEvent('event', 'blog_post_read', {
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
  sendGAEvent('event', 'calculator_used', { locale, placement });
}
