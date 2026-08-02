import { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';
import { routing } from '@/i18n/routing';
import { absoluteUrl } from '@/lib/urls';

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

const SITEMAP_CATEGORIES_QUERY = groq`
  *[_type == "category" && defined(slug.current)
    && count(*[_type == "blogPost" && defined(slug.current) && references(^._id)]) > 0] {
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

// Sciezki wewnetrzne - absoluteUrl tlumaczy je na slug wlasciwy dla locale
const STATIC_PAGES = [
  { href: '/', priority: 1.0, changeFrequency: 'weekly' as const },
  { href: '/kalkulator', priority: 0.8, changeFrequency: 'weekly' as const },
  { href: '/o-nas', priority: 0.8, changeFrequency: 'weekly' as const },
  { href: '/blog', priority: 0.8, changeFrequency: 'weekly' as const },
  { href: '/kontakt', priority: 0.8, changeFrequency: 'weekly' as const },
  { href: '/regulamin', priority: 0.3, changeFrequency: 'yearly' as const },
  { href: '/polityka-prywatnosci', priority: 0.3, changeFrequency: 'yearly' as const },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_PAGES.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(page.href, locale),
      priority: page.priority,
      changeFrequency: page.changeFrequency,
    })),
  );

  const [posts, authors, categories] = await Promise.all([
    client.fetch<SitemapPost[]>(SITEMAP_POSTS_QUERY, {}, { cache: 'no-store' as const }),
    client.fetch<SitemapAuthor[]>(SITEMAP_AUTHORS_QUERY, {}, { cache: 'no-store' as const }),
    client.fetch<SitemapAuthor[]>(SITEMAP_CATEGORIES_QUERY, {}, { cache: 'no-store' as const }),
  ]);

  const blogEntries = posts.map((post) => ({
    url: absoluteUrl(
      { pathname: '/blog/[slug]', params: { slug: post.slug } },
      post.language || 'pl',
    ),
    lastModified: new Date(post._updatedAt ?? post.publishedAt ?? Date.now()),
    priority: 0.7,
    changeFrequency: 'monthly' as const,
  }));

  const authorEntries = authors.flatMap((author) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl({ pathname: '/autor/[slug]', params: { slug: author.slug } }, locale),
      lastModified: new Date(author._updatedAt ?? Date.now()),
      priority: 0.5,
      changeFrequency: 'monthly' as const,
    })),
  );

  const categoryEntries = categories.flatMap((category) =>
    routing.locales.map((locale) => ({
      url: absoluteUrl(
        { pathname: '/blog/kategoria/[slug]', params: { slug: category.slug } },
        locale,
      ),
      lastModified: new Date(category._updatedAt ?? Date.now()),
      priority: 0.5,
      changeFrequency: 'weekly' as const,
    })),
  );

  return [...staticEntries, ...blogEntries, ...authorEntries, ...categoryEntries];
}
