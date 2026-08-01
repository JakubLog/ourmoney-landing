# Audyt: fonty, odstępy, kolory + siatka 8px

**Data**: 2026-08-01
**Status**: Wdrożony 2026-08-01 (lokalnie, bez commita) - patrz sekcja 6 na końcu
**Zakres**: cały `src/` (43 pliki .tsx/.ts), `globals.css`

---

## TL;DR

| Obszar | Stan | Największy problem |
|--------|------|--------------------|
| Fonty | Rozjechany | Ten sam tekst UI ma inny krój na homepage niż na blogu/o-nas/kontakcie |
| Kolory | Rozjechany | 132 hardcoded hex duplikują istniejące tokeny; 8 wariantów jasnego tła |
| Odstępy | Blisko celu | 75% już na siatce 8px, 111 klas poza nią |
| Promienie | Brak skali | 4 arbitralne wartości obok skali Tailwind |

---

## 1. Fonty

### Co jest
Trzy rodziny krojów jednocześnie:

| Font | Skąd | Gdzie działa |
|------|------|--------------|
| Instrument Serif | `next/font/google` → `--font-display` | Nagłówki (43 użycia `font-display`) |
| Inter Tight | `next/font/google` → `--font-body` | `body` w globals.css |
| Switzer | self-hosted, 3× woff2 (~90 KB) | **tylko** inline na `<main>` homepage, /kalkulator, 404 |

### Problemy

**P0 - niespójność krojów między stronami.**
Switzer jest nakładany inline na `<main>`:
```tsx
<main style={{ fontFamily: '"Switzer", "Switzer Placeholder", sans-serif', fontWeight: 500 }}>
```
Mają to: homepage, /kalkulator, 404. **Nie mają**: /o-nas, /blog, /blog/[slug], /kontakt, /regulamin, /polityka-prywatnosci, /autor/[slug] - te renderują się w Inter Tight.
Efekt: użytkownik przechodzi z homepage na blog i tekst zmienia krój.

**P1 - inline style zamiast tokenu.** `font-body` użyte tylko 3× w całym kodzie, bo i tak jest nadpisywane inline'em. Token istnieje, ale jest martwy.

**P2 - `"Switzer Placeholder"`** w stacku fallback to śmieć po eksporcie z Figmy/Framera. Nic nie robi, wprowadza w błąd.

**P2 - skala poza systemem.** Obok 11 stopni `text-*` jest 8 wartości arbitralnych:
`text-[10px]` (4×), `text-[13px]`, `text-[2rem]`, `text-[2.5rem]`, `text-[5.25rem]` + dekoracyjne `text-[12rem]/[20rem]/[26rem]`.
`text-[10px]` jest poniżej progu czytelności - do podmiany na `text-xs` (12px).

**P2 - grubości.** `font-semibold` 33×, `font-medium` 18×, `font-bold` 3×. Bold to odstępstwo - albo wchodzi do systemu, albo znika.

### Decyzja do podjęcia
Jeden font body dla całego serwisu:
- **A) Switzer wszędzie** - ustawić `--font-body: "Switzer"` w `@theme`, usunąć wszystkie inline `fontFamily`. Zachowuje obecny wygląd homepage.
- **B) Inter Tight wszędzie** - usunąć inline'y i 3 pliki woff2 (~90 KB mniej, lepszy LCP). Zmienia wygląd homepage.

Rekomendacja: **A** - homepage jest twarzą marki i to jej wygląd trzeba zachować, a 90 KB przy `preload` + `font-display: swap` nie jest problemem.

---

## 2. Kolory

### Tokeny które już są (`globals.css` → `@theme`)
```
--color-accent: #bbff00    --color-dark:   #141414    --color-muted: #9c9c9c
--color-accent-dark: #a2e600    --color-dark-2: #1e1e1e    --color-beige: #e2dbd2
```

### Problem 1: 132 hardcoded hex duplikujące te tokeny

| Hex | Token | Wystąpień |
|-----|-------|-----------|
| `#141414` | `dark` | 67 |
| `#bbff00` | `accent` | 54 |
| `#e2dbd2` | `beige` | 5 |
| `#a2e600` | `accent-dark` | 4 |
| `#9c9c9c` | `muted` | 2 |

Reguła projektu (`design-system.md`): _"ZAWSZE używaj Tailwind semantic tokens, NIGDY hardcoded hex"_. Jest łamana w 14 plikach - najwięcej w `BlogPostCard.tsx` (31), `blog/[slug]/page.tsx` (28), `ArticlePortableText.tsx` (17), `kontakt/page.tsx` (13).

Zamiana jest mechaniczna i bezpieczna: `bg-[#141414]` → `bg-dark`, `text-[#bbff00]` → `text-accent`, `border-[#141414]/8` → `border-dark/8`.

