# Sekcja "Cennik" na stronie głównej

**Data**: 2026-08-02
**Status**: Wdrożone
**Obszar**: pages, i18n, seo

---

## Cel

Pokazać, że OurMoney w podstawowej wersji jest darmowe i w pełni używalne na co dzień
(samemu albo w parze), a Premium zdejmuje konkretne, wyliczone limity. Sekcja ma zdejmować
obiekcję "ile to kosztuje" zanim użytkownik dojdzie do FAQ i CTA.

## Model cenowy

| Plan | Cena | Co obejmuje |
|------|------|-------------|
| Darmowy | 0 zł, na zawsze, bez karty | Nielimitowane wydatki i przychody, podział (po równo / proporcjonalnie / moje-twoje-nasze), wspólne cele i koperty, drugi użytkownik |
| Premium | 39,99 zł/mies. albo 399,99 zł/rok | Wszystko powyżej bez limitów + analiza AI, integracja z bankiem |

Rok = 399,99 zł ≈ 10 × 39,99 zł, czyli **2 miesiące gratis** (oszczędność 79,89 zł względem 12 × 39,99 = 479,88 zł).

### Limity planu darmowego (komunikowane wprost)
- ograniczona liczba własnych kategorii
- skrócona historia transakcji
- brak analizy AI
- 1 import z banku miesięcznie
- do 5 skanów paragonu miesięcznie
- brak integracji z bankiem

## Zakres wdrożenia

1. `PricingSection` — server component, dwie karty (darmowa jasna, Premium ciemna z akcentem).
   Bez przełącznika mies./rok: obie ceny są widoczne naraz, dzięki czemu sekcja zostaje
   w całości po stronie serwera (zero client JS, zgodnie z regułami projektu).
2. Umiejscowienie: między `TrustSection` a `FAQSection` (`#cennik`, `bg-surface`).
   Kolejność: dowód społeczny → porównanie z alternatywami → bezpieczeństwo → **cena** → FAQ → CTA.
3. i18n `HomePage.pricing` (PL + EN).
4. JSON-LD `SoftwareApplication.offers` — z jednej oferty `price: 0` na trzy
   (darmowa, Premium miesięcznie, Premium rocznie).
5. **Poprawka spójności**: odpowiedź FAQ "Czy aplikacja jest darmowa?" mówiła
   "w pełni bezpłatna - bez karty, bez limitu. Gdy wprowadzimy płatne plany..." — to
   sprzeczne z sekcją cennika i wchodziło do `FAQPage` JSON-LD. Przepisane na opis
   dwóch planów (PL + EN).

## Świadome decyzje

- **Bez osobnej strony `/cennik`** — cennik to dwa plany i kilkanaście linijek treści;
  osobna strona duplikowałaby sekcję i rozcieńczała sygnał SEO strony głównej.
  Jeśli plany się rozrosną (trzeci plan, rozliczenie zespołowe), wtedy `/cennik`
  wzorem `/kalkulator`.
- **CTA obu planów prowadzi do aplikacji** — na landingu nie ma checkoutu, płatność
  włącza się w produkcie. GA4 rozróżnia je przez `cta_location`: `pricing_free` / `pricing_premium`.
- **Limity nazwane wprost**, a nie jako "i wiele więcej" — para, która trafia na limit
  po tygodniu używania, zapamiętuje to gorzej niż para, która wiedziała o nim od początku.
