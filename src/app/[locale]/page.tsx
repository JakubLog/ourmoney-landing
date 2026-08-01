import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { PainPointsSection } from '@/components/sections/PainPointsSection';
import { SplitCalculatorSection } from '@/components/sections/SplitCalculatorSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { AiReportSection } from '@/components/sections/AiReportSection';
import { BrandPromiseSection } from '@/components/sections/BrandPromiseSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { CTABanner } from '@/components/sections/CTABanner';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { BeforeAfterSection } from '@/components/sections/BeforeAfterSection';
import { TrustSection } from '@/components/sections/TrustSection';
import { ComparisonSection } from '@/components/sections/ComparisonSection';
import { client } from '@/sanity/lib/client';
import { TESTIMONIALS_QUERY } from '@/sanity/lib/queries';

export const revalidate = 86400;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = { params: Promise<{ locale: string }> };
type FAQItem = { question: string; answer: string };
type Testimonial = { _id: string; name: string; rating: number; photoUrl: string | null };

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
        'x-default': 'https://ourmoney.pl/pl',
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

  // Ten sam fetch co w HeroSection — Next dedupuje żądanie w ramach renderu
  const testimonials = await client.fetch<Testimonial[]>(
    TESTIMONIALS_QUERY,
    { language: locale },
    process.env.NODE_ENV === 'production'
      ? { next: { revalidate: 86400, tags: ['landing'] } }
      : { cache: 'no-store' as const },
  );
  const avgRating =
    testimonials.length > 0
      ? testimonials.reduce((sum, t) => sum + (t.rating ?? 5), 0) / testimonials.length
      : null;

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
        '@type': 'SoftwareApplication',
        name: 'OurMoney',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        url: 'https://ourmoney.pl',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'PLN',
        },
        description: locale === 'pl'
          ? 'Aplikacja do wspólnego zarządzania budżetem domowym dla par'
          : 'Shared budget management app for couples',
        ...(avgRating !== null && {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: avgRating.toFixed(1),
            bestRating: '5',
            ratingCount: testimonials.length,
          },
        }),
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
        <SplitCalculatorSection locale={locale} />
        <HowItWorksSection locale={locale} />
        <FeaturesSection locale={locale} />
        <AiReportSection locale={locale} />
        <BeforeAfterSection locale={locale} />
        <BrandPromiseSection locale={locale} />
        <TestimonialsSection locale={locale} />
        <ComparisonSection locale={locale} />
        <TrustSection locale={locale} />
        <FAQSection locale={locale} />
        <CTABanner locale={locale} />
      </main>
      <Footer />
    </>
  );
}
