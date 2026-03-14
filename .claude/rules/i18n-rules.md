# i18n Rules — next-intl (PL + EN)

> Reguły internacjonalizacji: locale routing, tłumaczenia, konwencje kluczy.

---

## Reguła 1: Wszelki tekst UI przez next-intl

**NIGDY** nie hardcoduj tekstu w językach naturalnych bezpośrednio w komponentach.

```tsx
// ŹLE
<button>Dowiedz się więcej</button>

// DOBRZE
const t = useTranslations('Common');
<button>{t('learnMore')}</button>
```

Wyjątek: aria-labels, title atrybuty — też przez `t()`, ale mogą być w tym samym namespace.

---

## Reguła 2: Locale Routing

Konfiguracja next-intl z middleware:
- Domyślny locale: `pl`
- Obsługiwane: `['pl', 'en']`
- Ścieżki: `/pl/...` i `/en/...`
- Redirect z `/` → `/pl` (lub auto-detect z `Accept-Language`)

```typescript
// middleware.ts
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['pl', 'en'],
  defaultLocale: 'pl',
  localeDetection: true,
});
```

---

## Reguła 3: Struktura plików tłumaczeń

```
messages/
├── pl.json    # Język domyślny
└── en.json    # English
```

### Struktura JSON — namespacing per strona/komponent

```json
{
  "Common": {
    "learnMore": "Dowiedz się więcej",
    "getStarted": "Zacznij teraz",
    "readMore": "Czytaj więcej"
  },
  "Navigation": {
    "home": "Strona główna",
    "blog": "Blog",
    "features": "Funkcje",
    "pricing": "Cennik"
  },
  "HomePage": {
    "meta": {
      "title": "OurMoney — Wspólny budżet dla par",
      "description": "Zarządzaj finansami razem z partnerem..."
    },
    "hero": {
      "headline": "Finanse pod kontrolą,\nrealnie razem",
      "subheadline": "OurMoney to aplikacja...",
      "cta": "Wypróbuj za darmo"
    },
    "features": {
      "title": "Wszystko czego potrzebujesz"
    }
  },
  "BlogPage": {
    "meta": {
      "title": "Blog | OurMoney",
      "description": "Artykuły o finansach osobistych..."
    },
    "title": "Blog",
    "readingTime": "{minutes} min czytania"
  }
}
```

### Konwencje kluczy
| Element | Konwencja | Przykład |
|---------|-----------|---------|
| Namespace | PascalCase | `HomePage`, `BlogPage` |
| Klucze | camelCase | `learnMore`, `ctaButton` |
| Zagnieżdżenie | max 3 poziomy | `HomePage.hero.cta` |
| Meta tagi | zawsze w `meta` obiekcie | `HomePage.meta.title` |
| Liczba mnoga | ICU format | `"{count, plural, one {# post} other {# posty}}"` |

---

## Reguła 4: Użycie w komponentach

### Server Components
```typescript
import { getTranslations } from 'next-intl/server';

export default async function HeroSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  return <h1>{t('hero.headline')}</h1>;
}
```

### Client Components
```typescript
'use client';
import { useTranslations } from 'next-intl';

export function NavigationMenu() {
  const t = useTranslations('Navigation');
  return <nav>{t('home')}</nav>;
}
```

### generateMetadata
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}
```

---

## Reguła 5: Parity PL/EN — obowiązkowa

**ZAWSZE** dodawaj klucze do OBU plików (pl.json i en.json) jednocześnie.

Przy każdej zmianie treści:
1. Dodaj/zmień klucz w `pl.json`
2. Dodaj/zmień klucz w `en.json`
3. Jeśli tłumaczenie EN nie jest jeszcze gotowe → użyj PL jako placeholder z komentarzem `// TODO: translate`

Skill `/content-review` sprawdza parity między plikami.

---

## Reguła 6: Link i nawigacja

```tsx
import Link from 'next/link';
import { useLocale } from 'next-intl';

// Użyj next-intl Link dla automatycznego prefixowania locale
import { Link } from '@/i18n/navigation';

<Link href="/blog">Blog</Link>
// Renderuje: /pl/blog lub /en/blog automatycznie
```

Konfiguracja `@/i18n/navigation.ts`:
```typescript
import { createNavigation } from 'next-intl/navigation';

export const { Link, redirect, usePathname, useRouter } =
  createNavigation({ locales: ['pl', 'en'] });
```

---

## Reguła 7: Sanity + i18n

- Treści CMS mają własne pole locale w Sanity (plugin `document-internationalization`)
- Przy fetchu z Sanity zawsze filtruj po locale: `*[_type == "blogPost" && language == $locale]`
- Fallback na PL jeśli EN nie istnieje (w GROQ query lub w komponencie)

---

_Ostatnia aktualizacja: 2026-03-14_
