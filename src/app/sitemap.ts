import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

const SITEMAP_POSTS_QUERY = groq`
  *[_type == "blogPost" && defined(slug.current)] {
    "slug": slug.current,
    language,
    publishedAt,
    _updatedAt
  }
`;

const SITEMAP_AUTHORS_QUERY = groq`
  *[_type == "author" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`;

type SitemapPost = {
  slug: string;
  language: string | null;
  publishedAt: string | null;
  _updatedAt: string | null;
};

type SitemapAuthor = {
  slug: string;
  _updatedAt: string | null;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://ourmoney.pl';
  const locales = ['pl', 'en'];

  const staticPages = ['', '/o-nas', '/blog', '/kontakt'];

  const staticEntries = staticPages.flatMap((path) =>
    locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      priority: path === '' ? 1.0 : 0.8,
      changeFrequency: 'weekly' as const,
    }))
  );

  const [posts, authors] = await Promise.all([
    client.fetch<SitemapPost[]>(SITEMAP_POSTS_QUERY, {}, { cache: 'no-store' as const }),
    client.fetch<SitemapAuthor[]>(SITEMAP_AUTHORS_QUERY, {}, { cache: 'no-store' as const }),
  ]);

  const blogEntries = posts.map((post) => ({
    url: `${base}/${post.language || 'pl'}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt ?? post.publishedAt ?? Date.now()),
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }));

  const authorEntries = authors.flatMap((author) =>
    locales.map((locale) => ({
      url: `${base}/${locale}/autor/${author.slug}`,
      lastModified: new Date(author._updatedAt ?? Date.now()),
      priority: 0.5,
      changeFrequency: 'monthly' as const,
    }))
  );

  return [...staticEntries, ...blogEntries, ...authorEntries];
}
