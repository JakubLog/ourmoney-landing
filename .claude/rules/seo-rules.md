# SEO Rules — OurMoney Landing

> Reguły SEO: Metadata API, structured data, AI SEO, sitemap, Core Web Vitals.

---

## Reguła 1: generateMetadata() — zawsze dynamiczne

**NIGDY** nie hardcoduj meta tagów. Każda strona MUSI mieć `generateMetadata()`:

```typescript
// app/[locale]/page.tsx
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    alternates: {
      canonical: `https://ourmoney.app/${locale}`,
      languages: {
        'pl': 'https://ourmoney.app/pl',
        'en': 'https://ourmoney.app/en',
      },
    },
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      url: `https://ourmoney.app/${locale}`,
      siteName: 'OurMoney',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
      locale: locale === 'pl' ? 'pl_PL' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
      images: ['/og-image.png'],
    },
  };
}
```

### Tytuły — format
- Strona główna: `OurMoney — [tagline]`
- Podstrony: `[Nazwa strony] | OurMoney`
- Blog posty: `[Tytuł posta] | OurMoney Blog`
- Max 60 znaków dla tytułu, max 155 dla description

---

## Reguła 2: hreflang — zawsze przy i18n

Każda strona musi zawierać `alternates.languages` z **obu** wersji językowych — pozwala Google na prawidłowe serwowanie wersji językowej.

```typescript
alternates: {
  canonical: `https://ourmoney.app/${locale}/blog/${slug}`,
  languages: {
    'pl': `https://ourmoney.app/pl/blog/${slug}`,
    'en': `https://ourmoney.app/en/blog/${slug}`,
  },
},
```

---

## Reguła 3: Structured Data (JSON-LD)

Dodawaj JSON-LD jako `<script>` w odpowiednich stronach:

### Strona główna — Organization + WebSite
```typescript
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://ourmoney.app/#organization',
      name: 'OurMoney',
      url: 'https://ourmoney.app',
      logo: 'https://ourmoney.app/logo.png',
      sameAs: ['https://twitter.com/ourmoney', /* inne social */],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://ourmoney.app/#website',
      url: 'https://ourmoney.app',
      name: 'OurMoney',
      publisher: { '@id': 'https://ourmoney.app/#organization' },
    },
  ],
};
```

### Blog post — Article
```typescript
{
  '@type': 'Article',
  headline: post.title,
  description: post.excerpt,
  author: { '@type': 'Person', name: post.author },
  datePublished: post.publishedAt,
  dateModified: post._updatedAt,
  image: post.mainImage,
}
```

### FAQ sekcja — FAQPage
```typescript
{
  '@type': 'FAQPage',
  mainEntity: faqs.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
}
```

**Pattern dodawania JSON-LD:**
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

---

## Reguła 4: AI SEO — llms.txt

Plik `public/llms.txt` — standard dla AI crawlerów (ChatGPT, Perplexity, Claude, Gemini):

```
# OurMoney

> Aplikacja mobilna do wspólnego zarządzania budżetem domowym dla par.

OurMoney to aplikacja PWA umożliwiająca parom wspólne śledzenie wydatków,
zarządzanie budżetem miesięcznym i realizację celów oszczędnościowych.

## Kluczowe funkcje
- Wspólny budżet dla par
- Śledzenie wydatków z podziałem
- Cele oszczędnościowe
- Raporty i analizy finansowe

## Linki
- [Blog](https://ourmoney.app/blog): Artykuły o finansach osobistych
- [Aplikacja](https://app.ourmoney.app): Dostęp do aplikacji

## Kontakt
- Email: hello@ourmoney.app
```

Plik musi być zawsze aktualny i odzwierciedlać rzeczywistą zawartość produktu.

---

## Reguła 5: Sitemap — automatyczny

Konfiguracja w `next-sitemap.config.js` lub `app/sitemap.ts`:

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchBlogPosts();

  const blogUrls = posts.flatMap(post => [
    { url: `https://ourmoney.app/pl/blog/${post.slug}`, lastModified: post._updatedAt },
    { url: `https://ourmoney.app/en/blog/${post.slug}`, lastModified: post._updatedAt },
  ]);

  return [
    { url: 'https://ourmoney.app/pl', priority: 1.0 },
    { url: 'https://ourmoney.app/en', priority: 1.0 },
    { url: 'https://ourmoney.app/pl/blog', priority: 0.8 },
    { url: 'https://ourmoney.app/en/blog', priority: 0.8 },
    ...blogUrls,
  ];
}
```

---

## Reguła 6: robots.txt

```typescript
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: '/studio/' },  // Sanity Studio nie indeksować
    ],
    sitemap: 'https://ourmoney.app/sitemap.xml',
  };
}
```

---

## Reguła 7: Open Graph Images

- Statyczny `/og-image.png` (1200×630) dla stron głównych
- Dynamiczne OG images przez `ImageResponse` dla blog postów:
  ```
  app/og/route.tsx → Edge Runtime, generuje PNG
  ```
- Zawsze optymalizowane (max 200KB)

---

## Reguła 8: Core Web Vitals — obowiązkowe

| Metryka | Target | Jak osiągnąć |
|---------|--------|--------------|
| LCP | < 2.5s | `priority` na hero image, font preload |
| CLS | < 0.1 | `width`/`height` na wszystkich obrazkach, `font-display: swap` |
| INP | < 200ms | Minimalizuj JS client-side, defer non-critical scripts |

GA4 musi mierzyć Core Web Vitals — dodaj `web-vitals` package i reportuj do GA4.

---

## Reguła 9: Blog SEO

- Każdy post: unikalny `title`, `description`, slug (bez polskich znaków)
- Canonical URL w Sanity schema jako opcjonalne pole override
- `datePublished` + `dateModified` zawsze obecne (JSON-LD + meta)
- Obrazy blogowe: alt text ZAWSZE z Sanity (pole wymagane w schemacie)
- Wewnętrzne linkowanie: każdy post linkuje do min. 2 innych postów

---

_Ostatnia aktualizacja: 2026-03-14_
