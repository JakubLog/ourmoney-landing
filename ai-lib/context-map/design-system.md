# Design System — OurMoney Landing

> Realne tokeny i zasady, zgodne z `src/app/globals.css`.
> Przepisane 2026-08-01 po audycie (`ai-lib/plans/2026-08-01-audyt-design-system.md`).

---

## Stack

- **Tailwind CSS 4.x** — tokeny w bloku `@theme` w `globals.css`, bez pliku `tailwind.config`
- **lucide-react** — ikony
- **next/font/google** — Instrument Serif
- **Self-hosted woff2** — Switzer (400/500/600) w `public/fonts/`, `preload` w layoucie

Shadcn/UI **nie jest używany** w landingu (jest w repo aplikacji). Komponenty w `src/components/ui/` są pisane ręcznie.

---

## Typografia

| Rola | Font | Zmienna | Waga | Użycie |
|------|------|---------|------|--------|
| Display / nagłówki | Instrument Serif | `--font-display` → `font-display` | 400 (normal + italic) | H1, H2, kwoty |
| Body / UI | Switzer | `--font-body` → `font-body` | 400 / 500 / 600 | Wszystko inne |

**Jeden font body na całym serwisie.** Switzer jest ustawiony na `body` w `globals.css`.
Nie nakładaj `style={{ fontFamily }}` na `<main>` ani nigdzie indziej — tak było przed 2026-08-01
i powodowało, że blog renderował się innym krojem niż strona główna.

**Wagi**: bazowa waga `body` to **500** (tak wygląda marka). Long-form (`.article-prose`) schodzi do **400**,
bo 500 męczy przy dłuższym czytaniu. `font-semibold` (600) na przyciskach i akcentach.

### Łamanie tekstu
Globalna reguła w `globals.css` - **nie dodawaj `text-balance` / `text-pretty` punktowo**:
- `h1-h6` → `text-wrap: balance` (nagłówki dzielą się na równe linie, żadnego samotnego słowa na końcu)
- `p, li, blockquote, figcaption` → `text-wrap: pretty` (brak sieroty w ostatniej linii akapitu)

Jeśli nagłówek ma się łamać wcześniej niż wynika z kontenera, ogranicz go `max-w-*` -
balansowanie zajmie się resztą.

### Skala
`text-xs` 12 · `text-sm` 14 · `text-base` 16 · `text-lg` 18 · `text-xl` 20 · `text-2xl` 24 ·
`text-3xl` 30 · `text-4xl` 36 · `text-5xl` 48 · `text-6xl` 60 · `text-7xl` 72

Wartości arbitralne (`text-[13px]`, `text-[10px]`) są **zakazane** w UI.
Wyjątek: rysunek telefonu w `FeaturesSection` (zegar 9:41 itd.) i dekoracyjne cyfry 404.

---

## Kolory

Wszystkie w `@theme` w `globals.css`. **Nigdy nie wpisuj hexa w komponencie** — użyj tokenu
(`bg-dark`, `text-accent`, `border-beige/40`). W inline `style` używaj `var(--color-*)`.

| Token | Wartość | Do czego |
|-------|---------|----------|
| `accent` | `#bbff00` | Kolor marki, CTA |
| `accent-dark` | `#a2e600` | Hover przycisków |
| `accent-light` | `#d4ff4d` | Jaśniejszy hover na ciemnym |
| `dark` | `#141414` | Tło ciemnych sekcji, tekst na jasnym |
| `dark-2` | `#1e1e1e` | Elementy na ciemnym tle |
| `dark-3` | `#1a1a1a` | Karty na ciemnym tle (blog) |
| `muted` | `#9c9c9c` | Tekst drugorzędny |
| `beige` | `#e2dbd2` | Ciepła karta (PainPoints), obramowania |
| `surface` | `#f7f5f2` | Jasne tło sekcji, boxy na blogu |
| `surface-2` | `#eeeceb` | Karty na jasnym tle, inline `code` |
| `surface-cool` | `#e4e9f5` | Chłodny wariant karty (PainPoints) |
| `cream` | `#f5f0e8` | Cieplejsze tło sekcji (`/o-nas`) |
| `sand` | `#e6e1d9` | Tło sekcji Testimonials |
| `screen` | `#f8f8f7` | Tło screenów produktu — **musi zgadzać się z PNG** w `public/app-screens/` |

Przezroczystości: `text-white/60`, `border-dark/10` itd. — zamiast kolejnych odcieni w palecie.

