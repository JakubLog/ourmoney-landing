# CMS Schema — Sanity v3

> Typy treści, pola, GROQ queries, status.
> Aktualizuj po każdej zmianie schematu Sanity.

---

## Document Types

### 1. `blogPost` — Post bloga

**Status**: Planned

| Pole | Typ | Wymagane | Opis |
|------|-----|----------|------|
| `title` | string | ✓ | Tytuł posta |
| `slug` | slug | ✓ | URL-friendly, source: title |
| `excerpt` | text | ✓ | Krótki opis (max 155 znaków, dla SEO) |
| `mainImage` | image | ✓ | Obraz główny (alt wymagane) |
| `body` | array (Portable Text) | ✓ | Treść posta |
| `author` | reference → `author` | ✓ | Autor |
| `categories` | array → `category` | - | Kategorie |
| `publishedAt` | datetime | ✓ | Data publikacji |
| `seo` | object | - | SEO overrides (title, description, ogImage, noIndex) |
| `language` | string | ✓ | `pl` lub `en` (i18n) |

---

### 2. `author` — Autor

**Status**: Planned

| Pole | Typ | Wymagane | Opis |
|------|-----|----------|------|
| `name` | string | ✓ | Imię i nazwisko |
| `slug` | slug | ✓ | |
| `image` | image | - | Zdjęcie autora |
| `bio` | text | - | Krótkie bio |

---

### 3. `category` — Kategoria bloga

**Status**: Planned

| Pole | Typ | Wymagane | Opis |
|------|-----|----------|------|
| `title` | string | ✓ | Nazwa kategorii |
| `slug` | slug | ✓ | |
| `description` | text | - | |
| `language` | string | ✓ | `pl` lub `en` |

---

### 4. `landingPage` — Treść strony głównej

**Status**: Planned — decyzja TBD (czy CMS czy hardcode w i18n)

> Jeśli treść sekcji (hero, features, etc.) ma być edytowalna przez non-dev → Sanity.
> Jeśli tylko dev zmienia treść → i18n (`messages/`) wystarczy.

---

### 5. `faqItem` — FAQ

**Status**: Planned

| Pole | Typ | Wymagane | Opis |
|------|-----|----------|------|
| `question` | string | ✓ | |
| `answer` | text | ✓ | |
| `language` | string | ✓ | `pl` lub `en` |
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

> Uzupełniaj przy implementacji.

### Przykładowe queries (do implementacji)

```groq
// Lista postów
POSTS_QUERY = *[_type == "blogPost" && language == $locale && defined(slug.current)]
  | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    excerpt,
    "mainImageUrl": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
    "author": author->name,
    categories[]->{title, "slug": slug.current},
  }

// Pojedynczy post
POST_QUERY = *[_type == "blogPost" && slug.current == $slug && language == $locale][0] {
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  _updatedAt,
  body,
  "author": author->{ name, image, bio },
  seo,
}

// FAQ
FAQ_QUERY = *[_type == "faqItem" && language == $locale] | order(order asc) {
  _id,
  question,
  answer,
}
```

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

---

_Ostatnia aktualizacja: 2026-03-14_
