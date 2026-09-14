# SEO Strategy — OurMoney Landing

> Architektura SEO, słowa kluczowe, AI SEO, konfiguracja GSC.

---

## Architektura URL

Ścieżki są lokalizowane mapą `pathnames` w `src/i18n/routing.ts` — klucz to ścieżka
wewnętrzna (zgodna z katalogiem w `app/`), wartość to adres publiczny per locale.

| Wewnętrznie | PL | EN |
|-------------|----|----|
| `/` | `/pl` | `/en` |
| `/blog` | `/pl/blog` | `/en/blog` |
| `/blog/[slug]` | `/pl/blog/[slug]` | `/en/blog/[slug]` |
| `/blog/kategoria/[slug]` | `/pl/blog/kategoria/[slug]` | `/en/blog/category/[slug]` |
| `/kalkulator` | `/pl/kalkulator` | `/en/calculator` |
| `/o-nas` | `/pl/o-nas` | `/en/about` |
| `/kontakt` | `/pl/kontakt` | `/en/contact` |
| `/autor/[slug]` | `/pl/autor/[slug]` | `/en/author/[slug]` |
| `/polityka-prywatnosci` | `/pl/polityka-prywatnosci` | `/en/privacy-policy` |
| `/regulamin` | `/pl/regulamin` | `/en/terms` |
| `/start` | `/pl/start` | `/en/start` (noindex) |

`/` → 307 → `/pl` (z `src/app/page.tsx`).

**Kategoria bloga istnieje osobno per język** (własny dokument, własny slug, spięte przez
`translation.metadata` - ADR-013). Wejście na slug w obcym języku (`/pl/blog/kategoria/finances-in-relationship`)
daje trwały redirect (308) na tłumaczenie; sitemap emituje kategorię tylko raz, pod jej locale;
hreflang kategorii idzie po `_translations`, nie po tym samym slugu w obu locale. Listing kategorii
zbiera posty z całej grupy tłumaczeń (`$categorySlugs`), więc post przypisany w Studio do
siostrzanej kategorii nie znika.

**Nie buduj adresów ręcznie.** `src/lib/urls.ts` (`absoluteUrl`, `alternatesFor`,
`ogImageUrl`) jest jedynym miejscem tłumaczącym ścieżkę wewnętrzną na publiczną —
zasila canonical, hreflang, JSON-LD i sitemapę naraz. Zmiana slugu w `routing.ts`
przenosi się wszędzie automatycznie i wymaga tylko dołożenia 301 w `next.config.ts`.

Stare, polskie adresy EN (`/en/kalkulator`, `/en/o-nas`, `/en/kontakt`, `/en/autor/*`)
mają trwałe przekierowania w `redirects()` w `next.config.ts`.

hreflang: każda strona PL linkuje do EN i odwrotnie, plus `x-default` → PL.

---

## Słowa kluczowe

> Wstępny research SERP: 2026-07-25 (audyt SEO). Volume/konkurencja z narzędzi - nadal TBD.

### Główne (strona główna)
| Keyword | Język | Volume | Konkurencja | Obserwacje SERP (2026-07) |
|---------|-------|--------|-------------|---------------------------|
| aplikacja do budżetu dla par | PL | TBD | TBD | SERP zdominowany przez artykuły rankingowe (freenance.io, yomio.app); ourmoney.pl/en pojawia się (EN zamiast PL - naprawione przez x-default) |
| wspólny budżet domowy | PL | TBD | TBD | Brak widoczności; frazę dodano do hero subheadline |
| zarządzanie finansami para | PL | TBD | TBD | Brak widoczności |
| budget app for couples | EN | TBD | TBD | Nie badane |

### Kalkulator (`/kalkulator`)
| Keyword | Język | Gdzie użyte | Wystąpienia |
|---------|-------|-------------|-------------|
| kalkulator podziału wydatków | PL | title, H1, anchor z homepage | title + H1 |
| jak dzielić wydatki w związku | PL | H2, H2 FAQ, pytanie FAQ | 3 |
| podział wydatków przy różnych zarobkach | PL | H1, H2 | 2 |
| po równo / 50/50 | PL | H3 modelu, treść, FAQ | 8 |
| proporcjonalnie do dochodów | PL | H3 modelu, treść, FAQ | 6 |
| wspólny budżet | PL | subtitle, treść, FAQ | 4 |

