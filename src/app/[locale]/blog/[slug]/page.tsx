import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import { ArticlePortableText } from '@/components/blog/ArticlePortableText';
import { ArticleCTA } from '@/components/blog/ArticleCTA';
import { ArrowLeft, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CTABanner } from '@/components/sections/CTABanner';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar';
import { ShareButton } from '@/components/blog/ShareButton';
import { TrackedCTALink } from '@/components/ui/TrackedCTALink';
import { startHref } from '@/lib/appLinks';
import { Link } from '@/i18n/navigation';
import { client, fetchOptions } from '@/sanity/lib/client';
import { POST_QUERY, POST_TRANSLATION_QUERY, RELATED_POSTS_QUERY } from '@/sanity/lib/queries';
import { readingTime } from '@/lib/reading-time';

type Props = { params: Promise<{ locale: string; slug: string }> };

type Author = {
  name: string;
  slug: string;
  avatarUrl?: string;
  role?: string;
  bio?: string;
};

type Category = {
  title: string;
  slug: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

type Translation = {
  title: string;
  slug: string;
  language: string;
};

type RelatedPost = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  mainImageUrl?: string;
  mainImageAlt?: string;
  mainImageBlur?: string;
  authorName?: string;
  category?: Category;
  estimatedWordCount?: number;
};

type Post = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  _updatedAt: string;
  excerpt?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any[];
  mainImageUrl?: string;
  mainImageAlt?: string;
  mainImageBlur?: string;
  author?: Author;
  category?: Category;
  relatedFaq?: FaqItem[];
  cta?: {
    heading?: string;
    text?: string;
    buttonLabel?: string;
    buttonUrl?: string;
  };
  language: string;
  estimatedWordCount?: number;
  seo?: {
    title?: string;
    description?: string;
    canonical?: string;
    ogImageUrl?: string;
    keywords?: string[];
    noIndex?: boolean;
  };
  aiSeo?: {
    aiSummary?: string;
    keyTakeaways?: string[];
  };
  _translations?: (Translation | null)[];
};


