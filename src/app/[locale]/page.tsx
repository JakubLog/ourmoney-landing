import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { PainPointsSection } from '@/components/sections/PainPointsSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { BrandPromiseSection } from '@/components/sections/BrandPromiseSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { CTABanner } from '@/components/sections/CTABanner';

type Props = { params: Promise<{ locale: string }> };
type FAQItem = { question: string; answer: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage.meta' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://ourmoney.pl/${locale}`,
      languages: {
        pl: 'https://ourmoney.pl/pl',
        en: 'https://ourmoney.pl/en',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://ourmoney.pl/${locale}`,
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
        sameAs: ['https://www.instagram.com/ourmoneypl/'],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://ourmoney.pl/#website',
        url: 'https://ourmoney.pl',
        name: 'OurMoney',
        publisher: { '@id': 'https://ourmoney.pl/#organization' },
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
      <main style={{ fontFamily: '"Switzer", "Switzer Placeholder", sans-serif', fontWeight: 500 }}>
        <HeroSection locale={locale} />
        <PainPointsSection locale={locale} />
        <FeaturesSection locale={locale} />
        <BrandPromiseSection locale={locale} />
        <TestimonialsSection locale={locale} />
        <FAQSection locale={locale} />
        <CTABanner locale={locale} />
      </main>
      <Footer />
    </>
  );
}
