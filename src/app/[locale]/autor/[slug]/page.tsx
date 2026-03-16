import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CTABanner } from '@/components/sections/CTABanner';
import { client, fetchOptions } from '@/sanity/lib/client';
import { AUTHOR_QUERY, AUTHOR_POSTS_QUERY } from '@/sanity/lib/queries';

type Props = { params: Promise<{ locale: string; slug: string }> };

type AuthorData = {
  _id: string;
  name: string;
  slug: string;
  role?: string;
  bio?: string;
  avatarUrl?: string;
};

type Post = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  excerpt?: string;
  mainImageUrl?: string;
  mainImageAlt?: string;
  estimatedWordCount?: number;
  category?: { title: string; slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const author = await client.fetch<AuthorData | null>(AUTHOR_QUERY, { slug }, fetchOptions);
  if (!author) return {};
  return {
    title: `${author.name} | OurMoney`,
    description: author.bio ?? undefined,
    alternates: {
      canonical: `https://ourmoney.pl/${locale}/autor/${slug}`,
      languages: {
        pl: `https://ourmoney.pl/pl/autor/${slug}`,
        en: `https://ourmoney.pl/en/author/${slug}`,
      },
    },
  };
}

function readingTime(wordCount?: number) {
  if (!wordCount) return null;
  return Math.max(1, Math.round(wordCount / 200));
}

export default async function AuthorPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'BlogPage' });

  const [author, posts] = await Promise.all([
    client.fetch<AuthorData | null>(AUTHOR_QUERY, { slug }, fetchOptions),
    client.fetch<Post[]>(AUTHOR_POSTS_QUERY, { slug, language: locale }, fetchOptions),
  ]);

  if (!author) notFound();

  return (
    <>
      <Header />
      <main>
        {/* Author hero */}
        <section className="bg-[#141414] pt-36 pb-16 px-6">
          <div className="max-w-3xl mx-auto">
            <Link
              href={'/o-nas'}
              className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm mb-10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              O nas
            </Link>

            <div className="flex items-center gap-6 mb-8">
              {author.avatarUrl ? (
                <Image
                  src={author.avatarUrl}
                  alt={author.name}
                  width={96}
                  height={96}
                  className="rounded-full object-cover w-24 h-24 flex-shrink-0"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#bbff00] font-bold text-3xl">
                    {author.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <h1 className="font-display text-3xl md:text-4xl text-white mb-2">
                  {author.name}
                </h1>
                {author.role && (
                  <p className="text-[#bbff00] text-sm font-medium">{author.role}</p>
                )}
              </div>
            </div>

            {author.bio && (
              <p className="text-white/70 text-lg leading-relaxed max-w-2xl">{author.bio}</p>
            )}
          </div>
        </section>

        {/* Author posts */}
        {posts.length > 0 && (
          <section className="bg-white py-20 px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-display text-2xl md:text-3xl text-[#141414] mb-10">
                Artykuły
              </h2>
              <div className="flex flex-col gap-6">
                {posts.map((post) => {
                  const minutes = readingTime(post.estimatedWordCount);
                  return (
                    <Link
                      key={post._id}
                      href={`/blog/${post.slug}`}
                      className="group flex gap-5 items-start border-b border-[#e2dbd2] pb-6 last:border-0 last:pb-0"
                    >
                      {post.mainImageUrl && (
                        <Image
                          src={post.mainImageUrl}
                          alt={post.mainImageAlt ?? post.title}
                          width={100}
                          height={70}
                          className="rounded-lg object-cover flex-shrink-0 w-[100px] h-[70px]"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[#141414] font-semibold leading-snug group-hover:text-[#bbff00] transition-colors mb-1">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-[#141414]/50 text-sm line-clamp-2 mb-2">
                            {post.excerpt}
                          </p>
                        )}
                        {minutes && (
                          <span className="inline-flex items-center gap-1 text-xs text-[#141414]/40">
                            <Clock className="w-3 h-3" />
                            {t('readingTime', { minutes })}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
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
