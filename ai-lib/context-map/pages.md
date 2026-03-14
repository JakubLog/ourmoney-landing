# Pages — OurMoney Landing

> Rejestr wszystkich stron, sekcji i ich hierarchii treści.
> Aktualizuj przy każdej nowej stronie lub sekcji.

---

## Strona główna (`/`)

**Status**: Done
**Cel**: Konwersja odwiedzającego w użytkownika aplikacji
**Lokalizacje**: `/pl/` (domyślna), `/en/`
**Plik**: `src/app/[locale]/page.tsx`

### Sekcje

| # | Sekcja | Komponent | Treść z | Status |
|---|--------|-----------|---------|--------|
| 1 | Hero | `HeroSection` | messages/ | Done |
| 2 | Pain Points | `PainPointsSection` | messages/ | Done |
| 3 | Funkcje | `FeaturesSection` | messages/ | Done |
| 4 | Brand Promise | `BrandPromiseSection` | messages/ | Done |
| 5 | Testimonials | `TestimonialsSection` | messages/ | Done |
| 6 | FAQ | `FAQSection` | messages/ | Done |
| 7 | CTA Banner | `CTABanner` | messages/ | Done |

**Hero bg**: `public/hero-bg.webp` (para z zawiązanymi oczami)

---

## Blog — Lista postów (`/blog`)

**Status**: Done (skeleton — Sanity fetch zakomentowany, czeka na credentials)
**Cel**: SEO, content marketing, budowanie authority
**Lokalizacje**: `/pl/blog`, `/en/blog`

### Elementy strony

| Element | Opis |
|---------|------|
| Nagłówek | Tytuł sekcji + opis |
| Lista postów | Grid / lista z thumbnail, tytuł, excerpt, data, czas czytania |
| Paginacja | Lub infinite scroll (TBD) |
| Kategorie / tagi | TBD — decyzja przy definicji schematu |

---

## Blog — Pojedynczy post (`/blog/[slug]`)

**Status**: Planned (strona do zbudowania po podłączeniu Sanity)
**Cel**: SEO na długi ogon, konwersja przez CTA w treści
**Lokalizacje**: `/pl/blog/[slug]`, `/en/blog/[slug]`

### Elementy strony

| Element | Opis |
|---------|------|
| Hero posta | Tytuł, autor, data, czas czytania, obraz główny |
| Treść | Portable Text (Sanity) — nagłówki, akapity, obrazki, cytaty |
| CTA inline | W treści lub po treści → rejestracja w app |
| Powiązane posty | 2-3 posty z tej samej kategorii |
| JSON-LD | `Article` structured data |

---

## Strony dodatkowe

| Strona | Ścieżka | Status |
|--------|---------|--------|
| O nas | `/[locale]/o-nas` | Done |
| Kontakt | `/[locale]/kontakt` | Done |
| Polityka prywatności | `/[locale]/polityka-prywatnosci` | Done |
| Regulamin | `/[locale]/regulamin` | Done (placeholder content) |
| 404 | `app/not-found.tsx` | Done |
| Strona features | `/features` | TBD |
| Cennik | `/pricing` | TBD |

---

## Shared Layout

| Komponent | Opis |
|-----------|------|
| `Header` | Logo, nawigacja, przycisk CTA, przełącznik języka (PL/EN) |
| `Footer` | Linki, social media, copyright, linki prawne |
| `Navigation` | Responsywna (hamburger mobile, full desktop) |

---

## Generowane strony (automatyczne)

| Strona | Generator |
|--------|-----------|
| `/sitemap.xml` | `app/sitemap.ts` |
| `/robots.txt` | `app/robots.ts` |
| `/studio/...` | Sanity Studio (embedded) |

---

_Ostatnia aktualizacja: 2026-03-14 (inicjalizacja Next.js)_
