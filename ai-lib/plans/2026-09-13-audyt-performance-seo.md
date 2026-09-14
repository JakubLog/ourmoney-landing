# Plan: Audyt i poprawki performance + SEO (wrzesień 2026)

**Data**: 2026-09-13
**Status**: Done (kod, CMS schema); dane w Sanity czekają na `sanity login` (skrypt gotowy)

## Kontekst

Ostatni audyt SEO był 2026-07-25, a ostatni plan wydajnościowy (`2026-03-17-mobile-performance-90.md`)
został tylko częściowo zrealizowany (Lenis wyłączony na mobile, Framer Motion usunięty). Od tamtej pory
doszły: Next 16 + React Compiler, sekcje AiReport / kalkulator / cennik, GTM + Meta Pixel, Speed Insights.

Baseline z produkcji (`https://ourmoney.pl/pl`, Lighthouse 13.4.1, emulacja mobile, 2026-09-13):

| Kategoria | Wynik |
|-----------|-------|
| Performance | **62** |
| Accessibility | 92 |
| Best Practices | 100 |
| SEO | 100 |

| Metryka | Wartość | Cel |
|---------|---------|-----|
| FCP | 1.6 s | < 1.8 s |
| LCP | 3.3 s | < 2.5 s |
| TBT | **2 090 ms** | < 200 ms |
| Speed Index | 3.6 s | < 3.4 s |
| TTI | 7.7 s | - |
| CLS | 0.003 | < 0.1 |

### Diagnoza wstępna (architekt)

**TBT 2.1 s - główny problem.** Praca main thread 6.9 s, bootup JS 2.9 s. Źródła (z trace):
- dokument `/pl` 1 526 ms (hydracja + inline skrypty), chunk `31iar…` (react-dom, 71 KB gz) 1 523 ms,
  chunk `41pq…` (IntersectionObserver ×5, rAF ×4 - komponenty scroll/reveal) 850 ms,
  chunk `1er5…` (10 KB, long task 329 ms - do zidentyfikowania), `0ovk…` (speed-insights + web-vitals)
- third parties: `fbevents.js` 108 KB + long task 523 ms **mimo `fbq('consent','revoke')`** (ładowany zawsze,
  także bez zgody), `gtag/js` ładowany **dwukrotnie** (bezpośrednio z layoutu i przez kontener GTM,
  `…&cx=c&gtm=`), razem ~470 KB z Google Tag Manager
- 17 long tasks, forced reflow 66 ms (jakiś odczyt layoutu w pętli)

**LCP 3.3 s.** Element LCP = obraz tła hero (`next/image` fill, `priority`). Rozkład: TTFB 166 ms,
**opóźnienie odkrycia zasobu 703 ms**, pobranie 284 ms, **opóźnienie renderu 610 ms**. Insight
`lcp-discovery` nie przechodzi. Hipotezy: (1) brak/niepoprawny preload obrazu w HTML, (2) `template.tsx`
owija całą stronę w `.animate-fadeIn` (opacity 0 → 1, 0.4 s + 0.05 s delay) - element LCP nie liczy się
jako namalowany, dopóki jest przezroczysty; do tego `.hero-stagger` na treści.

**Pozostałe:** cache `_next/image` tylko 1 dzień (`minimumCacheTTL`), 14 KB polyfilli legacy w głównym
chunku, CSS render-blocking 15 KB (OK), DOM 1 127 elementów (OK), CLS znikomy.

**A11y (Lighthouse 92):** przycisk bez nazwy dostępnej (`Footer.tsx`, przycisk z `text-white/60`),
kontrast tekstu w akordeonie Features (`text-dark/30`, `/40`, `/50` na bieli), stopce (`text-white/40`)
i bannerze cookies (`text-white/50`).

**SEO:** Lighthouse 100 na homepage, więc audyt musi iść głębiej niż podstawy techniczne: reciprocity
hreflang na wszystkich stronach (zwłaszcza posty bez tłumaczenia), poprawność JSON-LD na każdej stronie,
sitemap vs realne 200-ki, długości title/description, linkowanie wewnętrzne bloga, aktualność `llms.txt`.

## Cel

