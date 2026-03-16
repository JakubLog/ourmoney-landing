import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://ourmoney.pl';
  const locales = ['pl', 'en'];

  const staticPages = ['', '/o-nas', '/blog', '/kontakt'];

  return staticPages.flatMap((path) =>
    locales.map((locale) => ({
      url: `${base}/${locale}${path}`,
      lastModified: new Date(),
      priority: path === '' ? 1.0 : 0.8,
      changeFrequency: 'weekly' as const,
    }))
  );
}
