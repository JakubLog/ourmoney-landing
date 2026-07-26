import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OurMoney - Wspólny budżet dla par',
    short_name: 'OurMoney',
    description:
      'Pierwsza aplikacja finansowa stworzona specjalnie dla par. Sprawiedliwy podział wydatków, wspólne cele, pełna prywatność.',
    start_url: '/',
    display: 'browser',
    background_color: '#141414',
    theme_color: '#bbff00',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
