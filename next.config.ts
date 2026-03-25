import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const securityHeaders = [
  // Prevent MIME type sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Prevent clickjacking
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Control referrer information
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Restrict browser features
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  // Force HTTPS for 1 year
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // XSS protection (legacy browsers)
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // DNS prefetch control
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
];

const nextConfig: NextConfig = {
  // Prevent webpack from bundling heavy Sanity Studio packages into vendor-chunks
  // (fixes corrupt .next cache on Windows due to NTFS file locking during HMR)
  serverExternalPackages: ['sanity', '@sanity/vision'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Compress responses
  compress: true,

  // Security + cache headers
  async headers() {
    return [
      {
        // Security headers on all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        // Long cache for static assets (fonts, images)
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache static images
        source: '/:path*.(webp|avif|png|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },

  // Redirect www → non-www
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.ourmoney.pl' }],
        destination: 'https://ourmoney.pl/:path*',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
