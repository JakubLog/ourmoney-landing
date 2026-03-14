# OurMoney Landing — Context Map

> Centralny rejestr wiedzy o projekcie landing. Czytaj ZAWSZE przed pracą.

---

## Page Registry

| # | Strona | Ścieżka | Status | Plik |
|---|--------|---------|--------|------|
| 1 | Strona główna | `/[locale]/` | Done | `src/app/[locale]/page.tsx` |
| 2 | O nas | `/[locale]/o-nas` | Done | `src/app/[locale]/o-nas/page.tsx` |
| 3 | Blog (lista) | `/[locale]/blog` | Done (skeleton) | `src/app/[locale]/blog/page.tsx` |
| 4 | Blog post | `/[locale]/blog/[slug]` | Planned | - |
| 5 | Kontakt | `/[locale]/kontakt` | Done | `src/app/[locale]/kontakt/page.tsx` |
| 6 | Polityka prywatności | `/[locale]/polityka-prywatnosci` | Done | `src/app/[locale]/polityka-prywatnosci/page.tsx` |
| 7 | Regulamin | `/[locale]/regulamin` | Done (placeholder) | `src/app/[locale]/regulamin/page.tsx` |
| 8 | 404 | `not-found` | Done | `src/app/not-found.tsx` |

_Uzupełniaj w miarę dodawania kolejnych stron._

---

## Context Map — Pliki

| Plik | Zawartość |
|------|-----------|
| [product-context.md](product-context.md) | Cel produktu, persony, value props, CTAs, tone of voice |
| [pages.md](pages.md) | Wszystkie strony, sekcje, hierarchia treści, status |
| [seo-strategy.md](seo-strategy.md) | Architektura SEO, słowa kluczowe, AI SEO, llms.txt |
| [cms-schema.md](cms-schema.md) | Sanity: typy treści, pola, GROQ queries |
| [i18n.md](i18n.md) | Namespace, klucze, konwencje PL/EN, status tłumaczeń |
| [analytics.md](analytics.md) | GA4: eventy, konwersje, GSC konfiguracja |
| [design-system.md](design-system.md) | Tokeny, komponenty, wzorce responsywności |
| [security-rules.md](security-rules.md) | CSP, headers, frontend security |

---

## Architectural Decisions (ADR)

| ADR | Decyzja | Data |
|-----|---------|------|
| ADR-001 | NextJS 15 App Router (nie Pages Router) — RSC domyślnie, minimalizacja client JS | 2026-03-14 |
| ADR-002 | Sanity v3 jako CMS (nie Strapi) — hosted, native NextJS integration, GROQ | 2026-03-14 |
| ADR-003 | next-intl dla i18n (PL + EN) — locale-based routing `/pl/`, `/en/` | 2026-03-14 |
| ADR-004 | Google Analytics 4 (nie PostHog) — landing nie zbiera PII, GA4 wystarczy | 2026-03-14 |
| ADR-005 | SEO-first architecture — generateMetadata(), JSON-LD, llms.txt, AI SEO | 2026-03-14 |

---

## Log Ostatnich Zmian

| Data | Zmiana | Dotknięty obszar |
|------|--------|-----------------|
| 2026-03-14 | Inicjalizacja Next.js 15 — wszystkie strony, komponenty, i18n PL+EN, Sanity schema | pages, i18n, cms-schema, seo |
| 2026-03-14 | Poprawka navbar: rgba(0,0,0,0.8) + blur, SVG logo, hero-bg.webp | design-system |
| 2026-03-14 | Inicjalizacja systemu ai-lib dla OurMoney Landing | dokumentacja |

---

_Ostatnia aktualizacja: 2026-03-14_
_Wersja: 1.0.0 — OurMoney Landing_
