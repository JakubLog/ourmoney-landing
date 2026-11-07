'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { APP_STORE_URL, buildAppStoreUrl } from '@/lib/appLinks';
import { trackCTAClick } from '@/lib/analytics';

type Props = {
  /** Miejsce na stronie - trafia do eventu `cta_click`. */
  location: string;
  className?: string;
};

/**
 * Oficjalna odznaka "Pobierz w App Store" (artwork Apple, czarna wersja).
 * Wytyczne Apple: bez modyfikacji grafiki, min. 40 px wysokosci na ekranie.
 * Link prowadzi prosto do App Store, nie przez /start - odznaka obiecuje sklep.
 */
export function AppStoreBadge({ location, className }: Props) {
  const locale = useLocale();
  const t = useTranslations('Common');

  if (!APP_STORE_URL) return null;

  const label = t('appStoreBadge');

  return (
    <a
      href={buildAppStoreUrl(APP_STORE_URL)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackCTAClick({ location, text: 'app_store_badge', locale })}
    >
      <Image
        src={locale === 'pl' ? '/badges/app-store-pl.svg' : '/badges/app-store-en.svg'}
        alt={label}
        width={120}
        height={40}
        className="h-10 w-auto"
        unoptimized
      />
    </a>
  );
}
