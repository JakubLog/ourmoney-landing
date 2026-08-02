# CMS Schema — Sanity v3

> Typy treści, pola, GROQ queries, status.
> Aktualizuj po każdej zmianie schematu Sanity.

---

## Document Types

### 1. `blogPost` — Post bloga

**Status**: Done

| Pole | Typ | Wymagane | Opis |
|------|-----|----------|------|
| `title` | string | ✓ | Tytuł posta |
| `slug` | slug | ✓ | URL-friendly, source: title |
| `excerpt` | text | ✓ | Krótki opis (max 155 znaków, dla SEO) |
| `mainImage` | image | ✓ | Obraz główny (alt wymagane) |
| `body` | array (Portable Text) | ✓ | Treść posta |
| `author` | reference → `author` | - | Autor |
| `category` | reference → `category` | - | Kategoria (singular) |
| `relatedFaq` | array → ref `faqItem` | - | FAQ powiązane z postem |
| `cta` | object | - | Mid/end CTA: heading, text, buttonLabel, buttonUrl |
| `publishedAt` | datetime | ✓ | Data publikacji |
| `seo` | object | - | SEO overrides: title, description, ogImage, noIndex, canonical (url), keywords (array of strings) |
| `aiSeo` | object | - | AI SEO: aiSummary (text TL;DR), keyTakeaways (array of strings) |
| `language` | string | - | `pl` lub `en` (i18n) — fallback na PL jeśli brak |

---

### 2. `author` — Autor

**Status**: Done

| Pole | Typ | Wymagane | Opis |
|------|-----|----------|------|
| `name` | string | ✓ | Imię i nazwisko |
| `slug` | slug | ✓ | |
| `avatar` | image | - | Zdjęcie autora (pole: `avatar`, nie `image`) |
| `role` | string | - | Rola/tytuł (np. "Co-Founder") |
| `bio` | text | - | Krótkie bio |

---

### 3. `category` — Kategoria bloga

**Status**: Done

| Pole | Typ | Wymagane | Opis |
|------|-----|----------|------|
| `title` | string | ✓ | Nazwa kategorii |
| `slug` | slug | ✓ | |

---

### 4. `landingPage` — Treść strony głównej

**Status**: Planned — decyzja TBD (czy CMS czy hardcode w i18n)

> Jeśli treść sekcji (hero, features, etc.) ma być edytowalna przez non-dev → Sanity.
> Jeśli tylko dev zmienia treść → i18n (`messages/`) wystarczy.

---

### 5. `faqItem` — FAQ

**Status**: Done (schema istnieje, używane jako relatedFaq w blogPost)

| Pole | Typ | Wymagane | Opis |
|------|-----|----------|------|
| `question` | string | ✓ | |
| `answer` | text | ✓ | |
| `language` | string | - | `pl` lub `en` |
| `order` | number | - | Kolejność wyświetlania |

---

## Obiekt SEO (wspólny dla document types)

```typescript
// Każdy document type powinien zawierać:
defineField({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    { name: 'title', type: 'string' },        // Override tytułu (max 60 znaków)
    { name: 'description', type: 'text' },    // Max 155 znaków
    { name: 'ogImage', type: 'image' },       // 1200×630px
    { name: 'noIndex', type: 'boolean', initialValue: false },
  ],
})
```

---

## GROQ Queries

> Zaimplementowane w `src/sanity/lib/queries.ts`.

### Zaimplementowane queries

