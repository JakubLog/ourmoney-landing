import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { SectionLead } from '@/components/ui/SectionLead';
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import { client } from '@/sanity/lib/client';
import { POSTS_QUERY } from '@/sanity/lib/queries';
import { readingTime } from '@/lib/reading-time';

type Props = { locale: string };

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

/**
 * Jedyne miejsce, w ktorym homepage linkuje do tresci bloga - poza nawigacja
 * cala strona prowadzila wylacznie do /start (noindex). Daje robotowi sciezke
 * w glab serwisu i sygnal swiezosci.
 */
export async function LatestPostsSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.latestPosts' });
  const tBlog = await getTranslations({ locale, namespace: 'BlogPage' });

  const posts = await client.fetch<Post[]>(
    POSTS_QUERY,
    { language: locale },
    process.env.NODE_ENV === 'production'
      ? { next: { revalidate: 3600, tags: ['blog'] } }
      : { cache: 'no-store' as const },
  );

  if (!posts || posts.length === 0) return null;

  return (
    <section className="bg-dark py-20 md:py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <p className="text-xs text-white/40 uppercase tracking-[0.2em] mb-4">
            {t('eyebrow')}
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-white leading-tight mb-6">
            {t('title')}
          </h2>
          <SectionLead tone="dark">{t('subtitle')}</SectionLead>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
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

        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-accent transition-colors"
          >
            {t('cta')}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
