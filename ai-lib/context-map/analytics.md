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
- **Sitemap**: `https://ourmoney.app/sitemap.xml`
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

### Lokalizacje CTA (`cta_location`)

| Wartość | Gdzie |
|---------|-------|
| `header` | Przycisk w navbarze (desktop) |
| `header_mobile` | Przycisk w navbarze (mobile) |
| `hero` | Przycisk w sekcji Hero |
| `cta_banner` | Sekcja CTABanner (footer strony) |
| `article_mid` | CTA w połowie artykułu |
| `article_end` | CTA na końcu artykułu |

### User Properties

| Property | Wartość | Gdzie ustawiane |
|----------|---------|----------------|
| `locale` | `pl` / `en` | `LocaleTracker` przy każdej sesji |

---

## Implementacja — pliki

| Plik | Rola |
|------|------|
| `src/lib/analytics.ts` | Helpery: `trackCTAClick`, `trackLanguageSwitch`, `trackBlogPostRead` |
| `src/components/ui/TrackedCTALink.tsx` | Client component — `<a>` z onClick dla Server Components |
| `src/components/layout/LocaleTracker.tsx` | Ustawia user property `locale` przy mount |
| `src/components/blog/ReadingProgressBar.tsx` | Pasek postępu + event przy 75% |

---

## Konwersje (GA4)

> W GA4: Admin → Events → Mark as conversion

| Konwersja | Event | Uwagi |
|-----------|-------|-------|
| Klik CTA → app | `cta_click` | Oznacz jako konwersję |

---

## Privacy / GDPR

- Cookies GA4: `_ga`, `_ga_G-J6Z26RXMQY` — wymagana zgoda w EU
- Aktualnie brak cookie consent banneru — do rozważenia przy skalowaniu EU traffic

---

## Monitoring

| Narzędzie | Co monitorować | Częstość |
|-----------|---------------|---------|
| Google Search Console | Impressions, CTR, pozycje, błędy indeksowania | Tygodniowo |
| GA4 | Sessions, conversions, bounce rate, sources | Tygodniowo |
| PageSpeed Insights | Core Web Vitals per strona | Po deploymencie |

---

_Ostatnia aktualizacja: 2026-03-15_