1. Performance mobile ≥ 85 (docelowo 90) bez zmiany wyglądu i bez utraty danych analitycznych.
2. Wszystkie strony z sitemapy: poprawne canonical/hreflang/JSON-LD/meta, zero rozjazdów PL/EN,
   Lighthouse Accessibility ≥ 95 (bez przebudowy design systemu).

## Zakres Zmian

Praca w dwóch równoległych strumieniach (subagenci Opus, wysoki effort), rozłączne pliki:

### Strumień A - Performance (`perf-engineer`)
- `src/app/[locale]/layout.tsx` - kolejność/strategia third parties, Meta Pixel dopiero po zgodzie
- `src/app/[locale]/template.tsx`, `src/app/globals.css` - animacja wejścia strony vs LCP
- `next.config.ts` - `images.minimumCacheTTL`, nagłówki cache, ewentualnie `browserslist`
- `src/components/layout/*` (poza `Header.tsx`, `Footer.tsx`), `src/components/ui/*`,
  `src/components/sections/*` (poza `CalculatorTeaserSection.tsx`, `CalculatorMockup.tsx`) -
  redukcja JS klienta, forced reflow, hydracja
- `src/lib/analytics.ts` - tylko jeśli zmiana ładowania skryptów tego wymaga

### Strumień B - SEO (`seo-engineer`)
- `src/app/[locale]/**/page.tsx` - metadata, JSON-LD
- `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/manifest.ts`, `src/lib/urls.ts`
- `src/sanity/lib/queries.ts`, `src/components/blog/*`, `src/components/layout/Footer.tsx`
- `public/llms*.txt`, `public/en/llms*.txt`
- `messages/pl.json`, `messages/en.json` - klucze `meta` i nowe etykiety a11y (tylko `Edit`)

### Nietykalne (WIP użytkownika, niezacommitowane)
`src/components/layout/Header.tsx`, `src/components/sections/CalculatorTeaserSection.tsx`,
`src/components/sections/CalculatorMockup.tsx`, `.gitignore`, pigułka social proof w `HeroSection.tsx`.

## Podejście Techniczne

- Jedno drzewo robocze, rozłączna własność plików; tylko strumień A uruchamia `next build` /
  `next start` (port 3012), strumień B weryfikuje przez `next dev -p 3011` (Next 16 trzyma dev w `.next/dev`).
- Pomiar: Lighthouse lokalnie na buildzie produkcyjnym (mediana z 3 przebiegów), przed i po.
- Decyzje architekta:
  - Meta Pixel ładujemy **dopiero po zgodzie** (do tej pory i tak stał na `revoke`) - zero utraty danych.
  - GA4 + GTM: bez zmian w tym przebiegu (nie widzimy konfiguracji kontenera). Duplikat `gtag/js`
    zgłaszamy użytkownikowi jako decyzję: usunąć tag GA4 z kontenera GTM albo bezpośredni `<Script>`.
  - Nie tykamy design tokenów dla kontrastu - lista do decyzji, poprawki tylko tam, gdzie zmiana klasy
    nie zmienia zamysłu (np. przycisk bez nazwy → `aria-label`).
- Agenci nie commitują i nie edytują `ai-lib/**` - context-map aktualizuje architekt po scaleniu.

## Kolejność Implementacji

1. Baseline z produkcji (zrobione, wyżej) + build lokalny przechodzi (zrobione; usunięty uszkodzony
   `.next/dev/types` po zabitym dev serverze).
2. Równolegle: strumień A i strumień B.
3. Architekt: `type-check`, `lint`, `build`, Lighthouse lokalny po zmianach, review diffu.
4. Aktualizacja context-map (INDEX log, seo-strategy, analytics, design-system jeśli dotknięte).
5. Raport dla użytkownika z decyzjami do podjęcia (GTM/GA4, kontrast).

## Wynik (2026-09-13)

Lokalny build produkcyjny, Lighthouse 13.4.1 mobile, mediana z 3 (homepage `/pl`):