### Wyjątki (dozwolone hexy)
- `manifest.ts` i `metadata.other['theme-color']` — HTML wymaga literalnego hexa
- Gradienty i atrybuty SVG (`stopColor`, `stroke`) w `BlogPostCard`, `AuthorCard`, `not-found`
- `SplitDonut.tsx` — `#bbff00` i `#3f3f46` skopiowane 1:1 z wykresu w aplikacji (spójność z produktem)
- Rysunek telefonu w `FeaturesSection` (`ring-[#2c2c2e]`, `bg-neutral-*`) — to ilustracja sprzętu, nie UI

---

## Odstępy — siatka 8px

**Baza to 8px.** Wszystko co buduje layout — padding sekcji, padding kart, gapy siatek,
marginesy między blokami — jest wielokrotnością 8: `2` (8) · `4` (16) · `6` (24) · `8` (32) ·
`10` (40) · `12` (48) · `14` (56) · `16` (64) · `20` (80) · `28` (112).

**Wewnątrz komponentu** wolno zejść do 4px (`-1`) i 12px (`-3`) — np. label ↔ wartość, ikona ↔ tekst.

**Zakazane**: `-0.5` (2px), `-1.5` (6px), `-3.5` (14px), `-5` (20px), `-7` (28px)
oraz wartości arbitralne typu `p-[9px]`.

Jedyny dopuszczalny 2px to optyczne wyrównanie ikony do linii tekstu (`mt-0.5` przy ikonie) —
to korekta wzrokowa, nie odstęp.

Wyjątek całościowy: rysunek telefonu w `FeaturesSection` ma własne proporcje sprzętu
(ramka tytanowa `p-[3px]`, bezel `p-[9px]`, pasek statusu `px-7`) — siatka 8px go nie obowiązuje.

### Padding sekcji
```
Sekcja standardowa:  px-6 py-20 md:py-28
Sekcja z hero:       px-6 pt-36 pb-24     (miejsce na floating header)
```

---

## Promienie

| Token | Wartość | Użycie |
|-------|---------|--------|
| `rounded-card` | 16px | Karty, inputy, małe panele |
| `rounded-panel` | 24px | Większe panele, baner cookie |
| `rounded-hero` | 32px | Duże karty szkła (CTABanner, kalkulator) |
| `rounded-full` | — | Przyciski, pigułki, kropki |

**Promienie koncentryczne**: promień dziecka = promień rodzica − padding.
Tu wartość arbitralna jest poprawna, np. poświata w `CTABanner`: `rounded-[40px]` = 32 + inset 8.

---

## Liquid Glass (materiały szkła)

Wprowadzone 2026-07-25. Klasy w `globals.css`:

| Klasa | Użycie | Gdzie |
|-------|--------|-------|
| `.glass` | Szkło na ciemnym tle / nad zdjęciami | Hero social proof pill, CTABanner, karta kalkulatora |
| `.glass-nav` | Szkło z ciemnym tintem (kontrast białego tekstu) | Header, CookieConsentBanner |
| `.glass-light` | Jasne szkło na jasnym tle | Karty BrandPromise |
| `.sheen` | Błysk po CTA na hover | Przyciski CTA |

### Zasady
- Szkło TYLKO na małych/fixed elementach — `backdrop-filter` jest drogi (Lenis + INP)
- Tekst na szkle: min. `text-white/80`
- Specular highlight: górna krawędź 1px jaśniejsza (`border-top-color`)
- Białe sekcje (FAQ, artykuły) zostają czyste — bez szkła
- Fallbacki: `@supports not (backdrop-filter)`, `prefers-reduced-transparency`, `prefers-reduced-motion`

### Header — floating pill
Transparent na górze → glass pill, morph sterowany zmienną `--nav-p` (0..1, scroll 0-120px, rAF w `Header.tsx`).
Klasy `.nav-shell` / `.nav-pill` / `.nav-row`. Tekst zawsze biały.

---

## Responsywność

Breakpointy Tailwind: `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280.
Zawsze mobile-first (`px-4 md:px-8`, nie odwrotnie).
Touch targety min. `44×44px` (w praktyce `min-h-[56px]` na inputach — 56 jest na siatce).

---

## Animacje

- CSS + IntersectionObserver (`ScrollReveal`), Lenis do smooth scrolla. Bez Framer Motion.
- `ScrollReveal` na mobile upraszcza się do `fade-in`, respektuje `prefers-reduced-motion`
- Animacje nie mogą powodować CLS

---

## Obrazy

| Zasada | Dlaczego |
|--------|---------|
| `next/image` zawsze | Optymalizacja, lazy loading, WebP/AVIF |
| Zawsze `width` + `height` (lub `fill`) | Eliminacja CLS |
| `priority` na hero | LCP |
| Alt text WYMAGANY | a11y + SEO |

---

_Ostatnia aktualizacja: 2026-08-01_
