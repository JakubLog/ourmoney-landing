Wykonaj pełny audyt SEO projektu OurMoney Landing.

Przeczytaj `ai-lib/context-map/seo-strategy.md` przed rozpoczęciem.

## Checklist

### 1. Metadata API
- [ ] Każda strona ma `generateMetadata()` (nie brakuje żadnej w `app/[locale]/`)
- [ ] Tytuły: format `[Strona] | OurMoney`, max 60 znaków
- [ ] Descriptions: unikalne per strona, max 155 znaków
- [ ] `canonical` URL poprawny (https + locale prefix)
- [ ] OG image: 1200×630px, plik istnieje

### 2. hreflang / i18n
- [ ] `alternates.languages` obecne na każdej stronie (PL + EN)
- [ ] Brak orphan pages (każda EN ma PL i odwrotnie)
- [ ] Middleware poprawnie redirectuje `/` → `/pl`
- [ ] Slugi blog postów spójne między locale (lub tłumaczone)

### 3. Structured Data (JSON-LD)
- [ ] Strona główna: `Organization` + `WebSite`
- [ ] Blog posty: `Article` (headline, datePublished, author, image)
- [ ] FAQ sekcja (jeśli istnieje): `FAQPage`
- [ ] Walidacja: sprawdź przez Google Rich Results Test
- [ ] Brak błędów w JSON-LD (parsowanie, wymagane pola)

### 4. Sitemap
- [ ] `app/sitemap.ts` istnieje i zwraca poprawne URL-e
- [ ] Wszystkie publiczne strony w sitemapie (PL + EN wersje)
- [ ] Blog posty z `lastModified` z Sanity `_updatedAt`
- [ ] `priority` ustawione (1.0 homepage, 0.8 blog, 0.6 posty)
- [ ] Sanity Studio `/studio` NIE jest w sitemapie

### 5. robots.txt
- [ ] `app/robots.ts` istnieje
- [ ] `Allow: /` dla wszystkich botów
- [ ] `Disallow: /studio/`
- [ ] Link do sitemap obecny

### 6. AI SEO — llms.txt
- [ ] `public/llms.txt` istnieje
- [ ] Zawiera: opis produktu, kluczowe funkcje, linki
- [ ] Treść aktualna (odzwierciedla obecny stan produktu)
- [ ] Rozważyć `public/llms-full.txt` dla szczegółowych sekcji

### 7. Core Web Vitals
- [ ] `priority` prop na hero images (każda strona)
- [ ] Wszystkie `<Image>` z `width` + `height` (CLS = 0)
- [ ] Font przez `next/font` (nie CDN)
- [ ] GA4 raportuje Web Vitals (sprawdź `@/lib/analytics.ts`)
- [ ] Brak render-blocking scripts

### 8. Treść / Content SEO
- [ ] H1 na każdej stronie (dokładnie jeden)
- [ ] Hierarchia nagłówków: H1 → H2 → H3
- [ ] Blog posty: min 300 słów, slug bez polskich znaków
- [ ] Wewnętrzne linkowanie (blog posty linkują do siebie)
- [ ] Alt text na wszystkich obrazkach (z Sanity)

## Output
```
## SEO Audit Report — OurMoney Landing

| Kategoria | Status | Findings |
|-----------|--------|----------|
| Metadata API | OK/WARN/FAIL | ... |
| hreflang | OK/WARN/FAIL | ... |
| Structured Data | OK/WARN/FAIL | ... |
| Sitemap | OK/WARN/FAIL | ... |
| robots.txt | OK/WARN/FAIL | ... |
| AI SEO (llms.txt) | OK/WARN/FAIL | ... |
| Core Web Vitals | OK/WARN/FAIL | ... |
| Content SEO | OK/WARN/FAIL | ... |

Krytyczne do naprawy: [lista]
Rekomendacje: [lista]
```
