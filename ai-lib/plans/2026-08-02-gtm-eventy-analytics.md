# Plan: Rozszerzenie eventów GTM/GA4 bez wpływu na performance

**Data**: 2026-08-02
**Status**: Zrealizowany (build + smoke test w przeglądarce OK)

---

## Kontekst

GTM (GTM-WTS9NS7J), GA4 (G-J6Z26RXMQY) i Meta Pixel są już wpięte w `app/[locale]/layout.tsx`
(wszystko `lazyOnload` + Consent Mode v2, domyślnie denied). Dotychczasowe eventy
(`cta_click`, `blog_post_read`, `language_switch`, `calculator_used`, `app_open`, Web Vitals)
idą przez `sendGAEvent` (gtag) — GTM ich **nie widzi** (triggery GTM reagują tylko na
obiektowe pushe `{event: ...}` do dataLayer, nie na komendy gtag).

## Cel

1. Nowe eventy o realnej wartości biznesowej (lejek, leady, consent rate, engagement).
2. Wszystkie eventy widoczne także dla triggerów GTM (→ Meta Pixel, Ads).
3. Zero wpływu na performance: bez nowych zależności, bez JS above-the-fold,
   jeden współdzielony listener + jeden IntersectionObserver.

## Nowe eventy

| Event | Trigger | Parametry | Wartość |
|-------|---------|-----------|---------|
| `contact_form_submit` | Submit formularza kontaktu (sukces/błąd) | `form_status`, `locale` | Lead — konwersja |
| `cookie_consent` | Klik Akceptuję/Odrzucam w bannerze | `choice`, `locale` | Consent rate — ile danych tracimy |
| `faq_open` | Otwarcie pytania FAQ (`<details>`) | `question`, `locale` | Jakie obiekcje mają użytkownicy |
| `share_click` | Kopiowanie linku artykułu | `post_slug`, `locale` | Który content ludzie polecają |
| `email_copy` | Kopiowanie adresu e-mail | `page`, `locale` | Intencja kontaktu poza formularzem |
| `calculator_mode_change` | Przełączenie trybu 50/50 ↔ proporcjonalny | `mode`, `placement`, `locale` | Głębokość użycia kalkulatora |
| `section_view` | Sekcja wchodzi w viewport (raz na pageview) | `section`, `locale` | Lejek scrollowania homepage |

Sekcje z `section_view`: `calculator_teaser`, `features`, `pricing`, `faq`, `cta_banner`.

## Architektura

- `src/lib/analytics.ts` — helper `pushEvent(name, params)`: `sendGAEvent` (GA4 direct)
  **+** `dataLayer.push({event: name, ...params})` (dla triggerów GTM). Wszystkie istniejące
  helpery migrują na `pushEvent`, nazwy eventów bez zmian.
- `src/components/layout/InteractionTracker.tsx` — NOWY client component w layout:
  - jeden delegowany listener `toggle` (capture) → `faq_open` z kontenerów `[data-track-faq]`
  - jeden IntersectionObserver dla `[data-section-view]`, re-scan przy zmianie pathname,
    fire-once per sekcja per pageview
- Sekcje dostają tylko atrybuty `data-section-view="..."` (server components, zero JS).
- Handlery w istniejących client components: ContactForm, CookieConsentBanner,
  ShareButton, CopyEmail, SplitCalculator.

## Uwaga — podwójne liczenie w GA4

Eventy idą do GA4 bezpośrednio (gtag). W kontenerze GTM **nie podpinać tagów GA4**
pod te eventy — używać ich tylko dla tagów nie-GA4 (Meta Pixel, Google Ads).

## Config po stronie GTM (ręcznie, bez kodu)

- Scroll depth 25/50/75% — natywny trigger GTM (nie dublować w kodzie).
- Meta Pixel `Lead` na `contact_form_submit` (form_status=success).
- Meta Pixel `InitiateCheckout`/custom na `app_open` (przejście do aplikacji).

## Context Map po implementacji

- [x] `analytics.md` — nowe eventy + architektura pushEvent
- [x] `INDEX.md` — log zmian
