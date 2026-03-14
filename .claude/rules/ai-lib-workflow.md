# AI-Lib Workflow Rules

> Reguły pracy z systemem ai-lib: plany, context-map, zarządzanie wiedzą.

---

## Reguła 1: Plany zawsze w `ai-lib/plans/`

Kiedy tworzysz plan implementacji (EnterPlanMode lub ręcznie):
- **ZAWSZE** zapisuj plan w `ai-lib/plans/YYYY-MM-DD-krotki-opis.md`
- Użyj szablonu z `ai-lib/plans/README.md`
- Plan jest częścią repozytorium i historii projektu

---

## Reguła 2: Konsultuj Context Map przed pracą

Przed rozpoczęciem implementacji:
1. Przeczytaj `ai-lib/context-map/INDEX.md` — przejrzyj rejestr stron i ostatnie zmiany
2. Przeczytaj relevantne pliki z `context-map/` — zrozum istniejący kontekst
3. Sprawdź czy istnieją powiązane plany w `ai-lib/plans/`

---

## Reguła 3: Aktualizuj Context Map po zmianach

Po zakończeniu implementacji która zmienia funkcjonalność projektu:

### Kiedy aktualizować:
- Dodanie nowej strony / sekcji → aktualizuj `pages.md` + wpis w INDEX.md
- Zmiana treści CMS → aktualizuj `cms-schema.md`
- Nowy event GA4 → aktualizuj `analytics.md`
- Zmiana SEO (meta, schema.org, sitemap) → aktualizuj `seo-strategy.md`
- Nowy klucz i18n / namespace → aktualizuj `i18n.md`
- Decyzja architektoniczna → dodaj ADR w INDEX.md

### Co aktualizować:
1. **INDEX.md** — Log Ostatnich Zmian (zawsze), Page Registry (jeśli nowa strona)
2. **Relevantny plik context-map** — dotknięty obszar

### Kiedy NIE aktualizować:
- Poprawka typo w kodzie lub treści
- Zmiana stylowania (kolory, spacing) bez wpływu na architekturę
- Refactoring który nie zmienia zachowania
- Aktualizacja dependencies (chyba że zmienia architekturę)

---

## Reguła 4: Skill `/commit` obsługuje aktualizacje

Używaj `/commit` zamiast ręcznego commitowania. Skill automatycznie:
1. Sprawdza co się zmieniło (git diff)
2. Ocenia czy context-map wymaga aktualizacji
3. Aktualizuje relevantne pliki context-map
4. Commituje zmiany z odpowiednim komunikatem

---

## Struktura ai-lib/ (płaska — bez podkatalogów)

```
ai-lib/
  context-map/
    INDEX.md              ← Główny spis: Page Registry, ADRs, log zmian
    product-context.md    ← Kontekst biznesowy, persony, value props, CTAs
    pages.md              ← Wszystkie strony i sekcje, hierarchia treści
    seo-strategy.md       ← Architektura SEO, słowa kluczowe, AI SEO
    cms-schema.md         ← Sanity: typy treści, pola, GROQ queries
    i18n.md               ← Namespace, klucze, konwencje PL/EN
    analytics.md          ← GA4: eventy, konwersje, GSC
    design-system.md      ← Tokeny, komponenty, wzorce responsywności
    security-rules.md     ← CSP, headers, frontend security
  plans/
    README.md             ← Konwencje i szablon
    YYYY-MM-DD-opis.md    ← Poszczególne plany
```

---

_Ostatnia aktualizacja: 2026-03-14_
_Wersja: 1.0.0 — OurMoney Landing_