Strona ma ~750 słów (PL i EN), H2/H3 z frazami, `WebApplication` + `FAQPage` (7 pytań) + `BreadcrumbList`,
link wychodzący do `/blog` i przychodzący z homepage (anchor: "Kalkulator podziału wydatków").
Do zrobienia: linki z postów blogowych do kalkulatora, dedykowany OG image.

### Blog / Long-tail
| Keyword | Temat posta | Priorytet |
|---------|-------------|-----------|
| jak zarządzać wspólnym budżetem | Poradnik dla par | Wysoki |
| jak oszczędzać pieniądze | Cel oszczędnościowy | Wysoki |
| (uzupełnij) | | |

### Działania pozycjonujące (z audytu 2026-07-25)
- Zdobyć wpisy w rankingach "aplikacje budżetowe dla par" (freenance.io, yomio.app) - najszybsza droga do widoczności w kategorii
- Publikować posty pod long-taile z tabeli wyżej
- Frazy kluczowe wplecione w treść homepage: "wspólny budżet domowy" (hero), "podział wydatków" (features)

---

## Structured Data — Co i gdzie

| Strona | Schema type | Wymagane pola |
|--------|-------------|---------------|
| Strona główna | `Organization` + `WebSite` + `WebPage` + `SoftwareApplication` + `FAQPage` | name, url, logo, sameAs, description, email, contactPoint, founder, offers |
| Kategoria bloga | `CollectionPage` + `BreadcrumbList` | name, url, inLanguage |
| Blog post | `Article` + `BreadcrumbList` (Home → Blog → Kategoria → Post) | headline, author (z `url`), datePublished, dateModified, image, mainEntityOfPage |
| FAQ sekcja | `FAQPage` | question, answer (identyczne z widocznym FAQ) |
| Blog lista | `Blog` | name, url, description |
| `/kalkulator` | `WebApplication` + `FAQPage` + `BreadcrumbList` | name, url, offers, inLanguage |
| `/o-nas` | `AboutPage` + `Organization` (`employee[]` → strony autorów) + `BreadcrumbList` | name, url, inLanguage |
| `/kontakt` | `ContactPage` + `Organization` (`contactPoint`) + `BreadcrumbList` | name, url, inLanguage |
| `/regulamin`, `/polityka-prywatnosci` | `WebPage` + `BreadcrumbList` | name, url, inLanguage |
| `/autor/[slug]` | `ProfilePage` + `Person` + `BreadcrumbList` | name, url, `mainEntity` → Person |

**Zasada `@id`.** Węzły wspólne mają stałe identyfikatory: `https://ourmoney.pl/#organization`,
`#website`, `#software`; węzły per strona: `<canonical>#webpage` / `#faq` / `#collection` /
`#profile` / `#app`. Strony referują je przez `{ '@id': ... }` (`publisher`, `isPartOf`, `about`,
`worksFor`), nie duplikują treści. Każdy `BreadcrumbList` zaczyna się od strony głównej, a ostatnia
pozycja ma `item` (adres własny).

Implementacja: patrz `.claude/rules/seo-rules.md` Reguła 3.

**Bez `aggregateRating`.** Opinie zbierane na własnej stronie o własnym produkcie są
self-serving — Google ich nie honoruje w rich resultach, a nadmiarowo deklarowane
łapią się na structured data spam policy. Wróci dopiero przy ocenach z App Store /
Google Play.

---

## Tytuły stron

Format z `.claude/rules/seo-rules.md` (max 60 znaków). Posty bloga: sufiks marki doklejany
warunkowo (`postTitle()` w `blog/[slug]/page.tsx`): `| OurMoney Blog` jeśli mieści się w 60,
inaczej `| OurMoney`, inaczej sam tytuł. Wcześniej 9 z 12 tytułów miało 64-74 znaki.

## AI SEO — llms.txt

