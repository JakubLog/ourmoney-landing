Załaduj pełny kontekst projektu OurMoney Landing przed rozpoczęciem pracy.

1. Przeczytaj `ai-lib/context-map/INDEX.md` (Page Registry, ADRs, Log Zmian)
2. Przeczytaj `ai-lib/context-map/product-context.md` — cel produktu, persony, value props
3. Przeczytaj relevantne pliki z `ai-lib/context-map/` — te które dotyczą Twojej pracy:
   - Praca z treścią / CMS → `cms-schema.md`
   - Praca z SEO → `seo-strategy.md`
   - Praca z i18n / tłumaczeniami → `i18n.md`
   - Praca z analityką / GA4 → `analytics.md`
   - Praca z designem / komponentami → `design-system.md`
   - Praca z nową/istniejącą stroną → `pages.md`
4. Przeczytaj `ai-lib/context-map/security-rules.md` jeśli dotykasz formularzy / nagłówków HTTP / danych użytkownika
5. `git status --short` + `git log --oneline -5`

## Checklist przed kodowaniem
- [ ] Znam Page Registry (jakie strony istnieją, co jest planned)
- [ ] Rozumiem tech stack (NextJS 15, App Router, Sanity, next-intl)
- [ ] Wiem jakie pliki będę modyfikować
- [ ] Sprawdziłem reguły SEO jeśli dotykam meta / structured data
- [ ] Sprawdziłem reguły i18n jeśli dodaję tekst

Output:
> Primed. Context: [loaded files] | Branch: [nazwa] | Last: [hash] [msg]
> Ready.
