# Plan: Interaktywny kalkulator podziału wydatków

**Data**: 2026-07-25
**Status**: Zrealizowany 2026-08-01 (rozszerzony o sekcję na homepage - kalkulator jest teraz też lead magnetem pod reklamy TOF, nie tylko stroną SEO)

## Kontekst
Z audytu SEO (2026-07-25): landing nie ma widoczności na frazy long-tail, a SERP kategorii
okupują artykuły rankingowe. Kalkulator podziału wydatków to jednocześnie demo wartości
produktu bez rejestracji, magnes SEO i treść, którą użytkownicy podsyłają partnerowi.

## Cel
Sekcja/strona `/kalkulator`: użytkownik podaje dwa dochody i wspólne koszty,
widzi porównanie podziału 50/50 vs proporcjonalnego do dochodów + CTA do aplikacji.

## Zakres Zmian

### Pliki do utworzenia
- `src/app/[locale]/kalkulator/page.tsx` - strona z generateMetadata (target: "jak dzielić wydatki w związku przy różnych zarobkach")
- `src/components/sections/SplitCalculator.tsx` - client component (formularz + wynik, bez backendu)

### Pliki do modyfikacji
- `messages/pl.json` + `messages/en.json` - namespace `CalculatorPage` (parity!)
- `src/app/sitemap.ts` - nowy URL (PL+EN)
- `src/components/layout/Footer.tsx` - link do kalkulatora
- `public/llms.txt` - wzmianka o narzędziu

## Podejście Techniczne
- Czysty client-side (zero backendu), react-hook-form niepotrzebny - kilka pól number
- Wynik na żywo, wizualizacja proporcji (dwa paski / donut w kolorach brand)
- Styl: glass card na ciemnym tle (spójnie z Liquid Glass)
- GA4 event `calculator_used` (raz na sesję) + `cta_click` location=calculator

## Kolejność Implementacji
1. Komponent SplitCalculator z logiką i UI
2. Strona /kalkulator + metadata + JSON-LD (WebApplication lub HowTo)
3. i18n PL/EN
4. Sitemap, footer, llms.txt
5. Wpis na blogu linkujący do kalkulatora (content)

## SEO / i18n / CMS - Impact
- SEO: generateMetadata, hreflang + x-default, sitemap, JSON-LD
- i18n: nowy namespace `CalculatorPage`
- CMS: brak (treść statyczna w i18n)

## Context Map - Co zaktualizować
- [x] `pages.md` - nowa strona
- [x] `i18n.md` - nowy namespace
- [x] `analytics.md` - event calculator_used
- [x] `INDEX.md` - Page Registry + Log

## Odstępstwa od pierwotnego planu (2026-08-01)
- Komponent osadzony **też na homepage** (sekcja 3) - pierwotnie planowana była tylko strona `/kalkulator`
- Wizualizacja: donut zamiast dwóch pasków - geometria i kolory skopiowane 1:1 z `ProportionVisualizationScreen`
  w aplikacji, ale rysowane inline SVG (bez dociągania recharts na landing)
- Logika liczenia dopasowana do aplikacji: najpierw zaokrąglony procent, potem kwota
  (`partnerBalance.utils` liczy `total * sharePercent/100`) - inaczej landing pokazywałby inne liczby niż produkt
- Rdzeniem wyniku jest porównanie z podziałem 50/50, nie sama kwota - to jest moment "aha"
- Wpis na blogu linkujący do kalkulatora (krok 5) - **niezrobiony**, do zaplanowania osobno
