'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  CONSENT_EVENT,
  CONSENT_KEY,
  getConsentServerSnapshot,
  getConsentSnapshot,
  subscribeToConsent,
  trackCookieConsent,
  type ConsentStatus,
} from '@/lib/analytics';

function applyConsent(status: ConsentStatus) {
  if (typeof window === 'undefined') return;
  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  };
  // Google Consent Mode v2
  w.gtag?.('consent', 'update', {
    analytics_storage: status,
    ad_storage: status,
    ad_user_data: status,
    ad_personalization: status,
  });
  // Meta Pixel consent
  w.fbq?.('consent', status === 'granted' ? 'grant' : 'revoke');
}

type Props = {
  message: string;
  acceptLabel: string;
  rejectLabel: string;
  learnMoreLabel: string;
};

export function CookieConsentBanner({ message, acceptLabel, rejectLabel, learnMoreLabel }: Props) {
  const locale = useLocale();
  const consent = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getConsentServerSnapshot,
  );

  // Zapisana zgoda musi wrocic do gtag/fbq przy kazdym wejsciu na strone
  // (idempotentne - powtorka po decyzji w handlerze jest nieszkodliwa)
  useEffect(() => {
    if (consent === 'granted' || consent === 'denied') applyConsent(consent);
  }, [consent]);

  const handleDecision = (status: ConsentStatus) => {
    localStorage.setItem(CONSENT_KEY, status);
    applyConsent(status);
    // Event PO update zgody - z analytics_storage=granted trafia do GA4 z cookies;
    // przy denied GA4 wysle cookieless ping (Consent Mode) - i tak zliczymy proporcje
    trackCookieConsent(status, locale);
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 sm:px-4 sm:pb-4"
    >
      <div className="glass-sheet rounded-panel max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <p className="text-sm text-white/90 leading-relaxed">
          {message}{' '}
          <Link
            href="/polityka-prywatnosci"
            className="text-white/80 hover:text-white underline underline-offset-2 transition-colors"
          >
            {learnMoreLabel}
          </Link>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleDecision('denied')}
            className="text-xs text-white/80 hover:text-white transition-colors"
          >
            {rejectLabel}
          </button>
          <button
            onClick={() => handleDecision('granted')}
            className="bg-accent text-black text-xs font-semibold px-6 py-2 rounded-full hover:bg-accent-dark transition-colors"
          >
            {acceptLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
