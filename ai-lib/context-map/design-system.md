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
