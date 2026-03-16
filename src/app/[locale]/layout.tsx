import type { Metadata } from 'next';
import { Instrument_Serif, Inter_Tight } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import { routing } from '@/i18n/routing';
import '@/app/globals.css';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { LocaleTracker } from '@/components/layout/LocaleTracker';
import { CookieConsentBanner } from '@/components/layout/CookieConsentBanner';
import { PageTransitionOverlay } from '@/components/layout/PageTransitionOverlay';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ourmoney.pl'),
  icons: {
    icon: '/favicon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { 'max-image-preview': 'large' },
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'pl' | 'en')) {
    notFound();
  }

  const [messages, t] = await Promise.all([
    getMessages(),
    getTranslations({ locale, namespace: 'CookieConsent' }),
  ]);

  return (
    <html
      lang={locale}
      className={`${instrumentSerif.variable} ${interTight.variable}`}
    >
      <head>
        {/* Consent Mode v2 defaults — must run before GA4 loads */}
        <Script id="gtag-consent-defaults" strategy="beforeInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            wait_for_update: 500
          });
        `}</Script>
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LocaleTracker locale={locale} />
          <SmoothScroll>
            {children}
          </SmoothScroll>
          <CookieConsentBanner
            message={t('message')}
            acceptLabel={t('accept')}
            rejectLabel={t('reject')}
            learnMoreLabel={t('learnMore')}
          />
          <PageTransitionOverlay />
        </NextIntlClientProvider>
      </body>
      {process.env.NODE_ENV === 'production' && (
        <GoogleAnalytics gaId="G-J6Z26RXMQY" />
      )}
    </html>
  );
}
