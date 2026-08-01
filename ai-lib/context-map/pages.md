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

## Kalkulator podziału wydatków (`/kalkulator`)

Darmowe narzędzie bez rejestracji - demo wartości produktu + landing pod reklamy TOF i long-tail SEO
("jak dzielić wydatki w związku przy różnych zarobkach").

### Sekcje
| # | Sekcja | Komponent | Treść |
|---|--------|-----------|-------|
| 1 | Hero + narzędzie | `SplitCalculator` (client) | H1, opis, karta kalkulatora nad zagięciem |
| 2 | Jak liczymy | inline w page.tsx | Wyjaśnienie wzoru na konkretnych liczbach |
| 3 | FAQ | inline w page.tsx | 3 pytania (wchodzą do FAQPage JSON-LD) |
| 4 | CTA | `CTABanner` | Wspólny banner |

Kalkulator ma przełącznik zasady podziału odpowiadający `SplitType` z aplikacji
(`equal | proportional | tracking`). Liczalne są dwa tryby - `tracking` nic nie dzieli,
więc jest tylko wspomniany w nocie pod CTA. Niezależnie od wybranego trybu wynik pokazuje
różnicę względem drugiego modelu - to jest moment "aha".

Logika liczenia jest 1:1 z aplikacją (`ProportionVisualizationScreen` + `partnerBalance.utils`):
najpierw zaokrąglony procent udziału, dopiero z niego kwota. Donut ma tę samą geometrię
(innerRadius 50 / outerRadius 80 / paddingAngle 2) i te same kolory (#bbff00, #3f3f46),
ale rysowany jest inline SVG - bez dociągania recharts na landing.

Samo narzędzie żyje wyłącznie na `/kalkulator` — homepage ma w tym miejscu tylko zajawkę
(`CalculatorTeaserSection`, między PainPoints a HowItWorks): nagłówek, opis i CTA "Otwórz kalkulator"
linkujące do strony. Dzięki temu treść nie duplikuje się między `/` a `/kalkulator`,
a cały sygnał SEO narzędzia zbiera dedykowana strona. `/kalkulator` jest osobną pozycją
w nawigacji głównej (Header) i w stopce.

---

## Sekcja: Analiza AI (homepage)

`AiReportSection` + `AiReportCard` - odwzorowanie raportu AI z aplikacji (`AIInsightsCard.tsx`
zasilany edge functionem `generate-financial-insights`, Gemini 2.5 Flash). Struktura i nazwy sekcji
są 1:1 z produktem: podsumowanie + cztery kafle liczb (Przychody / Wydatki / Oszczędności /
Stopa oszczędności), "Kluczowe spostrzeżenia" z typem `positive` / `warning`, "Rekomendacja"
z priorytetem i spodziewanym efektem.

Treść jest **przykładowa** - oznaczona plakietką "Przykładowy raport" i przypisem, że raport
powstaje z realnych transakcji po pełnym miesiącu. To celowe: realny użytkownik przez pierwsze
tygodnie nie ma danych, z których AI mogłoby cokolwiek policzyć, a landing nie może obiecywać
czegoś, czego produkt nie dowiezie w dniu rejestracji.

Kolory z systemu landingu, nie z aplikacji (appka używa tam niebieskiego, landing ma akcent limonkowy).

---

## Strony dodatkowe

| Strona | Ścieżka | Status |
|--------|---------|--------|
| O nas | `/[locale]/o-nas` | Done |
| Kontakt | `/[locale]/kontakt` | Done |
| Polityka prywatności | `/[locale]/polityka-prywatnosci` | Done |
| Regulamin | `/[locale]/regulamin` | Done (placeholder content) |
| Przejście do aplikacji | `/[locale]/start` | Done |
| 404 | `app/not-found.tsx` | Done |
| Strona features | `/features` | TBD |
| Cennik | `/pricing` | TBD |

---

## `/[locale]/start` — bramka do aplikacji

Dynamiczna (`force-dynamic`), `noindex`, poza sitemapą i poza layoutem Header/Footer. Cel jedynego wyjścia z landingu do produktu.

| Element | Opis |
|---------|------|
| Detekcja platformy | Serwer czyta `user-agent` (render bez migotania), klient doprecyzowuje `detectPlatformClient()` — łapie iPadOS 13+ podszywający się pod Maca |
| Targety | `APP_TARGETS` w `src/lib/appLinks.ts` — iOS / Android / web. Dziś wszystkie → `https://app.ourmoney.pl/`; flagi `STORE_AVAILABLE` sterują komunikatem "już wkrótce" |
| Plan | `?plan=premium` tylko z CTA Premium w cenniku; przenoszony dalej na URL aplikacji. Pozostałe CTA bez parametru |
| Redirect | `window.location.replace()` po 1200 ms + zawsze widoczny przycisk ręczny |
| Analytics | GA4 `app_open` (`platform`, `plan`, `locale`) |

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
