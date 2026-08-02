# Analytics — OurMoney Landing

> Google Analytics 4, Google Search Console, Web Vitals.

---

## Setup

### Google Analytics 4
- **Implementacja**: `@next/third-parties/google` (oficjalna biblioteka Next.js)
- **GA ID**: `G-J6Z26RXMQY`
- **Gdzie**: `app/[locale]/layout.tsx` — ładuje się tylko w `production`
- **User property**: `locale` ustawiane przez `LocaleTracker` przy każdej sesji

### Google Search Console
- **Status**: Do konfiguracji po deploymencie
- **Weryfikacja**: DNS TXT record lub HTML file (Vercel: DNS preferowane)
- **Sitemap**: `https://ourmoney.pl/sitemap.xml`
- **Kolejny krok**: Połącz z GA4 (Admin → Link with Search Console)

---

## Eventy GA4

### Automatyczne (GA4 Enhanced Measurement)
- `page_view` — automatyczny
- `scroll` — scroll depth (>90%)
- `click` — zewnętrzne linki
- `session_start` — automatyczny

### Custom Events (zaimplementowane)

| Event | Trigger | Parametry |
|-------|---------|-----------|
| `cta_click` | Kliknięcie CTA | `cta_location`, `cta_text`, `locale`, `post_slug?` |
| `blog_post_read` | Scroll ≥75% artykułu | `post_slug`, `locale` |
| `language_switch` | Zmiana języka PL/EN | `from_locale`, `to_locale` |
| `calculator_used` | Pierwsza zmiana pola w kalkulatorze (raz na sesję, guard w sessionStorage) | `locale`, `placement` (`homepage` / `calculator_page`) |
| `app_open` | Wejście na `/[locale]/start` — realne wyjście do aplikacji | `platform` (`ios`/`android`/`web`), `plan` (`premium`/`free`), `locale` |
| `contact_form_submit` | Submit formularza kontaktowego | `form_status` (`success`/`error`), `locale` |
| `cookie_consent` | Decyzja w bannerze cookies | `choice` (`granted`/`denied`), `locale` |
| `faq_open` | Otwarcie pytania FAQ (raz na pytanie na pageview) | `question`, `locale` |
| `share_click` | Kopiowanie linku artykułu (ShareButton) | `post_slug`, `locale` |
| `email_copy` | Kopiowanie adresu e-mail (CopyEmail) | `page` (pathname), `locale` |
| `calculator_mode_change` | Przełączenie trybu podziału 50/50 ↔ proporcjonalny | `mode`, `placement`, `locale` |
| `section_view` | Sekcja homepage wchodzi w viewport (raz na pageview; próg: górna krawędź mija 60% wysokości okna) | `section` (`calculator_teaser`/`features`/`pricing`/`faq`/`cta_banner`), `locale` |

### Lokalizacje CTA (`cta_location`)

| Wartość | Gdzie |
|---------|-------|
| `header` | Przycisk w navbarze (desktop) |
| `header_mobile` | Przycisk w navbarze (mobile) |
| `hero` | Przycisk w sekcji Hero |
| `cta_banner` | Sekcja CTABanner (footer strony) |
| `article_mid` | CTA w połowie artykułu |
| `calculator` | CTA pod kalkulatorem (homepage + /kalkulator) |
| `article_end` | CTA na końcu artykułu |
| `features` | CTA pod akordeonem funkcji |
| `faq` | CTA w kolumnie FAQ |
| `pricing_free` | CTA planu darmowego w cenniku (bez `?plan=`) |
| `pricing_premium` | CTA planu Premium w cenniku (dokłada `?plan=premium`) |

### User Properties

| Property | Wartość | Gdzie ustawiane |
|----------|---------|----------------|
| `locale` | `pl` / `en` | `LocaleTracker` przy każdej sesji |

---

## Implementacja — pliki

| Plik | Rola |
|------|------|
| `src/lib/analytics.ts` | Helpery `track*` + wewnętrzny `pushEvent`: każdy event idzie przez `sendGAEvent` (gtag → GA4) ORAZ `dataLayer.push({event})` (obiektowy push → triggery GTM/Meta). W kontenerze GTM NIE podpinać tagów GA4 pod te eventy — podwójne liczenie |
| `src/components/layout/InteractionTracker.tsx` | Globalny tracker w layout: delegowany listener `toggle` (capture) → `faq_open` z kontenerów `[data-track-faq]`; jeden IntersectionObserver → `section_view` z elementów `[data-section-view]`; re-scan przy zmianie pathname |
| `src/components/ui/TrackedCTALink.tsx` | Client component — `<a>` z onClick dla Server Components |
| `src/components/layout/LocaleTracker.tsx` | Ustawia user property `locale` przy mount |
| `src/components/blog/ReadingProgressBar.tsx` | Pasek postępu + event przy 75% |

### Deklaratywne atrybuty (server components, zero JS)

- `data-section-view="nazwa"` na `<section>` → event `section_view` (obecnie: PricingSection, CalculatorTeaserSection, FeaturesSection, FAQSection, CTABanner)
- `data-track-faq` na kontenerze akordeonu `<details>` → event `faq_open` (FAQSection)

### Konfiguracja po stronie GTM (ręcznie, bez kodu)

- Scroll depth 25/50/75% — natywny trigger GTM (nie dublować w kodzie)
- Meta Pixel `Lead` na `contact_form_submit` (`form_status=success`)
- Meta Pixel custom/`InitiateCheckout` na `app_open`

---

## Konwersje (GA4)

> W GA4: Admin → Events → Mark as conversion

| Konwersja | Event | Uwagi |
|-----------|-------|-------|
| Klik CTA → app | `cta_click` | Oznacz jako konwersję |
| Wyjście do aplikacji | `app_open` | Oznacz jako konwersję |
| Lead z formularza | `contact_form_submit` (form_status=success) | Oznacz jako konwersję |

---

## Privacy / GDPR

- Cookies GA4: `_ga`, `_ga_G-J6Z26RXMQY` — wymagana zgoda w EU
- Cookie consent banner wdrożony (`CookieConsentBanner` + Consent Mode v2, default denied); event `cookie_consent` mierzy consent rate (przy denied GA4 wysyła cookieless ping)

---

## Monitoring

| Narzędzie | Co monitorować | Częstość |
|-----------|---------------|---------|
| Google Search Console | Impressions, CTR, pozycje, błędy indeksowania | Tygodniowo |
| GA4 | Sessions, conversions, bounce rate, sources | Tygodniowo |
| PageSpeed Insights | Core Web Vitals per strona | Po deploymencie |

---

_Ostatnia aktualizacja: 2026-08-02_
