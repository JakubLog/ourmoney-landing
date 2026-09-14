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

  // Automatyczna memoizacja komponentów — mniej re-renderów bez ręcznego memo
  reactCompiler: true,


  experimental: {
    // Artefakty kompilatora na dysku między restartami dev servera (beta)
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
    formats: ['image/avif', 'image/webp'],
    // Domyslne 60 s oznaczalo Cache-Control max-age=60 na /_next/image, a na
    // Vercelu 1 dzien - kazdy powrot uzytkownika pobieral obraz LCP od nowa.
    // 31 dni: adres /_next/image zawiera url+w+q, wiec podmiana pliku zrodlowego
    // pod tym samym adresem jest jedynym przypadkiem, kiedy cache trzeba przeczekac.
    minimumCacheTTL: 2678400,
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
        // Cache static images. Bez `immutable` - pliki w /public nie maja hasha
        // w nazwie, wiec podmiana (np. og-image.png) musi byc mozliwa; SWR
        // pozwala serwowac stara kopie i odswiezyc w tle.
        source: '/:path*.(webp|avif|png|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=2592000',
          },
        ],
      },
    ];
  },

  // Redirect www → non-www + 301 ze starych, polskich adresów EN
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.ourmoney.pl' }],
        destination: 'https://ourmoney.pl/:path*',
        permanent: true,
      },
      // Do 08.2026 wersja EN serwowana była pod polskimi slugami (/en/kalkulator).
      // Mapa `pathnames` w src/i18n/routing.ts zmieniła je na angielskie - te 301
      // przenoszą zaindeksowane adresy i wszystkie linki z zewnątrz.
      { source: '/en/kalkulator', destination: '/en/calculator', permanent: true },
      { source: '/en/o-nas', destination: '/en/about', permanent: true },
      { source: '/en/kontakt', destination: '/en/contact', permanent: true },
      { source: '/en/autor/:slug', destination: '/en/author/:slug', permanent: true },
      {
        source: '/en/polityka-prywatnosci',
        destination: '/en/privacy-policy',
        permanent: true,
      },
      { source: '/en/regulamin', destination: '/en/terms', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
