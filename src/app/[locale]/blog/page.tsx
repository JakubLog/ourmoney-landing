import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CTABanner } from '@/components/sections/CTABanner';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogPage.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://ourmoney.app/${locale}/blog`,
      languages: {
        pl: 'https://ourmoney.app/pl/blog',
        en: 'https://ourmoney.app/en/blog',
      },
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogPage' });

  // TODO: fetch posts from Sanity once credentials are set up
  // const posts = await client.fetch(POSTS_QUERY, { language: locale }, { next: { revalidate: 3600, tags: ['blog'] } });
  const posts: unknown[] = [];

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-[#141414] pt-36 pb-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block bg-[#bbff00] text-black text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              {t('badge')}
            </span>
            <h1 className="font-display text-4xl md:text-6xl text-white leading-tight mb-6">
              {t('title')}
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
              {t('description')}
            </p>
          </div>
        </section>

        {/* Posts grid */}
        <section className="bg-white py-24 px-6">
          <div className="max-w-5xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-[#141414]/50 text-lg">{t('empty')}</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Posts will be rendered here once Sanity is connected */}
              </div>
            )}
          </div>
        </section>

        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
