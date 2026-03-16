import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CTABanner } from '@/components/sections/CTABanner';
import { AuthorCard } from '@/components/sections/AuthorCard';
import { client, fetchOptions } from '@/sanity/lib/client';
import { AUTHORS_QUERY } from '@/sanity/lib/queries';

type Props = { params: Promise<{ locale: string }> };

type Author = {
  _id: string;
  name: string;
  slug: string;
  role?: string;
  bio?: string;
  avatarUrl?: string;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AboutPage.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://ourmoney.pl/${locale}/o-nas`,
      languages: {
        pl: 'https://ourmoney.pl/pl/o-nas',
        en: 'https://ourmoney.pl/en/o-nas',
      },
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'AboutPage' });
  const authors = await client.fetch<Author[]>(AUTHORS_QUERY, {}, fetchOptions);

  return (
    <>
      <Header />
      <main>
        {/* Hero — full-bleed image with text overlay */}
        <section className="relative flex items-end" style={{ minHeight: '80vh' }}>
          <Image
            src="/about-bg.avif"
            alt=""
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="relative z-10 w-full px-6 pb-16 pt-32">
            <div className="max-w-5xl mx-auto">
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6 max-w-2xl">
                {t('hero.headline')}
              </h1>
              <p className="text-base md:text-lg text-white/80 max-w-sm leading-relaxed">
                {t('hero.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Mission statement */}
        <section className="bg-white py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="font-display text-2xl md:text-3xl lg:text-4xl text-[#141414] leading-snug">
              {t('mission.description')}
            </p>
          </div>
        </section>

        {/* Team — Sanity authors, clickable cards */}
        <section className="bg-[#f5f0e8] py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {authors.map((author) => (
                <AuthorCard key={author._id} author={author} />
              ))}
            </div>
          </div>
        </section>

        <CTABanner locale={locale} />
      </main>
      <Footer />
    </>
  );
}
