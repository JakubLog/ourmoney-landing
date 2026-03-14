# OurMoney Landing — Project Technology Stack

> Tech stack, patterny, konwencje, anty-wzorce dla landingu NextJS.

---

## 1. Tech Stack & Versions

| Warstwa | Technologia |
|---------|-------------|
| **Runtime** | Next.js 15.x (App Router, RSC) |
| **Language** | TypeScript 5.x (strict mode) |
| **Routing** | App Router (`app/` directory) |
| **Styling** | Tailwind CSS 4.x + Shadcn/UI (Radix primitives) |
| **CMS** | Sanity v3 (`next-sanity`, GROQ) |
| **i18n** | next-intl (PL + EN, locale-based routing) |
| **SEO** | Next.js Metadata API + next-sitemap / built-in sitemap |
| **Analytics** | Google Analytics 4 (via `@next/third-parties/google`) |
| **Icons** | lucide-react |
| **Forms** | react-hook-form + Zod (contact forms, jeśli potrzebne) |
| **Images** | next/image + Sanity Image Builder (`@sanity/image-url`) |
| **Package Manager** | npm (NIE pnpm, NIE yarn) |
| **Deployment** | Vercel |

---

## 2. Key Architectural Patterns

### App Router — struktura

```
app/
├── [locale]/                  # Locale wrapper (pl / en)
│   ├── layout.tsx             # Root layout z i18n + GA4
│   ├── page.tsx               # Strona główna (/)
│   ├── blog/
│   │   ├── page.tsx           # Lista postów
│   │   └── [slug]/page.tsx    # Pojedynczy post
│   └── [inne-strony]/
├── api/                       # Route handlers (jeśli potrzebne)
├── studio/[[...tool]]/        # Sanity Studio (embedded)
└── globals.css
```

### Data Fetching
- **RSC (Server Components)** — domyślnie dla wszystkich komponentów
- **Sanity fetch** — `import { client } from '@/sanity/lib/client'` + GROQ query
- `cache: 'force-cache'` + `revalidate` dla statycznych treści
- **Client Components** — tylko dla interaktywności (animacje, formularze, menu)
- `'use client'` — tylko gdy absolutnie konieczne

### Routing i18n (next-intl)
- Ścieżki: `/pl/...` i `/en/...`
- Middleware next-intl obsługuje redirect z `/` do defaultowego locale
- Tłumaczenia w `messages/pl.json` i `messages/en.json`
- `useTranslations()` w Client Components, `getTranslations()` w Server Components

### Sanity Pattern
```typescript
// Fetch w Server Component
import { client } from '@/sanity/lib/client';
import { POSTS_QUERY } from '@/sanity/lib/queries';

const posts = await client.fetch(POSTS_QUERY, {}, { next: { revalidate: 3600 } });
```

---

## 3. Coding Standards

### Naming
| Element | Konwencja | Przykład |
|---------|-----------|---------|
| Komponenty | PascalCase.tsx | `HeroSection.tsx` |
| Hooki | useCamelCase.ts | `useScrollProgress.ts` |
| Utils | camelCase.ts | `formatDate.ts` |
| Testy | *.test.ts(x) | `HeroSection.test.tsx` |
| Strony | `page.tsx` w app/ | `app/[locale]/page.tsx` |
| Sanity schematy | camelCase.ts w sanity/schemas/ | `blogPost.ts` |
| GROQ queries | SCREAMING_SNAKE_CASE | `POSTS_QUERY` |

### Imports
- **ZAWSZE** `@/` alias (mapuje na `src/` lub root)
- **NIGDY** relative `../../`

```typescript
// DOBRZE
import { HeroSection } from '@/components/sections/HeroSection';
// ŹLE
import { HeroSection } from '../../components/sections/HeroSection';
```

### File Structure

```
src/
├── app/                    # Next.js App Router
├── components/
│   ├── ui/                # Shadcn primitives (NIE edytuj bez powodu)
│   ├── sections/          # Sekcje strony (Hero, Features, FAQ, etc.)
│   ├── blog/              # Komponenty bloga
│   └── layout/            # Header, Footer, Navigation
├── sanity/
│   ├── lib/               # client.ts, queries.ts, image.ts
│   ├── schemas/           # Definicje typów treści
│   └── types/             # Generowane typy (sanity-typegen)
├── lib/
│   ├── analytics.ts       # GA4 helpers
│   └── utils.ts           # Utility functions
├── messages/              # i18n pliki tłumaczeń
│   ├── pl.json
│   └── en.json
└── types/                 # Globalne TypeScript types
```

---

## 4. Performance & SEO

### Images
- **ZAWSZE** `next/image` — nigdy `<img>`
- Sanity obrazy przez `@sanity/image-url` + `next/image`
- Formaty: WebP/AVIF (automatycznie przez next/image)
- Podawaj zawsze `width`, `height` lub `fill` — eliminuje CLS
- `priority` na obrazach Above The Fold (Hero)

### Code Splitting
- Server Components domyślnie → zero JS client-side
- `'use client'` + `dynamic()` dla ciężkich komponentów interaktywnych
- `Suspense` + `loading.tsx` dla tras

### Core Web Vitals
- LCP: `priority` na hero image, font preload
- CLS: zawsze `width`/`height` na obrazkach, `font-display: swap`
- INP: minimalizuj JS w Client Components

### Fonts
- `next/font` (Google Fonts lub lokalne) — zero layout shift
- Definiuj w root layout

---

## 5. Anti-Patterns (ZAKAZANE)

- ❌ `<img>` → ✅ `next/image`
- ❌ `'use client'` bez potrzeby → ✅ Server Component domyślnie
- ❌ `fetch` w useEffect → ✅ RSC + server-side fetch
- ❌ Hardcoded tekst w komponentach → ✅ `useTranslations()` / `getTranslations()`
- ❌ Hardcoded hex → ✅ Tailwind semantic tokens
- ❌ `any` type → ✅ explicit interfaces / generowane typy Sanity
- ❌ `console.log` w produkcji → ✅ usuń
- ❌ Relative imports `../../` → ✅ `@/` alias
- ❌ `posthog.capture()` bezpośrednio → ✅ GA4 helpers z `@/lib/analytics`
- ❌ Komponenty >150 linii → ✅ split na mniejsze
- ❌ Sanity `*` projection → ✅ explicit pola w GROQ
- ❌ Hardcoded meta tagi → ✅ `generateMetadata()` + dane z CMS

---

## 6. Komendy

```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

---

_Ostatnia aktualizacja: 2026-03-14_
