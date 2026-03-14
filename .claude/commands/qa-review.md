Wykonaj QA review kodu projektu OurMoney Landing (Next.js 15 + Sanity + next-intl).

## Checklist

### 1. Architektura
- [ ] Pliki w poprawnych lokalizacjach (`app/`, `components/sections/`, `components/layout/`, `components/blog/`, `lib/`, `sanity/`)
- [ ] Importy przez `@/` alias (NIGDY relative `../../`)
- [ ] Komponenty <150 linii (split jeśli większe)
- [ ] Server Components domyślnie — `'use client'` tylko gdy konieczne
- [ ] Strony z `generateMetadata()` (każda strona)

### 2. TypeScript
- [ ] Zero `any` types (użyj `unknown` lub generowanych typów Sanity)
- [ ] Props = explicit interface
- [ ] Brak unused imports / variables
- [ ] Sanity types z `@/sanity/types` (wygenerowane, nie ręczne)

### 3. Styling
- [ ] Tailwind classes (NIGDY hardcoded hex)
- [ ] Mobile-first: bazowe = mobile, `md:` = desktop
- [ ] `cn()` dla conditional styles
- [ ] Shadcn/UI dla UI primitives
- [ ] `next/image` ZAWSZE (nigdy `<img>`)
- [ ] `width` + `height` lub `fill` na wszystkich obrazkach (CLS = 0)

### 4. SEO
- [ ] `generateMetadata()` na każdej stronie
- [ ] `alternates.languages` (hreflang PL + EN)
- [ ] JSON-LD structured data (strona główna, blog posty, FAQ)
- [ ] `priority` na hero images (Above The Fold)
- [ ] Alt text na wszystkich obrazkach (wymagane w Sanity schema)

### 5. i18n
- [ ] Zero hardcoded tekstu w komponentach (wszystko przez `t()`)
- [ ] Parity PL/EN w `messages/pl.json` i `messages/en.json`
- [ ] `getTranslations()` w Server Components, `useTranslations()` w Client
- [ ] `Link` z `@/i18n/navigation` (nie z `next/link` bezpośrednio)

### 6. CMS / Sanity
- [ ] GROQ queries z explicit projection (nie `*`)
- [ ] Queries w `sanity/lib/queries.ts` (nie inline)
- [ ] `revalidate` ustawione na fetch calls
- [ ] Obrazy przez `urlFor()` + `next/image`

### 7. Security
- [ ] Brak API keys w kodzie frontend
- [ ] `dangerouslySetInnerHTML` — tylko dla Sanity Portable Text z sanitizacją
- [ ] Error messages generyczne (nie ujawniają szczegółów)
- [ ] `/studio` zablokowane w robots.txt

### 8. Performance
- [ ] `npm run build` PASS (zero errors)
- [ ] `npm run lint` PASS
- [ ] Lazy loading dla ciężkich komponentów client-side
- [ ] Font przez `next/font` (nie CDN link)

## Output
```
## QA Review Report

| Kategoria | Status | Uwagi |
|-----------|--------|-------|
| Architektura | OK/WARN/FAIL | ... |
| TypeScript | OK/WARN/FAIL | ... |
| Styling | OK/WARN/FAIL | ... |
| SEO | OK/WARN/FAIL | ... |
| i18n | OK/WARN/FAIL | ... |
| CMS/Sanity | OK/WARN/FAIL | ... |
| Security | OK/WARN/FAIL | ... |
| Performance | OK/WARN/FAIL | ... |

Red Flags: [none / lista]
Rekomendacje: [lista]
```