function buildLanguageAlternates(
  currentSlug: string,
  currentLocale: string,
  translations?: (Translation | null)[],
): Record<string, string> {
  const locales = ['pl', 'en'];
  const result: Record<string, string> = {
    [currentLocale]: `https://ourmoney.pl/${currentLocale}/blog/${currentSlug}`,
  };
  for (const locale of locales) {
    if (locale === currentLocale) continue;
    const t = translations?.filter(Boolean).find((tr) => tr!.language === locale);
    if (t?.slug) {
      result[locale] = `https://ourmoney.pl/${locale}/blog/${t.slug}`;
    }
  }
  result['x-default'] = result['pl'] ?? result[currentLocale];
  return result;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await client.fetch<Post | null>(POST_QUERY, { slug, language: locale }, fetchOptions);
  if (!post) {
    const altPost = await client.fetch<{
      _translations?: { slug: string; language: string }[];
    } | null>(POST_TRANSLATION_QUERY, { slug, language: locale }, fetchOptions);

    const target = altPost?._translations?.find((t) => t.language === locale);
    if (target?.slug) {
      redirect(`/${locale}/blog/${target.slug}`);
    }
    return {};
  }

  const title = post.seo?.title ?? post.title;
  const description = post.seo?.description ?? post.excerpt;
  const canonicalUrl = post.seo?.canonical ?? `https://ourmoney.pl/${locale}/blog/${slug}`;
  const ogImage = post.seo?.ogImageUrl ?? post.mainImageUrl;

  return {
    title: `${title} | OurMoney Blog`,
    description,
    keywords: post.seo?.keywords,
    robots: post.seo?.noIndex ? { index: false } : undefined,
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates(slug, locale, post._translations),
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt,
      locale: locale === 'pl' ? 'pl_PL' : 'en_US',
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
    other: {
      ...(post.aiSeo?.aiSummary && { summary: post.aiSeo.aiSummary }),
      ...(post.aiSeo?.keyTakeaways?.length && {
        'article:key_takeaways': post.aiSeo.keyTakeaways.join(' | '),
      }),
    },
  };
}

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'BlogPage' });

  const post = await client.fetch<Post | null>(
    POST_QUERY,
    { slug, language: locale },
    fetchOptions,
  );

  if (!post) {
    const altPost = await client.fetch<{
      _translations?: { slug: string; language: string }[];
    } | null>(POST_TRANSLATION_QUERY, { slug, language: locale }, fetchOptions);

    const target = altPost?._translations?.find((t) => t.language === locale);
    if (target?.slug) {
      redirect(`/${locale}/blog/${target.slug}`);
    }
    notFound();
  }

  const relatedPosts = await client.fetch<RelatedPost[]>(
    RELATED_POSTS_QUERY,
    { language: locale, currentId: post._id },
    fetchOptions,
  );

  const canonicalUrl = post.seo?.canonical ?? `https://ourmoney.pl/${locale}/blog/${slug}`;
  const readingMinutes = readingTime(post.estimatedWordCount);
  const otherLanguages =
    post._translations?.filter(Boolean).filter((tr) => tr!.language !== locale) ?? [];

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seo?.description ?? post.excerpt,
    image: post.mainImageUrl,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt ?? post.publishedAt,
    url: canonicalUrl,
    inLanguage: post.language,
    ...(post.estimatedWordCount && { wordCount: post.estimatedWordCount }),
    ...(post.seo?.keywords?.length && { keywords: post.seo.keywords.join(', ') }),
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author.name,
          ...(post.author.role && { jobTitle: post.author.role }),
          ...(post.author.bio && { description: post.author.bio }),
          ...(post.author.avatarUrl && { image: post.author.avatarUrl }),
          url: `https://ourmoney.pl/${locale}/autor/${post.author.slug}`,
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'OurMoney',
      url: 'https://ourmoney.pl',
      logo: { '@type': 'ImageObject', url: 'https://ourmoney.pl/icon-512.png' },
    },
  };

  const breadcrumbItems = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Blog',
      item: `https://ourmoney.pl/${locale}/blog`,
    },
    { '@type': 'ListItem', position: 2, name: post.title },
  ];

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  };

  const jsonLdFaq =
    post.relatedFaq?.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.relatedFaq.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: { '@type': 'Answer', text: faq.answer },
          })),
        }
      : null;

  return (
    <>
      <Header />
      <ReadingProgressBar slug={slug} locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      {jsonLdFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}
      <main>
        <article itemScope itemType="https://schema.org/Article">
        {/* Hero */}
        <header className="bg-dark pt-36 pb-16 px-6">
          <div className="max-w-3xl mx-auto">
            {/* Top bar: back link + share + language switcher */}
            <nav className="flex items-center justify-between mb-10 flex-wrap gap-3" aria-label="Blog navigation">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-white/30 hover:text-white text-xs transition-colors"
              >
                <ArrowLeft size={14} />
                {t('backToBlog')}
              </Link>
              <div className="flex items-center gap-2">
                <ShareButton label={t('shareArticle')} copiedLabel={t('linkCopied')} />
                {otherLanguages.map((tr) => (
                  <Link
                    key={tr!.language}
                    href={`/blog/${tr!.slug}`}
                    locale={tr!.language as 'pl' | 'en'}
                    className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-accent transition-colors border border-white/10 hover:border-accent/30 px-3 py-2 rounded-full"
                    hrefLang={tr!.language}
                  >
                    {tr!.language === 'pl' ? t('langLabel.pl') : t('langLabel.en')}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Category + meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6 text-white/40 text-xs">
              {post.category && (
                <span className="inline-block bg-white/8 px-3 py-1 rounded-full text-white/50">
                  {post.category.title}
                </span>
              )}
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
              {post._updatedAt && post._updatedAt > post.publishedAt && (
                <time dateTime={post._updatedAt} className="sr-only">
                  {formatDate(post._updatedAt, locale)}
                </time>
              )}
              {post.author && (
                <>
                  <span>·</span>
                  <span itemProp="author" itemScope itemType="https://schema.org/Person">
                    <span itemProp="name">{post.author.name}</span>
                  </span>
                  {post.author.role && (
                    <span className="text-white/25">- {post.author.role}</span>
                  )}
                </>
              )}
              <span className="inline-flex items-center gap-1">
                <Clock size={11} className="opacity-50" />
                {t('readingTime', { minutes: readingMinutes })}
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl text-white leading-tight" itemProp="headline">
              {post.title}
            </h1>
          </div>
        </header>

        {/* Main image */}
        {post.mainImageUrl && (
          <figure className="relative w-full aspect-[16/7] bg-dark-3 m-0">
            <Image
              src={post.mainImageUrl}
              alt={post.mainImageAlt ?? post.title}
              title={post.mainImageAlt ?? post.title}
              fill
              priority
              {...(post.mainImageBlur && { placeholder: 'blur' as const, blurDataURL: post.mainImageBlur })}
              className="object-cover"
              sizes="100vw"
            />
          </figure>
        )}

        {/* Body */}
        <section className="bg-white py-16 px-6" itemProp="articleBody">
          <div className="max-w-3xl mx-auto">
            {/* TL;DR */}
            {post.aiSeo?.aiSummary && (
              <aside
                aria-label={t('tldr')}
                className="mb-10 p-6 rounded-2xl border border-accent/20 bg-accent/5"
              >
                <strong className="block text-sm font-semibold text-dark mb-2">
                  {t('tldr')}
                </strong>
                <p className="text-sm text-dark/70 leading-relaxed">{post.aiSeo.aiSummary}</p>
              </aside>
            )}

            {/* Key Takeaways */}
            {post.aiSeo?.keyTakeaways?.length ? (
              <section
                aria-label={t('keyTakeaways')}
                className="mb-10 p-6 rounded-2xl bg-surface"
              >
                <h2 className="text-sm font-semibold text-dark mb-4">{t('keyTakeaways')}</h2>
                <ul className="space-y-2">
                  {post.aiSeo.keyTakeaways.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-dark/70">
                      <span className="text-accent mt-0.5 shrink-0" aria-hidden="true">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* Article content - mid-CTA wstawiane przed pierwszym headingiem po połowie */}
            {(() => {
              const body = post.body ?? [];
              const cta = post.cta?.heading ? post.cta : null;

              let splitAt: number | null = null;
              if (cta && body.length > 4) {
                const mid = Math.ceil(body.length / 2);
                for (let i = mid; i < body.length; i++) {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const block = body[i] as any;
                  if (
                    block._type === 'block' &&
                    ['h2', 'h3', 'h4'].includes(block.style)
                  ) {
                    splitAt = i;
                    break;
                  }
                }
              }

              const first = splitAt !== null ? body.slice(0, splitAt) : body;
              const second = splitAt !== null ? body.slice(splitAt) : [];

              return (
                <>
                  <div className="article-prose">
                    <ArticlePortableText value={first} />
                  </div>
                  {splitAt !== null && cta && (
                    <ArticleCTA
                      heading={cta.heading!}
                      text={cta.text}
                      buttonLabel={cta.buttonLabel}
                      buttonUrl={cta.buttonUrl}
                      postSlug={slug}
                      location="article_mid"
                      locale={locale}
                    />
                  )}
                  {second.length > 0 && (
                    <div className="article-prose">
                      <ArticlePortableText value={second} />
                    </div>
                  )}
                </>
              );
            })()}

            {/* Author box */}
            {post.author && (post.author.bio || post.author.avatarUrl) && (
              <aside className="mt-14 pt-10 border-t border-dark/8 flex items-start gap-6" aria-label={t('authorSection')}>
                {post.author.avatarUrl && (
                  <Image
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    title={post.author.name}
                    width={64}
                    height={64}
                    className="rounded-full shrink-0 object-cover overflow-hidden"
                  />
                )}
                <address className="not-italic">
                  <p className="text-xs text-dark/40 mb-1 uppercase tracking-wider">
                    {t('authorSection')}
                  </p>
                  <p className="font-semibold text-dark text-sm">{post.author.name}</p>
                  {post.author.role && (
                    <p className="text-xs text-dark/50 mt-1">{post.author.role}</p>
                  )}
                  {post.author.bio && (
                    <p className="text-sm text-dark/60 mt-3 leading-relaxed">
                      {post.author.bio}
                    </p>
                  )}
                </address>
              </aside>
            )}

            {/* End CTA - Sanity gdy ustawione, fallback na i18n */}
            <div className="mt-14">
              {post.cta?.heading ? (
                <ArticleCTA
                  heading={post.cta.heading}
                  text={post.cta.text}
                  buttonLabel={post.cta.buttonLabel}
                  buttonUrl={post.cta.buttonUrl}
                  postSlug={slug}
                  location="article_end"
                  locale={locale}
                />
              ) : (
                <aside className="p-8 rounded-2xl bg-dark text-center">
                  <p className="font-display text-2xl md:text-3xl text-white mb-3 leading-tight">
                    {t('inArticleCta.headline')}
                  </p>
                  <p className="text-sm text-white/50 mb-8 max-w-md mx-auto leading-relaxed">
                    {t('inArticleCta.subtext')}
                  </p>
                  <TrackedCTALink
                    href={startHref(locale)}
                    className="inline-flex items-center gap-2 bg-accent text-black font-semibold text-sm px-8 py-4 rounded-full hover:bg-accent-light transition-colors"
                    location="article_end"
                    locale={locale}
                    postSlug={slug}
                  >
                    {t('inArticleCta.button')}
                  </TrackedCTALink>
                </aside>
              )}
            </div>

            {/* Related FAQ */}
            {post.relatedFaq?.length ? (
              <section
                aria-label={t('articleFaqTitle')}
                className="mt-14 pt-12 border-t border-dark/8"
              >
                <h2 className="font-display text-2xl text-dark mb-6">
                  {t('articleFaqTitle')}
                </h2>
                <div className="space-y-3">
                  {post.relatedFaq.map((faq, i) => (
                    <details
                      key={i}
                      className="group border border-dark/10 rounded-xl overflow-hidden"
                    >
                      <summary className="cursor-pointer flex items-center justify-between p-6 text-sm font-medium text-dark list-none hover:bg-surface transition-colors">
                        {faq.question}
                        <span
                          className="text-dark/30 group-open:rotate-45 transition-transform duration-200 shrink-0 ml-4 text-lg"
                          aria-hidden="true"
                        >
                          +
                        </span>
                      </summary>
                      <p className="px-6 pb-6 text-sm text-dark/60 leading-relaxed">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </section>

        </article>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-dark py-24 px-6" aria-label={t('relatedPosts')}>
            <div className="max-w-5xl mx-auto">
              <div className="border-t border-white/8 pt-10 mb-10">
                <h2 className="font-display text-3xl text-white">{t('relatedPosts')}</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <BlogPostCard
                    key={related._id}
                    slug={related.slug}
                    title={related.title}
                    excerpt={related.excerpt}
                    publishedAt={related.publishedAt}
                    mainImageUrl={related.mainImageUrl}
                    mainImageAlt={related.mainImageAlt}
                    mainImageBlur={related.mainImageBlur}
                    author={related.authorName}
                    locale={locale}
                    readingTimeLabel={t('readingTime', {
                      minutes: readingTime(related.estimatedWordCount),
                    })}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <CTABanner locale={locale} />
      </main>
      <Footer />
    </>
  );
}
