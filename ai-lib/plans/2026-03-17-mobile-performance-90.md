# Plan: Mobile Performance Score > 90%

**Data**: 2026-03-17
**Status**: Draft

---

## Kontekst

Lighthouse mobile audit wykazał wynik Performance ~40%. Metryki wejściowe:

| Metryka | Aktualnie | Target |
|---------|-----------|--------|
| Performance Score | ~40% | >90% |
| FCP | 2.6s | <1.8s |
| LCP | 4.8s | <2.5s |
| TBT | 360ms | <200ms |
| Speed Index | 3.9s | <3.4s |

Projekt: Next.js 15 + Tailwind 4 + Sanity + next-intl + Framer Motion + Lenis.

---

## Cel

Osiągnięcie Lighthouse Performance Score ≥ 90 na mobile przy zachowaniu wszystkich animacji i funkcjonalności na desktopie. Dopuszczalne jest uproszczenie lub wyłączenie efektów na mobile.

---

## Analiza Przyczyn (Root Cause)

### LCP 4.8s — główny winowajca
- `hero-bg.webp` (349 KB) mimo `priority` może blokować LCP jeśli:
  - brak `fetchpriority="high"` na `<img>` (w Next.js 14+ `priority` = `fetchpriority="high"` ale wymaga weryfikacji)
  - render tree blokowany przez JS (Framer Motion, Lenis init)
  - zbyt duże obrazy dla viewportu mobilnego (brak mobilnego wariantu)

### TBT 360ms — za dużo JS na main thread
- **Lenis** (`lenis` 1.3 MB package) inicjalizowany natychmiast, tworzy `rAF` loop
- **Framer Motion** (duży bundle) ładowany dla animacji które na mobile są niewidoczne
- **ScrollReveal** — wiele IntersectionObserver instancji
- **AnimatedWord** — `setInterval` na hero
- **GA4 Consent Mode** + inicjalizacja przed interakcją użytkownika

### FCP 2.6s — blokowanie renderowania
- Fonty: 3x Switzer (variable) + Google Fonts (Instrument Serif + Inter Tight) = ~200KB
- JavaScript bundle blokujący hydration

### Speed Index 3.9s
- Zbyt wiele klientów i animacji inicjalizowanych przy ładowaniu

---

## Zakres Zmian

### Pliki do modyfikacji

**Priorytet 1 — LCP fix (natychmiastowy efekt)**
- `src/components/sections/HeroSection.tsx` — mobilny wariant obrazu, sizes, fetchpriority
- `src/app/[locale]/layout.tsx` — font optymalizacja, preconnect, preload hints
- `next.config.ts` — dodanie image optimization settings

**Priorytet 2 — TBT fix (największy wpływ)**
- `src/components/layout/SmoothScroll.tsx` — wyłączyć Lenis na mobile
- `src/components/sections/FeaturesSection.tsx` — dynamic import, redukcja JS
- `src/components/ui/ScrollReveal.tsx` — disable animacji na mobile lub simplify
- `src/components/ui/AnimatedWord.tsx` — CSS animation zamiast setInterval
- `src/app/[locale]/page.tsx` — dynamic imports dla below-fold sekcji

**Priorytet 3 — FCP fix**
- `src/app/[locale]/layout.tsx` — font subsetting, reduce weights
- Ewentualnie: usunięcie Instrument Serif jeśli używane marginalnie

**Priorytet 4 — bundle size**
- `src/components/sections/BrandPromiseSection.tsx` — CSS keyframes zamiast Framer Motion float
- `src/components/sections/TestimonialsSection.tsx` — sprawdzić czy Framer Motion konieczny
- `src/components/sections/FAQSection.tsx` — native `<details>` lub lekki accordion

### Pliki do utworzenia
- `src/hooks/useIsMobile.ts` — hook do SSR-safe detekcji mobile (matchMedia)

---

## Podejście Techniczne

### Strategia A — Mobile-First Simplification (REKOMENDOWANE)
Wyłącz/uprość ciężkie efekty na mobile, zachowaj na desktop. Użyj `useIsMobile()` lub CSS breakpointów.

