import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { absoluteUrl, alternatesFor } from '@/lib/urls';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { PainPointsSection } from '@/components/sections/PainPointsSection';
import { CalculatorTeaserSection } from '@/components/sections/CalculatorTeaserSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { AiReportSection } from '@/components/sections/AiReportSection';
import { BrandPromiseSection } from '@/components/sections/BrandPromiseSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { CTABanner } from '@/components/sections/CTABanner';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { TrustSection } from '@/components/sections/TrustSection';
import { ComparisonSection } from '@/components/sections/ComparisonSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { LatestPostsSection } from '@/components/sections/LatestPostsSection';

export const revalidate = 86400;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = { params: Promise<{ locale: string }> };
type FAQItem = { question: string; answer: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage.meta' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: alternatesFor('/', locale),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: absoluteUrl('/', locale),
      siteName: 'OurMoney',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
      locale: locale === 'pl' ? 'pl_PL' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/og-image.png'],
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tFaq = await getTranslations({ locale, namespace: 'HomePage.faq' });
  const faqItems = tFaq.raw('items') as FAQItem[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://ourmoney.pl/#organization',
        name: 'OurMoney',
        url: 'https://ourmoney.pl',
        logo: 'https://ourmoney.pl/ourmoney-logo-hero.svg',
        description: locale === 'pl'
          ? 'Twórcy OurMoney - aplikacji do wspólnego budżetu domowego dla par.'
          : 'Makers of OurMoney - a shared household budget app for couples.',
        email: 'kontakt@ourmoney.pl',
        sameAs: ['https://www.instagram.com/ourmoneypl/'],
        founder: [
          { '@type': 'Person', name: 'Jakub M. Fedoszczak' },
          { '@type': 'Person', name: 'Magdalena Nestorowicz' },
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'kontakt@ourmoney.pl',
          availableLanguage: ['pl', 'en'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://ourmoney.pl/#website',
        url: 'https://ourmoney.pl',
        name: 'OurMoney',
        publisher: { '@id': 'https://ourmoney.pl/#organization' },
      },
      {
        '@type': 'SoftwareApplication',
        name: 'OurMoney',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: 'https://ourmoney.pl',
        // Trzy oferty odpowiadaja sekcji cennika: plan darmowy + Premium
        // w rozliczeniu miesiecznym i rocznym
        offers: [
          {
            '@type': 'Offer',
            name: locale === 'pl' ? 'Darmowy' : 'Free',
            price: '0',
            priceCurrency: 'PLN',
          },
          {
            '@type': 'Offer',
            name: locale === 'pl' ? 'Premium (miesięcznie)' : 'Premium (monthly)',
            price: '39.99',
            priceCurrency: 'PLN',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '39.99',
              priceCurrency: 'PLN',
              unitText: locale === 'pl' ? 'miesiąc' : 'month',
            },
          },
          {
            '@type': 'Offer',
            name: locale === 'pl' ? 'Premium (rocznie)' : 'Premium (yearly)',
            price: '399.99',
            priceCurrency: 'PLN',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: '399.99',
              priceCurrency: 'PLN',
              unitText: locale === 'pl' ? 'rok' : 'year',
            },
          },
        ],
        description: locale === 'pl'
          ? 'Aplikacja do wspólnego zarządzania budżetem domowym dla par'
          : 'Shared budget management app for couples',
        // Bez aggregateRating: opinie zbierane na wlasnej stronie o wlasnym
        // produkcie sa self-serving i nie kwalifikuja sie do rich resultow
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>
        <HeroSection locale={locale} />
        <PainPointsSection locale={locale} />
        <CalculatorTeaserSection locale={locale} />
        <HowItWorksSection />
        <FeaturesSection locale={locale} />
        <AiReportSection locale={locale} />
        <BrandPromiseSection locale={locale} />
        <TestimonialsSection locale={locale} />
        <ComparisonSection locale={locale} />
        <TrustSection locale={locale} />
        <PricingSection locale={locale} />
        <FAQSection locale={locale} />
        <LatestPostsSection locale={locale} />
        <CTABanner locale={locale} />
      </main>
      <Footer />
    </>
  );
}
