'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';

const CONSENT_KEY = 'ourmoney_cookie_consent';

type ConsentStatus = 'granted' | 'denied';

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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY) as ConsentStatus | null;
    if (!stored) {
      setVisible(true);
    } else {
      applyConsent(stored);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'granted');
    applyConsent('granted');
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(CONSENT_KEY, 'denied');
    applyConsent('denied');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 sm:px-4 sm:pb-4"
    >
      <div className="glass-nav rounded-[20px] max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <p className="text-sm text-white/75 leading-relaxed">
          {message}{' '}
          <Link
            href="/polityka-prywatnosci"
            className="text-white/40 hover:text-white underline underline-offset-2 transition-colors"
          >
            {learnMoreLabel}
          </Link>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleReject}
            className="text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            {rejectLabel}
          </button>
          <button
            onClick={handleAccept}
            className="bg-[#bbff00] text-black text-xs font-semibold px-5 py-2 rounded-full hover:bg-[#a2e600] transition-colors"
          >
            {acceptLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
