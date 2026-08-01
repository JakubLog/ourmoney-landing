# Plan: Dynamiczna strona przejścia `/start`

**Data**: 2026-08-02
**Status**: Done

## Kontekst

Wszystkie CTA na landingu linkowały bezpośrednio do `https://app.ourmoney.pl/` (klucz `Common.appUrl`) z `target="_blank"`. Brakowało:
- rozpoznania urządzenia (Android / iOS / web) i osobnych targetów per platforma,
- miejsca na przyszłe deep-linki do App Store / Google Play,
- przeniesienia informacji o wybranym planie z cennika do aplikacji.

## Cel

Jeden punkt wyjścia z landingu do aplikacji: dynamiczna strona `/[locale]/start`, która w przeglądarce wykrywa typ urządzenia, przekierowuje na właściwy target i przenosi kontekst wyboru planu (`?plan=premium`).

## Zakres Zmian

### Pliki utworzone
- `src/lib/appLinks.ts` — single source of truth: targety per platforma, detekcja UA (server + client), `buildAppUrl()`, `startHref()`, `parsePlan()`
- `src/app/[locale]/start/page.tsx` — strona przejścia, `dynamic = 'force-dynamic'`, `robots: noindex`
- `src/components/start/StartRedirect.tsx` — client: doprecyzowanie platformy, GA4 `app_open`, redirect + ręczny fallback

### Pliki zmodyfikowane
- `src/components/ui/InvertDotButton.tsx`, `src/components/ui/TrackedCTALink.tsx` — linki wewnętrzne (`/…`) zostają w tej samej karcie, zewnętrzne dalej w nowej
- CTA przepięte na `startHref(locale)`: `HeroSection`, `CTABanner`, `FAQSection`, `FeaturesSection`, `PricingSection` (plan darmowy), `Header` (desktop + mobile), `SplitCalculator` (prop `appUrl` → `ctaHref`), `kalkulator/page.tsx`, `blog/[slug]/page.tsx`
- `PricingSection` — CTA Premium: `startHref(locale, 'premium')`
- `src/lib/analytics.ts` — `trackAppOpen({ platform, plan, locale })`
- `messages/pl.json`, `messages/en.json` — usunięty `Common.appUrl`, nowy namespace `StartPage`

## Podejście Techniczne

- **Detekcja dwuetapowa**: serwer czyta `user-agent` z `headers()` (stąd `force-dynamic`) i renderuje wstępny stan bez migotania; klient doprecyzowuje przez `detectPlatformClient()` — m.in. iPadOS 13+, który podaje się za Maca (`macintosh` + `maxTouchPoints > 1`).
- **Targety w jednym miejscu** (`APP_TARGETS`): dziś wszystkie trzy → `https://app.ourmoney.pl/`. Gdy ruszą store'y, podmieniamy wartości i flagi `STORE_AVAILABLE` — komunikat „już wkrótce" znika sam.
- **Plan tylko przy płatnym CTA**: `?plan=premium` dokładany wyłącznie przez CTA Premium w cenniku i przenoszony dalej na URL aplikacji. Wersja darmowa i pozostałe CTA nie mają parametru.
- **`window.location.replace()`** po 1200 ms — „wstecz" wraca na landing, nie zapętla przekierowania. Zawsze widoczny ręczny przycisk jako fallback.

## SEO / i18n / CMS — Impact

- **SEO**: `/start` z `robots: { index: false, follow: true }`, poza sitemapą. Bramka techniczna, nie treść.
- **i18n**: nowy namespace `StartPage` (PL + EN, parity zachowana). Usunięty `Common.appUrl` — adres aplikacji nie jest już treścią, tylko konfiguracją w `src/lib/appLinks.ts`.
- **Analytics**: nowy event GA4 `app_open` (`platform`, `plan`, `locale`) — mierzy realne wyjście do aplikacji, uzupełnia `cta_click`.
- **CMS**: bez zmian.

## TODO na później

- Podmienić `APP_TARGETS.ios` / `.android` na deep-linki lub adresy store'ów i przestawić `STORE_AVAILABLE` na `true`.
