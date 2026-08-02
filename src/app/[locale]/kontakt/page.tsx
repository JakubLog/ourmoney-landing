import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { alternatesFor, absoluteUrl } from '@/lib/urls';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CTABanner } from '@/components/sections/CTABanner';
import { Mail, Instagram } from 'lucide-react';
import { CopyEmail } from '@/components/ui/CopyEmail';
import { ContactForm } from '@/components/ui/ContactForm';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'ContactPage.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: alternatesFor('/kontakt', locale),
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: absoluteUrl('/kontakt', locale),
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

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'ContactPage' });
  const tFooter = await getTranslations({ locale, namespace: 'Footer' });

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-dark pt-36 pb-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-6xl text-white leading-tight mb-6">
              {t('hero.headline')}
            </h1>
            <p className="text-lg text-white/70 leading-relaxed">
              {t('hero.description')}
            </p>
          </div>
        </section>

        {/* Contact info */}
        <section className="bg-white py-24 px-6">
          <div className="max-w-2xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-6 mb-16">
              {/* Email */}
              <CopyEmail
                email={tFooter('email')}
                className="flex items-center gap-4 p-6 rounded-2xl border border-beige hover:border-dark transition-colors group"
              >
                <div className="w-12 h-12 bg-dark rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs text-dark/50 uppercase tracking-wide mb-1">{t('email.label')}</p>
                  <p className="text-dark font-medium text-sm group-hover:text-black">
                    {tFooter('email')}
                  </p>
                </div>
              </CopyEmail>

              {/* Instagram */}
              <a
                href={tFooter('instagram')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 rounded-2xl border border-beige hover:border-dark transition-colors group"
              >
                <div className="w-12 h-12 bg-dark rounded-xl flex items-center justify-center shrink-0">
                  <Instagram size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-xs text-dark/50 uppercase tracking-wide mb-1">{t('instagram.label')}</p>
                  <p className="text-dark font-medium text-sm group-hover:text-black">
                    {t('instagram.value')}
                  </p>
                </div>
              </a>
            </div>

            {/* Contact form */}
            <ContactForm />
          </div>
        </section>

        <CTABanner locale={locale} />
      </main>
      <Footer />
    </>
  );
}
