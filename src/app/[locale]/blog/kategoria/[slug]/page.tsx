import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { Link, getPathname } from '@/i18n/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CTABanner } from '@/components/sections/CTABanner';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { client, fetchOptions } from '@/sanity/lib/client';
import { CATEGORY_QUERY, CATEGORY_POSTS_QUERY } from '@/sanity/lib/queries';
import { readingTime } from '@/lib/reading-time';
import { absoluteUrl, ogImageUrl } from '@/lib/urls';

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string; slug: string }> };

type CategoryTranslation = { slug: string; language: string };

type Category = {
  _id: string;
  title: string;
  slug: string;
  language?: string;
  _translations?: (CategoryTranslation | null)[];
};

/**
 * Kategoria w jezyku innym niz biezace locale to duplikat: ten sam zbior
 * artykulow pod obcojezycznym slugiem i naglowkiem. Zamiast go renderowac
 * (i indeksowac) przekierowujemy na tlumaczenie wlasciwe dla locale.
 */
function translationForLocale(category: Category, locale: string): string | null {
  if (!category.language || category.language === locale) return null;
  const match = category._translations
    ?.filter(Boolean)
    .find((tr) => tr!.language === locale);
  return match?.slug ?? null;
}

/**
 * Sciezka publiczna kategorii w danym locale - przez mape `pathnames`, nie
 * skladana recznie (ADR-011). Trwaly redirect: stary adres ma oddac sygnaly
 * tlumaczeniu, nie zostac w indeksie jako tymczasowo przeniesiony.
 */
function categoryPath(slug: string, locale: string): string {
  return getPathname({
    href: { pathname: '/blog/kategoria/[slug]', params: { slug } },
    locale: locale as 'pl' | 'en',
  });
}

/** hreflang po realnych tlumaczeniach kategorii, nie po tym samym slugu w obu locale. */
function categoryAlternates(category: Category, slug: string, locale: string) {
  const languages: Record<string, string> = {
    [locale]: absoluteUrl({ pathname: '/blog/kategoria/[slug]', params: { slug } }, locale),
  };
  for (const tr of category._translations?.filter(Boolean) ?? []) {
    if (tr!.language === locale || !tr!.slug) continue;
    languages[tr!.language] = absoluteUrl(
      { pathname: '/blog/kategoria/[slug]', params: { slug: tr!.slug } },
      tr!.language,
    );
  }
  languages['x-default'] = languages['pl'] ?? languages[locale];
  return {
    canonical: languages[locale],
    languages,
  };
}

type Post = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  mainImageUrl?: string;
  mainImageAlt?: string;
  mainImageBlur?: string;
  estimatedWordCount: number;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = await client.fetch<Category | null>(CATEGORY_QUERY, { slug }, fetchOptions);
  if (!category) return {};

  const translated = translationForLocale(category, locale);
  if (translated) permanentRedirect(categoryPath(translated, locale));

  const t = await getTranslations({ locale, namespace: 'CategoryPage' });
  // Tytul kategorii bywa zapisany w CMS ze spacja na koncu - bez trim wchodzi
  // do <title> jako podwojna spacja przed separatorem
  const categoryTitle = category.title.trim();
  const title = t('metaTitle', { category: categoryTitle });
  const description = t('metaDescription', { category: categoryTitle });
  const href = { pathname: '/blog/kategoria/[slug]' as const, params: { slug } };
  const ogImage = ogImageUrl(categoryTitle, description);

  return {
    title,
    description,
    alternates: categoryAlternates(category, slug, locale),
    openGraph: {
      title,
      description,
      url: absoluteUrl(href, locale),
      siteName: 'OurMoney',
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: locale === 'pl' ? 'pl_PL' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'CategoryPage' });
  const tBlog = await getTranslations({ locale, namespace: 'BlogPage' });

  const category = await client.fetch<Category | null>(CATEGORY_QUERY, { slug }, fetchOptions);

  if (!category) notFound();

  const translated = translationForLocale(category, locale);
  if (translated) permanentRedirect(categoryPath(translated, locale));

  // Slug kategorii razem ze slugami tlumaczen - posty przypisane do siostrzanej
  // kategorii w drugim jezyku naleza do tej samej kategorii merytorycznie
  const categorySlugs = [
    category.slug,
    ...(category._translations?.filter(Boolean).map((tr) => tr!.slug) ?? []),
  ].filter(Boolean);

  const posts = await client.fetch<Post[]>(
    CATEGORY_POSTS_QUERY,
    { categorySlugs, language: locale },
    fetchOptions,
  );

  const categoryTitle = category.title.trim();
  const href = { pathname: '/blog/kategoria/[slug]' as const, params: { slug } };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${absoluteUrl(href, locale)}#collection`,
        name: t('metaTitle', { category: categoryTitle }),
        description: t('metaDescription', { category: categoryTitle }),
        url: absoluteUrl(href, locale),
        inLanguage: locale === 'pl' ? 'pl-PL' : 'en-US',
        isPartOf: { '@id': 'https://ourmoney.pl/#website' },
        publisher: { '@id': 'https://ourmoney.pl/#organization' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'OurMoney', item: absoluteUrl('/', locale) },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl('/blog', locale) },
          { '@type': 'ListItem', position: 3, name: categoryTitle, item: absoluteUrl(href, locale) },
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
              className="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs transition-colors mb-10"
            >
              <ArrowLeft size={14} />
              {tBlog('backToBlog')}
            </Link>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50 mb-4">
              {t('eyebrow')}
            </p>
            <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.05] tracking-tight">
              {categoryTitle}
            </h1>
            <p className="text-base text-white/50 max-w-xl mt-6 leading-relaxed">
              {t('metaDescription', { category: categoryTitle })}
            </p>
          </div>
        </section>

        <section className="bg-dark pb-32 px-6">
          <div className="max-w-5xl mx-auto border-t border-white/8 pt-8">
            {posts.length === 0 ? (
              <p className="text-white/50 text-base py-20 text-center">{t('empty')}</p>
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
