# Przekazywanie języka z landingu do aplikacji

**Data:** 2026-08-02
**Status:** Wdrożone
**Źródło:** `.claude/attachements/jezyki_landing_przekierowanie.md` (specyfikacja od strony aplikacji)

---

## Problem

Użytkownik czytający landing po angielsku trafiał do `app.ourmoney.pl` w wersji polskiej i musiał ręcznie przełączać język w ustawieniach. Aplikacja czyta język wyłącznie z parametru `locale` w query stringu — landing go nie dokładał (poza jednym miejscem: CTA z Sanity w artykułach bloga).

## Kontrakt z aplikacją

| Klucz | Wartości | Miejsce |
|-------|----------|---------|
| `locale` | `pl` \| `en` (lowercase) | query string URL-a aplikacji |

- Nieznana wartość → aplikacja robi fallback na `pl`.
- Parametr idzie do **query**, nigdy do hasha — aplikacja trzyma w `#` tokeny auth.
- Wartość bierzemy z locale landingu, nie z `navigator.language`.
- Wybór jest cache'owany w aplikacji (`localStorage`, klucz `i18nextLng`), więc `locale=pl` wysyłamy też jawnie — inaczej użytkownik raz zapisany jako `en` zostałby w EN mimo powrotu na polski landing.

## Rozwiązanie

Jedno źródło prawdy: `src/lib/appLinks.ts`.

| Funkcja | Rola |
|---------|------|
| `APP_ORIGIN` | `https://app.ourmoney.pl` — jedyna domena, do której doklejamy parametr |
| `normalizeAppLocale()` | `en-US` → `en`, `PL`/`english`/`""` → `pl` |
| `isAppUrl()` | porównanie originu; adresy względne i obce domeny → `false` |
| `withAppLocale()` | dokleja `?locale=` przez `URLSearchParams` — nie nadpisuje utm/ref, nie rusza hasha |
| `pickForwardedParams()` | wyciąga `utm_*`, `ref`, `gclid`, `fbclid`, `msclkid` z query `/start` |
| `buildAppUrl()` | target per platforma + atrybucja + `plan` + `locale` |

### Punkty styku z aplikacją

| Miejsce | Co się zmieniło |
|---------|-----------------|
| `/[locale]/start` (bramka) | `buildAppUrl()` zawsze ustawia `locale` (wcześniej pomijał `pl`); dokłada przeniesione `utm_*`/`ref`/… |
| `ArticleCTA` (CTA z Sanity) | lokalny `withLocaleParam` → wspólny `withAppLocale()` |
| `ArticlePortableText` | linki w treści artykułu niosą locale, jeśli prowadzą do aplikacji |
| `regulamin/page.tsx` | dwa odnośniki `app.ourmoney.pl` w tekście prawnym |

Store'y (App Store / Google Play) i linki względne zostają nietknięte — `withAppLocale()` sprawdza origin, więc gdy `APP_TARGETS.ios` zmieni się na deep-link do store'u, parametr sam przestanie się doklejać. To zgodne ze specyfikacją: aplikacja natywna bierze język z systemu.

### Poza specyfikacją: atrybucja przez redirect

Specyfikacja mówi „redirect gubiący `locale` = bug". Ta sama zasada dotyczy kampanii: wejście z reklamy prosto na `/pl/start?utm_source=fb` gubiło `utm_*` przy skoku do aplikacji. `pickForwardedParams()` przenosi je dalej.

## Weryfikacja

`normalizeAppLocale`: `en-US`→`en`, `pl-PL`→`pl`, `PL`→`pl`, `EN`→`en`, `english`→`pl`, `""`→`pl`.

`withAppLocale` (locale `en`):

| Wejście | Wyjście |
|---------|---------|
| `https://app.ourmoney.pl/welcome#token=abc` | `…/welcome?locale=en#token=abc` |
| `https://app.ourmoney.pl/privacy?utm_source=fb&utm_campaign=x` | `…&utm_campaign=x&locale=en` |
| `https://app.ourmoney.pl/?locale=pl` | `…/?locale=en` |
| `https://apps.apple.com/pl/app/ourmoney` | bez zmian |
| `/pl/kalkulator` | bez zmian |

Render (dev server):
- `/en/start?plan=premium&utm_source=fb&utm_campaign=x&ref=abc` → `https://app.ourmoney.pl/?utm_source=fb&utm_campaign=x&ref=abc&plan=premium&locale=en`
- `/pl/start` → `https://app.ourmoney.pl/?locale=pl`
- `/en/regulamin`, `/pl/regulamin` → odpowiednio `?locale=en` / `?locale=pl`

`npm run type-check` i `npm run build` — zielone.

### Do sprawdzenia po deployu (krok po stronie aplikacji)

1. Landing EN → dowolne CTA → w aplikacji DevTools → Application → Local Storage → `i18nextLng` = `en`.
2. Otwarcie `https://app.ourmoney.pl` bez parametru w nowej karcie — nadal EN.
3. To samo w drugą stronę: landing PL → `i18nextLng` = `pl`.