| Metryka | Przed (lokalnie) | Po (lokalnie) |
|---------|-----------------:|--------------:|
| Performance | 57 | 68-70 |
| TBT | 1 390 ms | ~600 ms |
| Speed Index | 4.4 s | 3.1-3.4 s |
| Forced reflow | 153 ms | 0.3 ms |
| `lcp-discovery` | fail | pass |
| Accessibility | 92 | 97 (zostaje tylko kontrast) |

Lokalne LCP (~4.4 s) jest zdominowane przez opóźnienie renderu na dławionym CPU (hydracja),
nie przez pobranie obrazu (opóźnienie odkrycia 703 → 18 ms). Wynik produkcyjny do sprawdzenia
po deployu. Pozostały największy koszt: duplikat GA4 przez GTM (457 KB, ~790 ms bootup) -
decyzja użytkownika. Chunk sekcji klienckich homepage (`Calculator*`, `Testimonials`,
`ScrollReveal`, 34 KB raw) kosztuje ~650 ms bootup - kandydat na kolejny przebieg.

SEO: 34 URL-e z sitemapy zcrawlowane, ustalenia i poprawki w `context-map/seo-strategy.md`
(sekcja „Audyt 2026-09-13") i ADR-013.

### Runda 2 (decyzje użytkownika, 2026-09-13)
- GA4: zostaje wyłącznie przez GTM, bezpośredni `<Script>` usunięty z layoutu (patrz `analytics.md`).
- Kontrast: codemod `text-dark/30-50 → /60`, `text-white/25-40 → /50`, `text-accent/40-50 → /70`,
  baner cookies `/70` (82 zamiany, 32 pliki; bez plików WIP drugiej sesji). Tabela `SplitBreakdown`
  dostała `th scope`.
- Sanity: schemat (repo `OurMoney CMS`, commit `e067069`): description max 155, walidacja spacji
  w nazwie kategorii. Dane (trim tytułu kategorii EN, 2 posty → właściwa kategoria, 2 skrócone
  opisy, 2 dokumenty autorów EN + powiązania + przepięcie 6 postów EN) - skrypt w scratchpadzie
  sesji, wymaga `npx sanity login` w katalogu CMS (token z `.env.local` landingu jest read-only).
- Landing: `AUTHOR_QUERY` preferuje dokument autora w języku strony.

Pomiar po rundzie 2 (build produkcyjny, port 3013, Lighthouse mobile, mediana z 3 dla `/pl`):

| Strona | Performance | TBT | Accessibility |
|--------|------------:|----:|--------------:|
| `/pl` | 74 (69 / 79 / 74) | 339 ms | 100 |
| `/pl/kalkulator` | 73 | 255 ms | 100 |
| post bloga | 72 | 222 ms | 100 |

Weryfikacja w czystym headless Chrome (bez rozszerzeń): przed zgodą zero requestów do Facebooka,
po „Akceptuję" `fbevents.js` + `signals/config` + `tr` (PageView). Kontener GTM inicjalizuje się,
ale na `localhost` **nie ładuje** tagu Google (`gtag/js`) - na produkcji ładował go z `cx=c` przy
odmowie zgody, więc tag ma warunek na hostname. Stąd obowiązkowa kontrola po deployu: DevTools →
Network → filtr `collect` → jeden request z `en=page_view`. Uwaga: przeglądarka użytkownika ma
rozszerzenie blokujące (fbevents 503, GTM zneutralizowany) - do testów analityki nie nadaje się.

## SEO / i18n / CMS - Impact

- SEO: zależnie od ustaleń strumienia B (metadata, JSON-LD, sitemap, llms.txt)
- i18n: możliwe nowe klucze a11y (`aria-label`) i korekty `meta.*`
- CMS: bez zmian schematów; ewentualnie projekcje w GROQ (np. `_translations`)

## Context Map - Co zaktualizować

- [x] `INDEX.md` - Log Ostatnich Zmian (SEO + performance) + ADR-013
- [x] `seo-strategy.md` - wyniki audytu, zmiany
- [x] `analytics.md` - ładowanie Meta Pixel po zgodzie, decyzja GA4/GTM
- [x] `design-system.md` - animacje a LCP, obrazy, cache

---

_Ostatnia aktualizacja: 2026-09-13_
_Autor: Claude (architekt) na podstawie Lighthouse 13.4.1 + analiza kodu_
