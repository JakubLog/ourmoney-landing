# Analytics — OurMoney Landing

> Google Analytics 4, Google Search Console, Web Vitals.

---

## Setup

### Google Analytics 4
- **Implementacja**: `@next/third-parties/google` (oficjalna biblioteka Next.js)
- **GA ID**: `G-XXXXXXXXXX` (uzupełnij po konfiguracji)
- **Gdzie**: `app/[locale]/layout.tsx`
- **IP anonymization**: WYMAGANE (`anonymize_ip: true`)
- **Cookie consent**: rozważyć przy EU traffic (GDPR)

```typescript
// app/[locale]/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}
```

### Google Search Console
- **Status**: Do konfiguracji po deploymencie
- **Weryfikacja**: DNS TXT record lub HTML file (Vercel: DNS preferowane)
- **Sitemap**: `https://ourmoney.app/sitemap.xml`

---

## Eventy GA4

> Uzupełniaj przy implementacji. GA4 automatycznie śledzi pageviews.

### Automatyczne (GA4 Enhanced Measurement)
- `page_view` — automatyczny
- `scroll` — scroll depth (>90%)
- `click` — zewnętrzne linki
- `session_start` — automatyczny

### Custom Events (do implementacji)

| Event | Trigger | Parametry |
|-------|---------|-----------|
| `cta_click` | Kliknięcie głównego CTA | `cta_location`, `cta_text`, `locale` |
| `blog_post_read` | Scroll >75% posta | `post_slug`, `post_category`, `locale` |
| `language_switch` | Zmiana języka PL/EN | `from_locale`, `to_locale` |
| `outbound_link` | Link do aplikacji / zewnętrzny | `url`, `location` |

### Implementacja custom events
```typescript
// lib/analytics.ts
export function trackCTAClick(location: string, text: string, locale: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'cta_click', {
      cta_location: location,
      cta_text: text,
      locale,
    });
  }
}
```

---

## Web Vitals Reporting

Opcjonalnie: raportuj Core Web Vitals do GA4.

```typescript
// app/[locale]/layout.tsx lub osobny komponent
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  });
}
```

---

## Konwersje (Google Ads / GA4)

> Uzupełnij jeśli uruchomione kampanie płatne.

| Konwersja | Event | Wartość |
|-----------|-------|---------|
| Rejestracja w app | `cta_click` + redirect do `/register` | TBD |

---

## Privacy / GDPR

- GA4 z `anonymize_ip: true` — minimalizacja danych
- Cookies GA4: `_ga`, `_ga_XXXXXXXX` — wymagana zgoda w EU
- Jeśli implementujesz cookie consent banner → inicjalizuj GA4 po zgodzie
- `@next/third-parties/google` obsługuje Partytown do offload do web worker (opcjonalne)

---

## Monitoring

| Narzędzie | Co monitorować | Częstość |
|-----------|---------------|---------|
| Google Search Console | Impressions, CTR, pozycje, błędy indeksowania | Tygodniowo |
| GA4 | Sessions, conversions, bounce rate, sources | Tygodniowo |
| Vercel Analytics | TTFB, Real Experience Score | Na bieżąco |
| PageSpeed Insights | Core Web Vitals per strona | Po deploymencie |

---

_Ostatnia aktualizacja: 2026-03-14_