### Problem 2: 8 różnych jasnych powierzchni, żadna nie ma tokenu
`#f8f8f7`, `#f7f5f2`, `#f7f7f7`, `#f0f0f0`, `#f5f0e8`, `#E6E1D9`, `#eeeceb`, `#e4e9f5`

Część z nich różni się o 1-2 punkty na kanał - nikt tego nie odróżni, a każda kolejna sekcja dokłada nowy odcień. Do zredukowania do 2-3 tokenów, np.:
```css
--color-surface:   #f7f5f2;  /* jasne tło sekcji (HowItWorks, BeforeAfter) */
--color-surface-2: #eeeceb;  /* karty na jasnym tle */
```

### Problem 3: 4 warianty czerni
`#141414` (token `dark`), `#1a1a1a` (4×), `#1c1c1e` (1×), `#1e1e1e` (token `dark-2`). Dwa środkowe do usunięcia.

### Problem 4: `#d4ff4d` (2×)
Jaśniejszy accent bez tokenu - jeśli to stan hover, powinien być `--color-accent-light`.

### Problem 5: dokumentacja rozjechana z kodem
`design-system.md` ma sekcje Kolory i Typografia jako **"TBD"**, a w przykładzie każe używać `--primary`, `--secondary`, `bg-primary`, `text-foreground` - zmiennych, których w tym projekcie **nie ma**. Ktoś kto to przeczyta, napisze kod, który nie zadziała.

---

## 3. Odstępy i siatka 8px

453 klasy odstępu (`p/m/gap/space`) w `src/`:

| Kategoria | Użyć | Udział |
|-----------|------|--------|
| Zgodne z 8px (8/16/24/32/40/48/56/64/80/96/112/128/144/160) | 342 | **75%** |
| Pół-kroku 4px (4/12/20/28) | 94 | 21% |
| Poza siatką 4px (2px, 6px, 14px) | 17 | 4% |

### Najczęstsze odchylenia

| Wartość | Użyć | Gdzie głównie | Propozycja |
|---------|------|---------------|------------|
| 12px (`-3`) | 43 | mikro-odstępy w kartach, ikony | zostaw jako mikro **lub** → 8px |
| 20px (`-5`) | 26 | **gapy siatek** (blog grid, ContactForm, autor), padding FAQ `py-5` | → **24px** (`-6`) |
| 4px (`-1`) | 18 | label ↔ wartość | zostaw jako mikro-krok |
| 28px (`-7`) | 7 | pojedyncze | → 24px lub 32px |
| 6px (`-1.5`) | 8 | - | → 8px |
| 2px (`-0.5`) | 7 | - | → 4px lub 0 |
| 14px (`-3.5`) | 2 | - | → 16px |
| `p-[9px]`, `p-[3px]` | 2 | arbitralne | → skala |

### Proponowana zasada do wpisania w design-system.md
> **Baza 8px.** Wszystkie odstępy layoutu (padding sekcji, padding kart, gapy siatek, marginesy między blokami) muszą być wielokrotnością 8.
> **4px dozwolone wyłącznie wewnątrz komponentu** - label ↔ wartość, ikona ↔ tekst. Nigdy między kartami ani jako padding kontenera.
> **2px, 6px, 14px, wartości arbitralne w px - zakazane.**

Przy tej zasadzie realne do poprawienia jest **~50 miejsc** (20px, 28px, 6px, 2px, 14px, arbitralne), a nie 111 - 12px i 4px zostają jako legalne mikro-kroki.

### Promienie - brak skali
`rounded-full` 44×, `rounded-2xl` 22×, `rounded-xl` 6×, `rounded-lg` 3×, `rounded-3xl` 1× + **4 arbitralne**: `rounded-[32px]`, `rounded-[40px]`, `rounded-[20px]`, `rounded-[18px]`.
Do ustalenia 3 stopnie + full, np. 16 / 24 / 32, i zmapowanie 18/20/40 na najbliższy.

---

## 4. Kolejność wdrożenia

| Priorytet | Zadanie | Efekt | Koszt |
|-----------|---------|-------|-------|
| **P0** | Jeden font body (decyzja A lub B) + usunięcie inline `fontFamily` | Koniec zmiany kroju między stronami | ~15 min |
| **P0** | 132 hardcoded hex → tokeny `dark`/`accent`/`beige`/`accent-dark`/`muted` | Zmiana koloru marki w 1 miejscu zamiast w 14 plikach | ~1 h |
| **P1** | Konsolidacja 8 jasnych teł → 2-3 tokeny; usunięcie `#1a1a1a`/`#1c1c1e` | Spójny rytm sekcji | ~1 h |
| **P1** | Siatka 8px: 20px→24px, 28px→24/32px, 6px/2px/14px→najbliższy | Przewidywalny rytm | ~1,5 h |
| **P2** | Skala promieni (3 stopnie + full) | - | ~30 min |
| **P2** | `text-[10px]`/`text-[13px]` → skala; decyzja o `font-bold` | Czytelność | ~20 min |
| **P2** | Przepisanie `design-system.md` (TBD → realne wartości, usunięcie fikcyjnych `--primary`) | Dokumentacja przestaje mylić | ~30 min |

