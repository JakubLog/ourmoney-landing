import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Plus, X } from 'lucide-react';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CTABanner } from '@/components/sections/CTABanner';
import { SplitCalculator } from '@/components/sections/SplitCalculator';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = { params: Promise<{ locale: string }> };
type FAQItem = { question: string; answer: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'CalculatorPage.meta' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://ourmoney.pl/${locale}/kalkulator`,
      languages: {
        pl: 'https://ourmoney.pl/pl/kalkulator',
        en: 'https://ourmoney.pl/en/kalkulator',
        'x-default': 'https://ourmoney.pl/pl/kalkulator',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://ourmoney.pl/${locale}/kalkulator`,
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

export default async function CalculatorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'CalculatorPage' });
  const tCommon = await getTranslations({ locale, namespace: 'Common' });
  const faqItems = t.raw('faq') as FAQItem[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: t('title'),
        url: `https://ourmoney.pl/${locale}/kalkulator`,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        description: t('subtitle'),
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'PLN' },
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
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'OurMoney',
            item: `https://ourmoney.pl/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: t('title'),
            item: `https://ourmoney.pl/${locale}/kalkulator`,
          },
        ],
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
        {/* Hero + narzedzie nad zagieciem */}
        <section className="bg-dark px-6 pt-36 pb-24">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center md:mb-16">
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-white/40">{t('eyebrow')}</p>
              {/* max-w wymusza lamanie na dwie linie juz na desktopie;
                  o rowny podzial linii dba globalna regula text-wrap: balance */}
              <h1 className="font-display mx-auto max-w-4xl text-4xl leading-tight text-white md:text-6xl">
                {t('title')}
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
                {t('subtitle')}
              </p>
            </div>

            <SplitCalculator
              locale={locale}
              appUrl={tCommon('appUrl')}
              placement="calculator_page"
            />
          </div>
        </section>

        {/* Jak liczymy + FAQ */}
        <section className="bg-white px-6 py-20 md:py-28">
          <div className="mx-auto max-w-3xl">
            <ScrollReveal>
              <h2 className="font-display mb-6 text-3xl text-dark md:text-4xl">{t('howTitle')}</h2>
              <p className="text-base leading-relaxed text-dark/60">{t('howBody')}</p>
            </ScrollReveal>

            <ScrollReveal className="mt-16" delay={100}>
              <h2 className="font-display mb-8 text-3xl text-dark md:text-4xl">{t('faqTitle')}</h2>
              {faqItems.map((item) => (
                <details key={item.question} className="group border-t border-dark/10">
                  <summary className="flex cursor-pointer items-center justify-between py-6">
                    <span className="pr-6 text-base font-medium text-dark">{item.question}</span>
                    <span aria-hidden="true" className="shrink-0 text-dark/40">
                      <Plus size={18} className="faq-plus" />
                      <X size={18} className="faq-minus" />
                    </span>
                  </summary>
                  <div className="faq-answer pb-6">
                    <p className="max-w-xl text-sm leading-relaxed text-dark/50">{item.answer}</p>
                  </div>
                </details>
              ))}
              <div className="border-t border-dark/10" />
            </ScrollReveal>
          </div>
        </section>

        <CTABanner locale={locale} />
      </main>
      <Footer />
    </>
  );
}