```tsx
// Przykład: SmoothScroll
const isMobile = useIsMobile(); // matchMedia('(max-width: 768px)')
// Nie inicjalizuj Lenis na mobile → przeglądarka native scroll
```

### Strategia B — CSS-first animations
Zamień JS-driven animacje na CSS `@keyframes` + `animation`. Zero JS overhead.

```css
/* AnimatedWord — CSS approach */
@keyframes wordCycle {
  0%, 25% { content: "razem"; }
  33%, 58% { content: "mądrze"; }
  66%, 91% { content: "spokojnie"; }
}
```
*(uwaga: content zmiana wymaga innego podejścia — lepiej opacity + transform przez CSS)*

### Strategia C — Dynamic Imports
Heavy components ładuj tylko gdy wchodzą w viewport:

```tsx
const TestimonialsSection = dynamic(
  () => import('@/components/sections/TestimonialsSection'),
  { loading: () => <div className="h-96" />, ssr: false }
);
```

---

## Kolejność Implementacji

### Faza 1: LCP — cel: <2.5s (szacowany zysk: ~1.5-2s)

1. **Hero image — mobile variant**
   - Dodaj osobny obraz `hero-bg-mobile.webp` (max 600px width, ~80-120KB)
   - W `HeroSection.tsx`: `sizes="(max-width: 768px) 100vw, 50vw"` + `srcSet` dla mobile
   - Weryfikuj `fetchpriority="high"` przez DevTools
   - Rozważ `quality={85}` zamiast domyślnego 75 (paradoksalnie mniejszy plik przy kompresji AVIF)

2. **Preconnect/DNS prefetch w layout.tsx**
   ```tsx
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
   <link rel="dns-prefetch" href="https://cdn.sanity.io" />
   ```

3. **Przeanalizuj render-blocking** — uruchom Lighthouse z `--throttling` i sprawdź waterfall

### Faza 2: TBT — cel: <200ms (szacowany zysk: ~150-200ms)

4. **Wyłącz Lenis na mobile**
   ```tsx
   // src/hooks/useIsMobile.ts
   export function useIsMobile() {
     const [isMobile, setIsMobile] = useState(false);
     useEffect(() => {
       setIsMobile(window.matchMedia('(max-width: 768px)').matches);
     }, []);
     return isMobile;
   }

   // SmoothScroll.tsx
   const isMobile = useIsMobile();
   if (isMobile) return <>{children}</>; // Native scroll
   ```

5. **AnimatedWord → CSS animation**
   - Zmień z `setInterval` + React state na CSS `animation` z `@keyframes`
   - Kilka słów rotuje przez `animation-delay` + `opacity`/`clip-path`
   - Zero JS runtime overhead

6. **Dynamic imports below-fold** (priorytet: TestimonialsSection, BrandPromiseSection)
   ```tsx
   // page.tsx
   const TestimonialsSection = dynamic(() => import('@/components/sections/TestimonialsSection'));
   const BrandPromiseSection = dynamic(() => import('@/components/sections/BrandPromiseSection'));
   ```

7. **ScrollReveal — disable na mobile**
   - Na mobile: pokaż elementy natychmiast (bez delay), eliminuj IntersectionObserver
   - Zachowaj animacje na desktop

8. **Framer Motion — redukcja**
   - Zastąp `motion.div` z prostymi `float` animacjami → czysty CSS `@keyframes`
   - BrandPromiseSection: floating cards → CSS animation
   - Sprawdź czy Testimonials i FAQ używają FM; jeśli tak → migrate to CSS transitions

### Faza 3: FCP — cel: <1.8s (szacowany zysk: ~0.5-0.8s)

9. **Font optimization**
   - Usuń `Instrument Serif` jeśli używany tylko w 1-2 miejscach → zamień na systemowy serif lub Switzer
   - Ogranicz Switzer do 2 wag: `400` i `600` (usuń `500`)
   - Dodaj `display: 'swap'` na wszystkich fontach (weryfikacja)
   - Rozważ `preload: true` tylko dla najważniejszego fonta

