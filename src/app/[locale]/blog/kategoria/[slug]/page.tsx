import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CTABanner } from '@/components/sections/CTABanner';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { client, fetchOptions } from '@/sanity/lib/client';
import { CATEGORY_QUERY, CATEGORY_POSTS_QUERY } from '@/sanity/lib/queries';
import { readingTime } from '@/lib/reading-time';
import { absoluteUrl, alternatesFor, ogImageUrl } from '@/lib/urls';

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string; slug: string }> };

type Category = { _id: string; title: string; slug: string };

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
  estimatedWordCount: number;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = await client.fetch<Category | null>(CATEGORY_QUERY, { slug }, fetchOptions);
  if (!category) return {};

  const t = await getTranslations({ locale, namespace: 'CategoryPage' });
  const title = t('metaTitle', { category: category.title });
  const description = t('metaDescription', { category: category.title });
  const href = { pathname: '/blog/kategoria/[slug]' as const, params: { slug } };

  return {
    title,
    description,
    alternates: alternatesFor(href, locale),
    openGraph: {
      title,
      description,
      url: absoluteUrl(href, locale),
      siteName: 'OurMoney',
      images: [{ url: ogImageUrl(category.title, description), width: 1200, height: 630 }],
      locale: locale === 'pl' ? 'pl_PL' : 'en_US',
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'CategoryPage' });
  const tBlog = await getTranslations({ locale, namespace: 'BlogPage' });

  const [category, posts] = await Promise.all([
    client.fetch<Category | null>(CATEGORY_QUERY, { slug }, fetchOptions),
    client.fetch<Post[]>(CATEGORY_POSTS_QUERY, { slug, language: locale }, fetchOptions),
  ]);

  if (!category) notFound();

  const href = { pathname: '/blog/kategoria/[slug]' as const, params: { slug } };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: t('metaTitle', { category: category.title }),
        description: t('metaDescription', { category: category.title }),
        url: absoluteUrl(href, locale),
        inLanguage: locale === 'pl' ? 'pl-PL' : 'en-US',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Blog', item: absoluteUrl('/blog', locale) },
          { '@type': 'ListItem', position: 2, name: category.title },
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
        <section className="bg-dark pt-36 pb-16 px-6">
          <div className="max-w-5xl mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/30 hover:text-white text-xs transition-colors mb-10"
            >
              <ArrowLeft size={14} />
              {tBlog('backToBlog')}
            </Link>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-4">
              {t('eyebrow')}
            </p>
            <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.05] tracking-tight">
              {category.title}
            </h1>
            <p className="text-base text-white/50 max-w-xl mt-6 leading-relaxed">
              {t('metaDescription', { category: category.title })}
            </p>
          </div>
        </section>

        <section className="bg-dark pb-32 px-6">
          <div className="max-w-5xl mx-auto border-t border-white/8 pt-8">
            {posts.length === 0 ? (
              <p className="text-white/30 text-base py-20 text-center">{t('empty')}</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
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
                    readingTimeLabel={tBlog('readingTime', {
                      minutes: readingTime(post.estimatedWordCount),
                    })}
                  />
                ))}
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
