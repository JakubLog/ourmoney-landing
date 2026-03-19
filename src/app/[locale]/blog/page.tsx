import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CTABanner } from '@/components/sections/CTABanner';
import { BlogPostCard, FeaturedPostCard } from '@/components/blog/BlogPostCard';
import { client, fetchOptions } from '@/sanity/lib/client';
import { POSTS_QUERY } from '@/sanity/lib/queries';
import { readingTime } from '@/lib/reading-time';

export const revalidate = 3600; // ISR: regenerate every 1h

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = { params: Promise<{ locale: string }> };

type Post = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  mainImageUrl?: string;
  mainImageAlt?: string;
  mainImageBlur?: string;
  authorName?: string;
  category?: { title: string; slug: string };
  estimatedWordCount: number;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'BlogPage.meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://ourmoney.pl/${locale}/blog`,
      languages: {
        pl: 'https://ourmoney.pl/pl/blog',
        en: 'https://ourmoney.pl/en/blog',
      },
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'BlogPage' });

  const posts = await client.fetch<Post[]>(
    POSTS_QUERY,
    { language: locale },
    fetchOptions,
  );

  const [featured, ...rest] = posts;

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-[#141414] pt-36 pb-16 px-6">
          <div className="max-w-5xl mx-auto">
            <span className="inline-block bg-[#bbff00] text-black text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
              {t('badge')}
            </span>
            <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.05] tracking-tight max-w-3xl">
              {t('title')}
            </h1>
            <p className="text-base text-white/50 max-w-xl mt-6 leading-relaxed">
              {t('description')}
            </p>
          </div>
        </section>

        {/* Posts */}
        <section className="bg-[#141414] pb-32 px-6">
          <div className="max-w-5xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-40 border-t border-white/8">
                <p className="font-display text-6xl md:text-8xl text-white/5 mb-6 select-none">
                  Blog
                </p>
                <p className="text-white/30 text-base">{t('empty')}</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Divider */}
                <div className="border-t border-white/8 pt-8" />

                {/* Featured post */}
                <FeaturedPostCard
                  slug={featured.slug}
                  title={featured.title}
                  excerpt={featured.excerpt}
                  publishedAt={featured.publishedAt}
                  mainImageUrl={featured.mainImageUrl}
                  mainImageAlt={featured.mainImageAlt}
                  mainImageBlur={featured.mainImageBlur}
                  author={featured.authorName}
                  locale={locale}
                  readingTimeLabel={t('readingTime', { minutes: readingTime(featured.estimatedWordCount) })}
                  featuredLabel={t('featured')}
                  readMoreLabel={t('readMore')}
                />

                {/* Grid — remaining posts */}
                {rest.length > 0 && (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 pt-4">
                    {rest.map((post) => (
                      <BlogPostCard
                        key={post._id}
                        slug={post.slug}
                        title={post.title}
                        excerpt={post.excerpt}
                        publishedAt={post.publishedAt}
                        mainImageUrl={post.mainImageUrl}
                        mainImageAlt={post.mainImageAlt}
                        mainImageBlur={post.mainImageBlur}
                        author={post.authorName}
                        locale={locale}
                        readingTimeLabel={t('readingTime', { minutes: readingTime(post.estimatedWordCount) })}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <CTABanner locale={locale} />
      </main>
      <Footer />
    </>
  );
}