10. **Critical CSS**
    - Upewnij się że above-the-fold style są inline (Next.js robi to automatycznie dla Tailwind)
    - Sprawdź czy żaden plugin CSS nie blokuje

### Faza 4: Bundle size audit

11. **Bundle analyzer**
    ```bash
    ANALYZE=true npm run build
    ```
    - Zainstaluj `@next/bundle-analyzer`
    - Zidentyfikuj największe chunki

12. **Tree-shaking Framer Motion**
    ```tsx
    // Importuj tylko potrzebne moduły
    import { motion } from 'framer-motion'; // zamiast całego pakietu
    // lub rozważ migrate do css-only gdzie możliwe
    ```

13. **Weryfikacja końcowa**
    - Lighthouse mobile (throttled 4G, CPU 4x slowdown)
    - WebPageTest mobile
    - Real device test (Android Chrome)

---

## Szacowane Efekty Każdej Fazy

| Faza | LCP | TBT | FCP | Score (est.) |
|------|-----|-----|-----|--------------|
| Start | 4.8s | 360ms | 2.6s | ~40% |
| Po Fazie 1 | ~3.0s | 360ms | 2.6s | ~55% |
| Po Fazie 2 | ~3.0s | ~150ms | 2.6s | ~70% |
| Po Fazie 3 | ~3.0s | ~150ms | ~1.8s | ~80% |
| Po Fazie 4 | ~2.2s | ~100ms | ~1.5s | ~90%+ |

---

## Ważne Decyzje Architektoniczne

### ADR-1: Lenis na mobile
**Decyzja**: Wyłącz Lenis na mobile (<768px). Native scroll jest wystarczający i eliminuje ~20-30ms TBT z rAF loop.
**Alternatywa**: CSS `scroll-behavior: smooth` jako replacement.

### ADR-2: Framer Motion
**Decyzja**: Nie usuwamy Framer Motion całkowicie (desktop korzysta z animacji), ale eliminujemy na mobile przez `useReducedMotion()` lub `isMobile` guard.

### ADR-3: AnimatedWord strategy
**Decyzja**: CSS `@keyframes` approach dla mobile, JavaScript approach zachowany dla desktop (lub migrate wszystkich do CSS).

### ADR-4: Hero image
**Decyzja**: Tworzymy mobilny wariant obrazu hero (mniejszy, zoptymalizowany pod 390px width). Nie zmieniamy desktop flow.

---

## SEO / i18n / CMS — Impact

- **SEO**: Brak zmian w meta tagach / JSON-LD. LCP poprawa = lepszy Core Web Vitals score w GSC.
- **i18n**: Brak nowych kluczy. Ewentualnie: aria-labels dla lazy-loaded sekcji.
- **CMS**: Brak zmian w Sanity. Revalidacja bez zmian.
- **Analytics**: Brak zmian w GA4 eventach.

---

## Context Map — Co zaktualizować po implementacji

- [ ] `INDEX.md` — Log Ostatnich Zmian (performance optimization)
- [ ] `design-system.md` — jeśli zmieni się podejście do animacji (CSS vs JS)
- [ ] `analytics.md` — jeśli dodamy Core Web Vitals reporting do GA4

---

## Risk & Mitigation

| Ryzyko | Prawdopodobieństwo | Mitigation |
|--------|-------------------|------------|
| Wizualne regresje animacji na mobile | Średnie | Testuj na realnym urządzeniu przed deplojem |
| Lenis wyłączony = brak smooth scroll na mobile | Niskie | Akceptowalny UX; dodaj CSS `scroll-behavior: smooth` |
| Dynamic imports powodują CLS (layout shift) | Średnie | Dodaj `min-height` placeholder dla lazy sekcji |
| Font change wpłynie na UX | Niskie | Testuj wizualnie przed usunięciem wagi |

---

_Ostatnia aktualizacja: 2026-03-17_
_Autor: Claude (na podstawie Lighthouse audit + code analysis)_
