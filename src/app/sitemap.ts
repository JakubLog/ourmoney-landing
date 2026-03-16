import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

const SITEMAP_POSTS_QUERY = groq`
  *[_type == "blogPost" && defined(slug.current)] {
    "slug": slug.current,
    language,
    publishedAt
  }
`;

type SitemapPost = {
  slug: string;
  language: string | null;
  publishedAt: string | null;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://ourmoney.pl';
  const locales = ['pl', 'en'];

  const staticPages = ['', '/o-nas', '/blog', '/kontakt'];

  const staticEntries = staticPages.flatMap((path) =>
    locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      priority: path === '' ? 1.0 : 0.8,
      changeFrequency: 'weekly' as const,
    }))
  );

  const posts = await client.fetch<SitemapPost[]>(
    SITEMAP_POSTS_QUERY,
    {},
    { cache: 'no-store' as const },
  );

  const blogEntries = posts.map((post) => ({
    url: `${base}/${post.language || 'pl'}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }));

  return [...staticEntries, ...blogEntries];
}
