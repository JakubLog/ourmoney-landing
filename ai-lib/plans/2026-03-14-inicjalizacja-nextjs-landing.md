# Plan: Inicjalizacja Next.js 15 Landing — OurMoney

**Data**: 2026-03-14
**Status**: In Progress

---

## Cel

Wdrożyć pełny landing page OurMoney w Next.js 15 na bazie istniejących stron Framer z `.claude/attachements/`.

## Zakres

### Strony
| Strona | Ścieżka Next.js | Źródło treści |
|--------|----------------|---------------|
| Strona główna | `/[locale]/` | messages/ (statyczny) |
| Blog | `/[locale]/blog` | Sanity (schema) |
| O nas | `/[locale]/o-nas` | messages/ |
| Kontakt | `/[locale]/kontakt` | messages/ |
| Polityka prywatności | `/[locale]/polityka-prywatnosci` | messages/ |
| Regulamin | `/[locale]/regulamin` | messages/ |
| 404 | `not-found.tsx` | messages/ |

### Sekcje strony głównej
1. HeroSection
2. PainPointsSection ("Czy te wyzwania brzmią znajomo?")
3. FeaturesSection ("Jak OurMoney rozwiązuje Wasze problemy")
4. BrandPromiseSection ("Jesteśmy po stronie związku")
5. TestimonialsSection
6. FAQSection
7. CTASection (shared, reused on every page)

### Design System
- **Primary accent**: `#bbff00` (lime green)
- **Dark bg**: `#141414`
- **Fonts**: Instrument Serif (display) + Inter Tight (body)
- **Tailwind 4** — CSS-based config via @theme

## Fazy

1. ✅ `create-next-app` z TypeScript, Tailwind, App Router, src/
2. ✅ Instalacja: `next-intl`, `sanity`, `next-sanity`, `lucide-react`
3. ✅ Konfiguracja next-intl (routing, middleware, messages)
4. ✅ Layout (Header, Footer)
5. ✅ Strona główna (wszystkie sekcje)
6. ✅ Pozostałe strony (blog, o-nas, kontakt, legal, 404)
7. ✅ Sanity schema (blogPost, faqItem, landingPage)
8. ✅ Sitemap, robots

## Uwagi
- Sanity wymaga credentials od użytkownika (SANITY_PROJECT_ID, SANITY_DATASET)
- Regulamin zawiera placeholder "Meridian" — do zastąpienia przez klienta
- Kontakt page uproszczona do emaila (oryginał był templatem Meridian)
- App URL: `https://app.ourmoney.pl/`
