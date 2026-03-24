import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CTABanner } from '@/components/sections/CTABanner';
import { Mail, Instagram } from 'lucide-react';
import { CopyEmail } from '@/components/ui/CopyEmail';

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
    alternates: {
      canonical: `https://ourmoney.pl/${locale}/kontakt`,
      languages: {
        pl: 'https://ourmoney.pl/pl/kontakt',
        en: 'https://ourmoney.pl/en/kontakt',
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `https://ourmoney.pl/${locale}/kontakt`,
      locale: locale === 'pl' ? 'pl_PL' : 'en_US',
      type: 'website',
    },
    twitter: {
      title: t('title'),
      description: t('description'),
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
        <section className="bg-[#141414] pt-36 pb-24 px-6">
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
                className="flex items-center gap-4 p-6 rounded-2xl border border-[#e2dbd2] hover:border-[#141414] transition-colors group"
              >
                <div className="w-12 h-12 bg-[#141414] rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-[#bbff00]" />
                </div>
                <div>
                  <p className="text-xs text-[#141414]/50 uppercase tracking-wide mb-1">{t('email.label')}</p>
                  <p className="text-[#141414] font-medium text-sm group-hover:text-black">
                    {tFooter('email')}
                  </p>
                </div>
              </CopyEmail>

              {/* Instagram */}
              <a
                href={tFooter('instagram')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 rounded-2xl border border-[#e2dbd2] hover:border-[#141414] transition-colors group"
              >
                <div className="w-12 h-12 bg-[#141414] rounded-xl flex items-center justify-center shrink-0">
                  <Instagram size={20} className="text-[#bbff00]" />
                </div>
                <div>
                  <p className="text-xs text-[#141414]/50 uppercase tracking-wide mb-1">{t('instagram.label')}</p>
                  <p className="text-[#141414] font-medium text-sm group-hover:text-black">
                    {t('instagram.value')}
                  </p>
                </div>
              </a>
            </div>

            {/* Simple mailto form note */}
            <div className="bg-[#f7f7f7] rounded-2xl p-8 text-center">
              <p className="text-[#141414]/60 text-sm leading-relaxed">
                {t('form.note')}
              </p>
            </div>
          </div>
        </section>

        <CTABanner locale={locale} />
      </main>
      <Footer />
    </>
  );
}