Plik `public/llms.txt` — indeksowany przez AI crawlerów:
- ChatGPT (OpenAI crawler)
- Perplexity
- Claude (Anthropic)
- Gemini (Google)
- Bing Copilot

**Lokalizacja**: `public/llms.txt` + `public/llms-full.txt` (PL),
`public/en/llms.txt` + `public/en/llms-full.txt` (EN), wzajemnie zlinkowane.
**Aktualizuj**: przy każdej zmianie produktu, kluczowych funkcji **lub cennika**.

Pliki zawierają też listę wszystkich postów bloga (PL i EN) oraz adresy stron zaufania
(`/kontakt`, `/regulamin`, `/polityka-prywatnosci`) - przy nowym poście dopisz go do obu wersji.
Adres strony głównej PL to `https://ourmoney.pl/pl` (goły `https://ourmoney.pl` daje 307).

Cennik i FAQ są w tych plikach świadomie — „ile to kosztuje" to jedno z najczęstszych
pytań kierowanych do ChatGPT/Perplexity o narzędzie; bez tego modele zgadują.

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

## Audyt 2026-09-13 (crawl 34 URL-i z sitemapy, PL+EN)

OK bez zmian: 34/34 = 200, hreflang wzajemny na 100% stron, 100% `alt`, `/en` nie linkuje do
polskich slugów, wszystkie 301/308 ze starych adresów działają, `/og` renderuje diakrytyki,
robots.txt nie blokuje AI crawlerów (GPTBot, ClaudeBot, PerplexityBot, Google-Extended).

Naprawione: dwie thin strony kategorii pod obcym locale (→ redirect, sitemap 34 → 32),
pusta sekcja zespołu na `/en/about`, dwa `<h1>` w 2 postach (blok `h1` z PortableText → `<h2>`),
tytuły postów > 60 znaków, brak `og:url`/`og:site_name` w postach, brak linku do strony autora
z postów, brak JSON-LD na `/o-nas`, `/kontakt`, `/regulamin`, `/polityka-prywatnosci`, opisy
meta stron prawnych 36-63 znaki, przycisk stopki bez nazwy dostępnej.

Do zrobienia w Sanity (nie w kodzie): angielskie `bio` autorów (dziś `/en/author/*` serwuje PL
i duplikuje description), 2 posty przypisane do kategorii w drugim języku, spacja na końcu
tytułu kategorii EN, 2 `seo.description` po 159-160 znaków. Po deployu: reindeks w GSC dwóch
adresów kategorii, które teraz przekierowują.

## Strony wyłączone z indeksacji

| Strona | Sposób | Powód |
|--------|--------|-------|
| `/[locale]/start` | `robots: { index: false, follow: true }` w `generateMetadata()`, poza sitemapą | Bramka przekierowująca do aplikacji — brak treści do indeksacji. Crawl zostaje dozwolony, żeby Google widział `noindex` i przechodził dalej po linkach |
| `/studio` | `disallow` w `app/robots.ts` | Sanity Studio |

Regulamin i polityka prywatności były `{ index: false, follow: false }` — od 2026-08-02
są indeksowane i obecne w sitemapie. Przy produkcie finansowym (YMYL) strony zaufania
działają na korzyść, a `follow: false` dodatkowo blokował przepływ linków.

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

## Open Graph — obrazki

Generator: `src/app/og/route.tsx` → `/og?title=...&subtitle=...` (1200×630, `ImageResponse`).
Trasa stoi **poza** segmentem `[locale]` i poza matcherem `proxy.ts` — adres nie zależy
od mapy `pathnames`, więc zmiana slugu nie unieważnia URL-i w cache'u Facebooka czy Slacka.

| Strona | Obrazek |
|--------|---------|
| Homepage, /o-nas, /kontakt | statyczny `/og-image.png` |
| /kalkulator, /blog, kategoria | dynamiczny `/og` z tytułem i lidem strony |
| Post bloga | `seo.ogImage` z Sanity → fallback `mainImage` |

Domyślny font `ImageResponse` obsługuje polskie znaki diakrytyczne — zweryfikowane
renderem (ą, ę, ł, ś, ż, ó).

---

_Ostatnia aktualizacja: 2026-09-13_
