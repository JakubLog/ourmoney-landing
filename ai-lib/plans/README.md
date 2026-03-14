# Plans — Konwencje i Szablon

> Plany implementacyjne dla OurMoney Landing.

---

## Konwencja nazewnictwa

```
YYYY-MM-DD-krotki-opis.md
```

Przykłady:
```
2026-03-14-nextjs-setup.md
2026-03-15-sanity-cms-setup.md
2026-03-20-homepage-hero-section.md
2026-04-01-blog-implementation.md
```

---

## Szablon planu

```markdown
# Plan: [Tytuł]

**Data**: YYYY-MM-DD
**Status**: Draft / In Progress / Done

## Kontekst
Dlaczego ten plan istnieje. Co go motywuje.

## Cel
Co chcemy osiągnąć po implementacji.

## Zakres Zmian

### Pliki do utworzenia
- `path/do/pliku.tsx` — opis

### Pliki do modyfikacji
- `path/do/pliku.ts` — co się zmienia

### Pliki do usunięcia
- (jeśli dotyczy)

## Podejście Techniczne
Jak to zrobimy. Kluczowe decyzje.

## Kolejność Implementacji
1. Krok pierwszy
2. Krok drugi
3. ...

## SEO / i18n / CMS — Impact
- SEO: co wymaga aktualizacji (generateMetadata, JSON-LD, sitemap)
- i18n: nowe klucze / namespace
- CMS: nowe/zmienione Sanity schematy

## Context Map — Co zaktualizować
- [ ] `pages.md` — nowe strony/sekcje
- [ ] `cms-schema.md` — zmiany schematu
- [ ] `i18n.md` — nowe namespace/klucze
- [ ] `analytics.md` — nowe eventy
- [ ] `INDEX.md` — Log Ostatnich Zmian
```

---

## Zasady

1. **Każdy nietrywialny task** powinien mieć plan przed implementacją
2. Plan jest **żywym dokumentem** — aktualizuj go w trakcie pracy jeśli się zmieni
3. Po zakończeniu implementacji plan pozostaje jako **dokumentacja historyczna**
4. Plany są **czytelne dla człowieka** — pisz jasno, bez zbędnego żargonu

---

_Ostatnia aktualizacja: 2026-03-14_
