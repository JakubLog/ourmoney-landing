# Skill: /commit — Inteligentny Commit

> Sprawdź zmiany, opcjonalnie zaktualizuj context-map, stwórz commit.

---

## Flow

### 1. Sprawdź co się zmieniło
- `git diff --name-only` → lista zmienionych plików
- `git diff --staged` → co już staged

### 2. Oceń czy context-map wymaga aktualizacji

| Zmiana | Co aktualizować |
|--------|----------------|
| Nowa strona / sekcja | `pages.md` + INDEX.md Page Registry |
| Nowy event GA4 | `analytics.md` |
| Nowe pole Sanity / nowy typ | `cms-schema.md` |
| Nowy klucz i18n / namespace | `i18n.md` |
| Zmiana SEO (meta, schema.org) | `seo-strategy.md` |
| Nowy komponent design system | `design-system.md` |
| Decyzja architektoniczna | INDEX.md ADR |

Jeśli żadna z powyższych → pomiń aktualizację. Flaga `--no-context` wymusza pominięcie.

### 3. Aktualizacja context-map (jeśli potrzebna)
- Zaktualizuj relevantny plik w `ai-lib/context-map/`
- Dodaj wpis w Log Ostatnich Zmian w `INDEX.md`

### 4. Stage & Commit
- `git add [konkretne pliki]` — NIGDY `git add -A` ani `git add .`
- Conventional Commit via HEREDOC:

```bash
git commit -m "$(cat <<'EOF'
type(scope): description

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

### Typy commitów
| Typ | Kiedy |
|-----|-------|
| `feat` | Nowa strona, sekcja, funkcja |
| `content` | Zmiana treści CMS / tłumaczeń |
| `fix` | Naprawa bugu |
| `seo` | Meta, schema.org, sitemap, robots |
| `style` | Stylowanie, layout |
| `perf` | Optymalizacja wydajności |
| `refactor` | Refactoring bez zmiany zachowania |
| `docs` | Dokumentacja, context-map |
| `chore` | Deps, konfiguracja |

### Przykłady
```
feat(blog): add blog listing page with Sanity integration
content(homepage): update hero section copy (PL + EN)
seo(blog): add Article JSON-LD structured data
fix(i18n): fix missing EN keys in Navigation namespace
```

### 5. Weryfikacja
- `git status` → upewnij się że commit poszedł
- `git log --oneline -1` → pokaż commit

## Ważne
- NIGDY nie pushuj bez explicit prośby użytkownika
- NIGDY `git add -A` — staguj konkretne pliki
- ZAWSZE twórz NOWY commit (nie amend, chyba że user prosi)
- NIGDY nie commituj .env ani credentials

## Raport końcowy
```
## Commit Report
| Step | Status |
|------|--------|
| Context-map | Updated [pliki] / No update needed |
| Commit | type(scope): message [hash] |
```
