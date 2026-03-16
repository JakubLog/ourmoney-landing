# SEO Strategy — OurMoney Landing

> Architektura SEO, słowa kluczowe, AI SEO, konfiguracja GSC.

---

## Architektura URL

```
https://ourmoney.pl/           → redirect → /pl/
https://ourmoney.pl/pl/        → Strona główna PL
https://ourmoney.pl/en/        → Strona główna EN
https://ourmoney.pl/pl/blog/   → Blog PL
https://ourmoney.pl/en/blog/   → Blog EN
https://ourmoney.pl/pl/blog/[slug]  → Post PL
https://ourmoney.pl/en/blog/[slug]  → Post EN
```

hreflang: każda strona PL linkuje do EN i odwrotnie.
Canonical: `https://ourmoney.pl/[locale]/[path]`

---

## Słowa kluczowe (do uzupełnienia)

> Wypełnij po przeprowadzeniu keyword research.

### Główne (strona główna)
| Keyword | Język | Volume | Konkurencja |
|---------|-------|--------|-------------|
| aplikacja do budżetu dla par | PL | TBD | TBD |
| wspólny budżet domowy | PL | TBD | TBD |
| zarządzanie finansami para | PL | TBD | TBD |
| budget app for couples | EN | TBD | TBD |

### Blog / Long-tail
| Keyword | Temat posta | Priorytet |
|---------|-------------|-----------|
| jak zarządzać wspólnym budżetem | Poradnik dla par | Wysoki |
| jak oszczędzać pieniądze | Cel oszczędnościowy | Wysoki |
| (uzupełnij) | | |

---

## Structured Data — Co i gdzie

| Strona | Schema type | Wymagane pola |
|--------|-------------|---------------|
| Strona główna | `Organization` + `WebSite` | name, url, logo, sameAs |
| Blog post | `Article` | headline, author, datePublished, image |
| FAQ sekcja | `FAQPage` | question, answer |
| Blog lista | `Blog` | name, url, description |

Implementacja: patrz `.claude/rules/seo-rules.md` Reguła 3.

---

## AI SEO — llms.txt

Plik `public/llms.txt` — indeksowany przez AI crawlerów:
- ChatGPT (OpenAI crawler)
- Perplexity
- Claude (Anthropic)
- Gemini (Google)
- Bing Copilot

**Lokalizacja**: `public/llms.txt` (statyczny)
**Aktualizuj**: przy każdej zmianie produktu / kluczowych funkcji

### Struktura llms.txt
```
# OurMoney
> [tagline]

[Opis produktu 2-3 zdania]

## Kluczowe funkcje
- ...

## Blog
> [URL bloga]
Artykuły o zarządzaniu finansami osobistymi i budżetowaniu.

## Linki
- [Aplikacja](URL): ...
- [Blog](URL): ...

## Kontakt
- Email: ...
```

### Opcjonalnie: llms-full.txt
Rozszerzony plik dla crawlerów które obsługują dłuższe dokumenty:
- Szczegółowe opisy funkcji
- Case studies / user stories
- FAQ

---

## Google Search Console

**Status**: Do konfiguracji po deploymencie

### Checklist konfiguracji
- [ ] Weryfikacja domeny (DNS TXT record lub HTML file)
- [ ] Dodanie sitemap: `https://ourmoney.pl/sitemap.xml`
- [ ] Dodanie obu locale: `/pl/` i `/en/`
- [ ] Core Web Vitals monitoring
- [ ] Ustawienie kraju docelowego PL (jeśli główna wersja PL)

---

## Google Analytics 4

**Status**: Do konfiguracji

### Implementacja
```typescript
// app/[locale]/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google';

<GoogleAnalytics gaId="G-XXXXXXXXXX" />
```

Szczegóły eventów: `analytics.md`

---

## Core Web Vitals — Cele

| Metryka | Cel | Jak mierzyć |
|---------|-----|-------------|
| LCP | < 2.5s | GSC, PageSpeed Insights |
| CLS | < 0.1 | GSC, PageSpeed Insights |
| INP | < 200ms | GSC, PageSpeed Insights |
| TTFB | < 800ms | Vercel Analytics |

---

## SEO Checklist — Pre-launch

- [ ] `generateMetadata()` na wszystkich stronach
- [ ] `alternates.languages` (hreflang) wszędzie
- [ ] JSON-LD na stronie głównej i postach
- [ ] `app/sitemap.ts` z wszystkimi URL-ami
- [ ] `app/robots.ts` z disallow `/studio/`
- [ ] `public/llms.txt` stworzony i aktualny
- [ ] OG image 1200×630px
- [ ] Favicon + apple-touch-icon
- [ ] GSC weryfikacja + sitemap submission
- [ ] PageSpeed Insights score >90 mobile

---

_Ostatnia aktualizacja: 2026-03-14_
