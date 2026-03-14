import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/studio/' },
      { userAgent: '*', disallow: '/api/' },
    ],
    sitemap: 'https://ourmoney.app/sitemap.xml',
  };
}