```groq
// POSTS_QUERY — lista postów (z language fallback)
*[_type == "blogPost" && defined(slug.current)
  && (language == $language || (!(defined(language)) && $language == "pl"))]
| order(publishedAt desc) {
  _id, title, "slug": slug.current, publishedAt, excerpt,
  "mainImageUrl": mainImage.asset->url, "mainImageAlt": mainImage.alt,
  "authorName": author->name,
  category->{ title, "slug": slug.current }, language,
}

// POST_QUERY — pojedynczy post (z language fallback + _translations)
*[_type == "blogPost" && slug.current == $slug
  && (language == $language || (!(defined(language)) && $language == "pl"))][0] {
  _id, title, "slug": slug.current, publishedAt, _updatedAt,
  body[]{ ..., _type == "image" => { ..., "url": asset->url, alt, caption } },
  "mainImageUrl": mainImage.asset->url, "mainImageAlt": mainImage.alt,
  author->{ name, "slug": slug.current, "avatarUrl": avatar.asset->url, role, bio },
  category->{ title, "slug": slug.current },
  relatedFaq[]->{ question, answer },
  cta { heading, text, buttonLabel, buttonUrl },
  language,
  seo { title, description, canonical, "ogImageUrl": ogImage.asset->url, keywords, noIndex },
  aiSeo { aiSummary, keyTakeaways },
  "_translations": *[_type == "translation.metadata" && references(^._id)].translations[].value->{
    title, "slug": slug.current, language },
}

// RELATED_POSTS_QUERY — 3 najnowsze inne posty w danym języku
*[_type == "blogPost" && defined(slug.current)
  && (language == $language || (!(defined(language)) && $language == "pl")) && _id != $currentId]
| order(publishedAt desc) [0...3] {
  _id, title, "slug": slug.current, publishedAt, excerpt,
  "mainImageUrl": mainImage.asset->url, "mainImageAlt": mainImage.alt,
  "authorName": author->name, category->{ title, "slug": slug.current }
}

// TESTIMONIALS_QUERY — opinie w danym języku
*[_type == "testimonial" && language == $language] | order(order asc) {
  _id, name, context, quote, rating, "photoUrl": photo.asset->url,
}

// CATEGORY_QUERY / CATEGORY_POSTS_QUERY — strona kategorii bloga
*[_type == "category" && slug.current == $slug][0] { _id, title, "slug": slug.current }

*[_type == "blogPost" && defined(slug.current) && category->slug.current == $slug
  && (language == $language || (!(defined(language)) && $language == "pl"))]
| order(publishedAt desc) { ... }

// CATEGORIES_WITH_POSTS_QUERY — do sitemapy, pomija puste kategorie
*[_type == "category" && defined(slug.current)
  && count(*[_type == "blogPost" && defined(slug.current) && references(^._id)]) > 0] {
  title, "slug": slug.current,
}
```

### Uwagi implementacyjne
- Language fallback: `!(defined(language)) && $language == "pl"` — posty bez języka traktowane jako PL
- `_translations` może zawierać `null` items — zawsze `.filter(Boolean)` przed użyciem
- `fetchOptions` export w `client.ts`: `cache: 'no-store'` w dev, `revalidate: 3600, tags: ['blog']` w prod
- `category` NIE ma pola `language` — kategorie są wspólne dla PL i EN, filtrowanie
  po języku dzieje się na poziomie postów (`CATEGORY_POSTS_QUERY`)

---

## Sanity Studio — konfiguracja

**URL**: `/studio` (embedded Next.js Studio)
**Dostęp**: tylko z autentykacją Sanity (ograniczone do team)
**robots.txt**: `Disallow: /studio/`

### Struktura sanity/
```
sanity/
├── lib/
│   ├── client.ts       # Sanity client (read-only token)
│   ├── queries.ts      # Wszystkie GROQ queries
│   └── image.ts        # urlFor() helper
├── schemas/
│   ├── blogPost.ts
│   ├── author.ts
│   ├── category.ts
│   └── faqItem.ts
├── types/              # Generowane przez sanity-typegen (NIE edytuj ręcznie)
└── env.ts              # projectId, dataset
```

---

## Historia zmian schematu

| Data | Zmiana | Migracja potrzebna |
|------|--------|-------------------|
| 2026-03-14 | Inicjalizacja dokumentacji | - |
| 2026-03-15 | Implementacja blogPost (pełna), author, category, faqItem | - |
| 2026-03-15 | blogPost rozszerzony: relatedFaq, cta, aiSeo, seo.canonical/keywords | - |
| 2026-03-15 | author rozszerzony: avatar (nie image), role | - |
| 2026-03-15 | ISR + on-demand revalidation (`/api/revalidate` webhook, `SANITY_REVALIDATE_SECRET`) | - |
| 2026-08-02 | `testimonial.context` — opcjonalny konkret uwiarygadniający opinię (max 60 zn., np. „Prowadzą wspólny budżet od 7 miesięcy"); renderowany pod imieniem w karuzeli | Nie (pole opcjonalne, wymaga uzupełnienia treści w Studio) |

---

_Ostatnia aktualizacja: 2026-08-02_
