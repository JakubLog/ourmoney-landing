# CMS Rules — Sanity v3

> Reguły pracy z Sanity CMS: schematy, GROQ, workflow edycji treści.

---

## Reguła 1: Sanity jako Single Source of Truth dla treści

Wszystkie edytowalne treści landingu i bloga **MUSZĄ** pochodzić z Sanity. Hardcoding treści w komponentach jest dozwolony TYLKO dla statycznych elementów UI (labels, aria-labels, elementy nawigacji) — i wtedy przez i18n, nie bezpośrednio.

| Pochodzi z Sanity | Pochodzi z i18n (`messages/`) |
|-------------------|-------------------------------|
| Treść sekcji (tytuły, opisy, CTA) | Etykiety UI (przyciski, nawigacja) |
| Blog posty | Komunikaty błędów formularzy |
| FAQ | Aria-labels |
| Obrazy i media | Meta tagi (template strings) |
| Dane strukturalne (lista features, etc.) | |

---

## Reguła 2: Schematy — konwencje

```typescript
// sanity/schemas/blogPost.ts
import { defineType, defineField } from 'sanity';

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    // ...
  ],
});
```

### Nazewnictwo schematów
| Element | Konwencja | Przykład |
|---------|-----------|---------|
| Document types | camelCase | `blogPost`, `landingPage`, `faqItem` |
| Field names | camelCase | `publishedAt`, `mainImage`, `seoTitle` |
| Pliki schematów | camelCase.ts | `blogPost.ts`, `landingPage.ts` |

### Pola SEO — wymagane w każdym document type
Każdy typ dokumentu MUSI zawierać obiekt `seo`:
```typescript
defineField({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', description: 'Override domyślnego tytułu (max 60 znaków)' }),
    defineField({ name: 'description', type: 'text', rows: 3, description: 'Max 155 znaków' }),
    defineField({ name: 'ogImage', type: 'image', description: '1200×630px' }),
    defineField({ name: 'noIndex', type: 'boolean', initialValue: false }),
  ],
}),
```

### Pola i18n — obsługa PL/EN
Dla pól tekstowych które mają być tłumaczone, używaj `internationalizedArray` lub `object` z locale keys:
```typescript
// Opcja A: plugin document-internationalization (PREFEROWANE)
// Tworzy osobne dokumenty per locale, linkowane przez _id + __i18n_lang

// Opcja B: pola z sufiksem (dla prostych treści)
defineField({ name: 'title_pl', type: 'string' }),
defineField({ name: 'title_en', type: 'string' }),
```

---

## Reguła 3: GROQ — konwencje

### Zawsze explicit projection — NIE `*`
```groq
// ŹLE
*[_type == "blogPost"][0]

// DOBRZE
*[_type == "blogPost"][0] {
  _id,
  title,
  slug,
  publishedAt,
  "mainImage": mainImage.asset->url,
  excerpt,
  seo
}
```

### Queries w osobnym pliku
```typescript
// sanity/lib/queries.ts
export const POSTS_QUERY = groq`
  *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    "mainImageUrl": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
  }
`;

export const POST_QUERY = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    _updatedAt,
    body,
    seo,
    "author": author->name,
  }
`;
```

### Nazewnictwo queries
- `SCREAMING_SNAKE_CASE` dla stałych queries
- Sufix: `_QUERY` dla queries, `_MUTATION` (nie używane w Sanity, ale dla spójności)

---

## Reguła 4: Obrazy — Sanity Image Builder

```typescript
// sanity/lib/image.ts
import createImageUrlBuilder from '@sanity/image-url';
import { dataset, projectId } from '../env';

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
```

```tsx
// W komponencie
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

<Image
  src={urlFor(post.mainImage).width(800).height(450).format('webp').url()}
  alt={post.mainImage.alt ?? post.title}
  width={800}
  height={450}
/>
```

**Zawsze:**
- Format `.format('webp')` lub `.auto('format')`
- Podaj `width` i `height` dla eliminacji CLS
- `alt` ZAWSZE — pole wymagane w Sanity schema, fallback na tytuł dokumentu

---

## Reguła 5: Revalidacja — ISR

```typescript
// W Server Component
const data = await client.fetch(QUERY, params, {
  next: {
    revalidate: 3600,  // 1h dla blog postów
    tags: ['blog'],    // On-demand revalidation tag
  },
});
```

### Revalidation strategy
| Typ treści | revalidate | Tag |
|------------|------------|-----|
| Blog posty | 3600 (1h) | `blog` |
| Strona główna sekcje | 86400 (24h) | `landing` |
| FAQ | 86400 (24h) | `faq` |

### On-demand revalidation (Sanity webhook)
Webhook Sanity → `app/api/revalidate/route.ts` → `revalidateTag('blog')`

---

## Reguła 6: Sanity Studio — embedded

Studio dostępne pod `/studio` — tylko w środowisku deweloperskim lub z auth:

```typescript
// app/studio/[[...tool]]/page.tsx
import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity.config';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

Dodaj `/studio` do `robots.ts` jako `disallow`.

---

## Reguła 7: TypeScript — generowane typy

Po każdej zmianie schematu uruchom:
```bash
npx sanity@latest schema extract
npx @sanity/codegen generate
```

Importuj typy z `@/sanity/types`:
```typescript
import type { BlogPostQueryResult } from '@/sanity/types';
```

**NIGDY** nie pisz ręcznie typów dla Sanity documents — używaj wygenerowanych.

---

_Ostatnia aktualizacja: 2026-03-14_
