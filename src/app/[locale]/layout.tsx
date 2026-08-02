import type { Metadata } from 'next';
import { Instrument_Serif } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { routing } from '@/i18n/routing';
import '@/app/globals.css';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { LocaleTracker } from '@/components/layout/LocaleTracker';
import { CookieConsentBanner } from '@/components/layout/CookieConsentBanner';
import { LazyPageTransition } from '@/components/layout/LazyPageTransition';
import { InteractionTracker } from '@/components/layout/InteractionTracker';
import { WebVitalsReporter } from '@/components/layout/WebVitalsReporter';
import { SpeedInsights } from '@vercel/speed-insights/next';

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ourmoney.pl'),
  authors: [{ name: 'No-fuss House' }],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-icon-180.png',
  },
  other: {
    'theme-color': '#141414',
    'color-scheme': 'light',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { 'max-image-preview': 'large' },
  },
  openGraph: {
    siteName: 'OurMoney',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
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

  setRequestLocale(locale);

  const [messages, t] = await Promise.all([
    getMessages(),
    getTranslations({ locale, namespace: 'CookieConsent' }),
  ]);

  return (
    <html
      lang={locale}
      className={instrumentSerif.variable}
      data-scroll-behavior="smooth"
    >
      <head>
        <link
          rel="preload"
          href="/fonts/switzer-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/switzer-500.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/switzer-600.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* Consent Mode v2 defaults - must run before GA4 loads */}
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
        <Script id="console-warning" strategy="lazyOnload">{`
          (function(){
            var isPL = document.documentElement.lang === 'pl';
            console.log(
              '%c' + (isPL ? 'STOP!' : 'STOP!'),
              'color:#bbff00;font-size:48px;font-weight:bold;text-shadow:2px 2px 0 #141414'
            );
            console.log(
              '%c' + (isPL
                ? 'To jest funkcja przegladarki przeznaczona dla deweloperow. Jesli ktos powiedzial Ci, zebys cos tu wkleil - to oszustwo. Moze to dac atakujacemu dostep do Twojego konta.'
                : 'This is a browser feature intended for developers. If someone told you to paste something here - it is a scam. It could give an attacker access to your account.'),
              'color:#fff;font-size:16px;font-family:sans-serif'
            );
            console.log(
              '%c' + (isPL
                ? 'PS: Szukasz pracy? Napisz do nas -> kontakt@ourmoney.pl \\uD83D\\uDC9A'
                : 'PS: Looking for work? Hit us up -> kontakt@ourmoney.pl \\uD83D\\uDC9A'),
              'color:#9c9c9c;font-size:12px;font-family:sans-serif'
            );
          })();
        `}</Script>
        <Script id="console-suppress" strategy="lazyOnload">{`
          (function(){
            if(location.hostname==='localhost'||location.hostname==='127.0.0.1')return;
            var noop=function(){};
            console.log=noop;
            console.warn=noop;
            console.error=noop;
            console.info=noop;
            console.debug=noop;
          })();
        `}</Script>
      </head>
      <body>
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* GTM noscript fallback */}
            <noscript>
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-WTS9NS7J"
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              />
            </noscript>
            {/* Meta Pixel noscript fallback */}
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element -- tracking pixel w <noscript>, next/image nie ma tu racji bytu */}
              <img
                height="1"
                width="1"
                style={{ display: 'none' }}
                src="https://www.facebook.com/tr?id=1930936670874838&ev=PageView&noscript=1"
                alt=""
              />
            </noscript>
          </>
        )}
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
          <LazyPageTransition />
          <InteractionTracker />
          {process.env.NODE_ENV === 'production' && <WebVitalsReporter />}
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
      {process.env.NODE_ENV === 'production' && (
        <>
          {/* GA4 */}
          <Script
            id="_next-ga-init"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-J6Z26RXMQY');
              `,
            }}
          />
          <Script
            id="_next-ga"
            strategy="lazyOnload"
            src="https://www.googletagmanager.com/gtag/js?id=G-J6Z26RXMQY"
          />
          {/* GTM */}
          <Script
            id="_next-gtm"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-WTS9NS7J');
              `,
            }}
          />
          {/* Meta Pixel - respects Consent Mode, fires only after consent granted */}
          <Script
            id="_next-fbq-init"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
                n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
                document,'script','https://connect.facebook.net/en_US/fbevents.js');
                fbq('consent','revoke');
                fbq('init','1930936670874838');
                fbq('track','PageView');
              `,
            }}
          />
        </>
      )}
    </html>
  );
}