**Uwaga do P0/P1**: to zmiany dotykające ~40 plików. Wchodzić osobnym commitem (albo osobno per priorytet), nigdy razem ze zmianą funkcjonalną - inaczej review jest niemożliwe.

---

## 5. Stan nowego kalkulatora

Komponenty dodane 2026-08-01 (`SplitCalculator`, `SplitCalculatorSection`, `MoneyInput`, `SplitDonut`, `/kalkulator`) trzymają się docelowych zasad:
- odstępy: 8/16/24/32/56/64 - wszystko na siatce 8px (jedyny 4px to `gap-1` label↔wartość, czyli legalny mikro-krok)
- kolory: tokeny `accent`/`dark`/`beige` + dwa hexy w `SplitDonut` (`#bbff00`, `#3f3f46`) świadomie skopiowane 1:1 z aplikacji, żeby wykres zgadzał się z produktem
- typografia: `font-display` na kwotach, skala `text-xs/sm/base/3xl` bez wartości arbitralnych

Wyjątek: `py-5` (20px) w wierszach FAQ na `/kalkulator` - skopiowane celowo z `FAQSection.tsx`, żeby oba akordeony wyglądały tak samo. Do zmiany razem z resztą w P1.


---

## 6. Wdrożenie (2026-08-01)

Wszystkie punkty P0-P2 zrobione lokalnie. Nie commitowane, nie wypchnięte.

| Punkt | Co zrobiono | Wynik |
|-------|-------------|-------|
| P0 fonty | Wariant A: Switzer jako `--font-body`, usunięty `Inter_Tight` z `next/font`, usunięte wszystkie inline `fontFamily` (3 pliki) | 0 inline fontów, jeden krój na całym serwisie |
| P0 kolory | 101 klas Tailwind z hexem → tokeny `dark`/`accent`/`beige`/`accent-dark`/`muted`/`dark-2` | - |
| P1 powierzchnie | Nowe tokeny: `surface`, `surface-2`, `surface-cool`, `screen`, `dark-3`, `accent-light`; 20 klas przemapowanych; scalone `#f7f7f7`+`#f5f0e8`→`surface`, `#E6E1D9`→`beige`, `#1c1c1e`→`dark-2` | 1 hex w klasach (rysunek telefonu) |
| P1 siatka 8px | 44 klasy poprawione (20→24, 28→32, 6→8, 14→16, 2→4) | **99% zgodności** (75% przed) |
| P2 promienie | Tokeny `rounded-card`/`panel`/`hero`; 4 wartości arbitralne przemapowane | Poświata w CTABanner została arbitralna - to promień koncentryczny, udokumentowany |
| P2 typografia | `text-[10px]` → `text-xs` (a11y) | `text-[13px]` zostaje - zegar w rysunku telefonu |
| P2 dokumentacja | `design-system.md` przepisany na realne wartości; usunięte fikcyjne `--primary`/`--foreground` i nieprawdziwa wzmianka o Shadcn/UI | - |

### Świadomie nietknięte
- **Rysunek telefonu** w `FeaturesSection` (ramka `p-[3px]`, bezel `p-[9px]`, pasek statusu `px-7`, `pb-1.5`, `ring-[#2c2c2e]`, `text-[13px]`) - to ilustracja sprzętu o własnych proporcjach, nie UI. Wciśnięcie jej w siatkę 8px zepsułoby realizm.
- **Optyczne wyrównanie ikon** (`mt-0.5` przy ikonach w `BeforeAfterSection` i na blogu) - korekta wzrokowa, nie odstęp.
- **Hexy w atrybutach SVG i gradientach** (`stopColor`, `stroke`, `radial-gradient`) - atrybuty SVG nie przyjmują tokenów Tailwind.
- **`SplitDonut`** - `#bbff00` / `#3f3f46` skopiowane z wykresu w aplikacji.

### Czego NIE dało się zweryfikować lokalnie
Strony zasilane z Sanity (`/o-nas`, `/blog`, `/blog/[slug]`, `/autor/[slug]`) zwracają 500 bez
`NEXT_PUBLIC_SANITY_PROJECT_ID`. Zmiana wagi `.article-prose` na 400 i nowy krój na blogu
**wymagają obejrzenia na preview Vercela** przed mergem. Zweryfikowane lokalnie: `/kalkulator`,
`/kontakt`, `/regulamin`, `/polityka-prywatnosci`, 404 oraz sekcje homepage bez CMS.
