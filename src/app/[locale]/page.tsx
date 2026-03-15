import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage.meta' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://ourmoney.app/${locale}`,
      languages: {
        pl: 'https://ourmoney.app/pl',
        en: 'https://ourmoney.app/en',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://ourmoney.app/${locale}`,
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

  return (
    <>
      <Header />
      <main>
        <HeroSection locale={locale} />
        <PainPointsSection locale={locale} />
        <FeaturesSection />
        <BrandPromiseSection locale={locale} />
        <TestimonialsSection locale={locale} />
        <FAQSection />
        <CTABanner locale={locale} />
      </main>
      <Footer />
    </>
  );
}
