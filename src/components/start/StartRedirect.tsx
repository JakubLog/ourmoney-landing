'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  STORE_AVAILABLE,
  buildAppUrl,
  detectPlatformClient,
  type AppPlan,
  type AppPlatform,
} from '@/lib/appLinks';
import { trackAppOpen } from '@/lib/analytics';

// Chwila oddechu na render brandingu - bez tego przekierowanie wyglada jak blysk.
const REDIRECT_DELAY_MS = 1200;

type Props = {
  locale: string;
  plan: AppPlan | null;
  /** Platforma zgadnieta na serwerze z User-Agent - klient ja doprecyzowuje. */
  initialPlatform: AppPlatform;
};

export function StartRedirect({ locale, plan, initialPlatform }: Props) {
  const t = useTranslations('StartPage');
  const [platform, setPlatform] = useState<AppPlatform>(initialPlatform);
  const [fired, setFired] = useState(false);

  useEffect(() => {
    const detected = detectPlatformClient();
    setPlatform(detected);
    const target = buildAppUrl(detected, locale, plan);

    trackAppOpen({ platform: detected, plan, locale });

    const timer = setTimeout(() => {
      setFired(true);
      // replace, nie assign - przycisk "wstecz" wraca na landing, nie w petle
      window.location.replace(target);
    }, REDIRECT_DELAY_MS);

    return () => clearTimeout(timer);
  }, [locale, plan]);

  const target = buildAppUrl(platform, locale, plan);
  const storeSoon = platform !== 'web' && !STORE_AVAILABLE[platform];

  return (
    <div className="flex flex-col items-center">
      <span
        aria-hidden="true"
        className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-accent"
      />

      <p className="mt-8 text-sm text-white/60" role="status" aria-live="polite">
        {fired ? t('statusFired') : t('statusPending')}
      </p>

      <a
        href={target}
        rel="noopener"
        className="sheen mt-6 inline-block rounded-full bg-accent px-10 py-4 text-sm font-semibold text-black transition-colors hover:bg-accent-light"
      >
        {t('manualCta')}
      </a>

      {storeSoon && (
        <p className="mt-8 max-w-sm text-center text-xs leading-relaxed text-white/40">
          {t(platform === 'ios' ? 'storeSoonIos' : 'storeSoonAndroid')}
        </p>
      )}
    </div>
  );
}
