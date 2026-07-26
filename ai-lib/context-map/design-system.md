# Design System — OurMoney Landing

> Tokeny, komponenty, wzorce responsywności.
> Uzupełniaj w miarę budowania design systemu.

---

## Stack

- **Tailwind CSS 4.x** — utility-first CSS
- **Shadcn/UI** — Radix UI primitives + Tailwind styling
- **lucide-react** — ikony (tree-shakeable SVG)
- **next/font** — fonty bez layout shift

---

## Typografia

> Uzupełnij po wyborze fontów.

| Rola | Font | Weight | Użycie |
|------|------|--------|--------|
| Display / Nagłówki | TBD | TBD | H1, H2 |
| Body | TBD | 400, 500 | Tekst treści |
| UI | TBD | TBD | Przyciski, labels |

### Skala nagłówków (przykład Tailwind)
```
H1: text-4xl md:text-6xl font-bold
H2: text-3xl md:text-4xl font-semibold
H3: text-xl md:text-2xl font-semibold
Body: text-base md:text-lg
Small: text-sm
```

---

## Kolory

> Uzupełnij po ustaleniu palety kolorów.

Kolory definiowane przez Tailwind CSS v4 CSS variables w `globals.css`:

```css
:root {
  --primary: oklch(...);      /* Główny kolor marki */
  --primary-foreground: oklch(...);
  --secondary: oklch(...);
  --background: oklch(...);
  --foreground: oklch(...);
  --muted: oklch(...);
  --muted-foreground: oklch(...);
  --border: oklch(...);
}
```

**ZAWSZE** używaj Tailwind semantic tokens (`bg-primary`, `text-foreground`), **NIGDY** hardcoded hex.

---

## Komponenty

### Layout / Sekcje
| Komponent | Ścieżka | Opis |
|-----------|---------|------|
| `Header` | `components/layout/Header.tsx` | Nawigacja top |
| `Footer` | `components/layout/Footer.tsx` | Stopka |
| `Section` | `components/layout/Section.tsx` | Wrapper sekcji z padding |
| `Container` | `components/layout/Container.tsx` | Max-width wrapper |

### Sekcje strony głównej
| Komponent | Ścieżka | Status |
|-----------|---------|--------|
| `HeroSection` | `components/sections/HeroSection.tsx` | Planned |
| `FeaturesSection` | `components/sections/FeaturesSection.tsx` | Planned |
| `FAQSection` | `components/sections/FAQSection.tsx` | Planned |
| `CTASection` | `components/sections/CTASection.tsx` | Planned |

### Blog
| Komponent | Ścieżka | Status |
|-----------|---------|--------|
| `PostCard` | `components/blog/PostCard.tsx` | Planned |
| `PostContent` | `components/blog/PostContent.tsx` | Planned (Portable Text) |

### UI Primitives (Shadcn)
Instaluj przez: `npx shadcn@latest add [component]`
NIE edytuj plików w `components/ui/` ręcznie bez powodu.

---

## Liquid Glass (materiały szkła)

Wprowadzone 2026-07-25. Klasy w `globals.css`:

| Klasa | Użycie | Gdzie |
|-------|--------|-------|
| `.glass` | Szkło na ciemnym tle / nad zdjęciami | Hero social proof pill, CTABanner card |
| `.glass-nav` | Szkło z ciemnym tintem (gwarantowany kontrast białego tekstu) | Header (floating pill), CookieConsentBanner |
| `.glass-light` | Jasne szkło na jasnym tle / nad zdjęciami | Karty BrandPromise |
| `.sheen` | Błysk przesuwający się po CTA na hover | Przyciski CTA (hero, header, banner) |

### Zasady
- Szkło TYLKO na małych/fixed elementach - `backdrop-filter` jest drogi (Lenis + INP)
- Tekst na szkle: min. `text-white/80` (kontrast AA)
- Specular highlight: górna krawędź 1px jaśniejsza (`border-top-color`)
- Koncentryczne promienie: promień dziecka = promień rodzica - padding
- Białe sekcje (FAQ, artykuły) zostają czyste - bez szkła
- Fallbacki: `@supports not (backdrop-filter)` → solid bg; `prefers-reduced-transparency` → solid bg; `prefers-reduced-motion` → sheen/float wyłączone

### Header - floating pill (scroll-linked morph)
Transparent na górze → glass pill, morph sterowany zmienną CSS `--nav-p` (0..1, proporcjonalnie do scrolla 0-120px, ustawiana przez rAF w `Header.tsx`). Interpolowane: padding, max-width (100%→64rem), tint, blur, border, cień, wysokość (h-16→h-14). Klasy `.nav-shell` / `.nav-pill` / `.nav-row` w globals.css. Lenis wygładza scroll → morph jest płynny; krótki transition 0.18s dosmoothowuje otwarcie menu mobilnego (wymusza `--nav-p: 1`, `rounded-[28px]`). Tekst zawsze biały.

---

## Responsywność

### Breakpoints (Tailwind domyślne)
| Prefix | Min-width | Użycie |
|--------|-----------|--------|
| _(base)_ | 0px | Mobile (domyślne) |
| `sm:` | 640px | Duże mobile / małe tablet |
| `md:` | 768px | Tablet / desktop |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Szeroki desktop |

### Mobile-first — zasada
```tsx
// DOBRZE: mobile-first
<div className="px-4 md:px-8 lg:px-16">
  <h1 className="text-3xl md:text-5xl">

// ŹLE: desktop-first
<div className="px-16 md:px-8 sm:px-4">
```

### Touch targets
Interaktywne elementy (przyciski, linki): min `44×44px`
```tsx
<button className="min-h-[44px] min-w-[44px] px-6">
```

---

## Animacje

> Uzupełnij po ustaleniu strategii animacji.

- Biblioteka: TBD (Framer Motion / CSS transitions / @tailwindcss/animate)
- Zasada: animacje nie mogą powodować CLS
- Prefers-reduced-motion: ZAWSZE respektuj (`motion-reduce:` w Tailwind)

---

## Obrazy

| Zasada | Dlaczego |
|--------|---------|
| `next/image` zawsze | Optymalizacja, lazy loading, format WebP |
| Zawsze `width` + `height` | Eliminacja CLS |
| `priority` na hero | LCP optymalizacja |
| Alt text WYMAGANY | a11y + SEO |
| Format WebP/AVIF | Mniejszy rozmiar |

---

_Ostatnia aktualizacja: 2026-03-14_
