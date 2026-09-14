# Design-sync — notatki repo OurMoney Landing

- To aplikacja Next.js 15 (App Router), nie paczka biblioteczna — konwerter działa w trybie synth-entry ze `src/components`, bez `dist/`.
- 12 komponentów to React Server Components (importują `next-intl/server` / `@/sanity`): AiReportSection, BrandPromiseSection, CalculatorTeaserSection, ComparisonSection, CTABanner, FAQSection, HeroSection, PainPointsSection, PricingSection, TestimonialsSection, TrustSection, Footer. Nie renderują się w przeglądarce — wykluczone w `componentSrcMap`.
- Wykluczone też nie-wizualne utilsy: InteractionTracker, LocaleTracker, WebVitalsReporter, SmoothScroll, LazyPageTransition, StartRedirect.
- Tłumaczenia: komponenty klienckie czytają `useTranslations` — provider `DSProvider` (`.design-sync/provider-entry.tsx`, dodany przez `extraEntries`) opakowuje w `NextIntlClientProvider` z `src/messages/pl.json`.
- CSS: Tailwind 4 (`@theme` w `src/app/globals.css`). Brak skompilowanego CSS w repo — `buildCmd` kompiluje przez `@tailwindcss/cli@4` do `.design-sync/.cache/tailwind-compiled.css` (gitignored), na to wskazuje `cssEntry`. Przed re-syncem zawsze odpal `buildCmd`.
- Fonty: Switzer self-hosted (`public/fonts/*.woff2`, w `extraFonts`); Instrument Serif ładowany przez `next/font/google` — brak @font-face w CSS, do rozwiązania przy [FONT_MISSING].
- Komponenty używają `next/image` i `@/i18n/navigation` (next-intl Link) — potencjalne problemy renderu poza Next; obserwować w self-heal loop.
