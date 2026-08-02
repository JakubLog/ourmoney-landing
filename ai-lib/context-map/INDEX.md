# OurMoney Landing — Context Map

> Centralny rejestr wiedzy o projekcie landing. Czytaj ZAWSZE przed pracą.

---

## Page Registry

| # | Strona | Ścieżka | Status | Plik |
|---|--------|---------|--------|------|
| 1 | Strona główna | `/[locale]/` | Done | `src/app/[locale]/page.tsx` |
| 2 | O nas | `/[locale]/o-nas` | Done | `src/app/[locale]/o-nas/page.tsx` |
| 3 | Blog (lista) | `/[locale]/blog` | Done | `src/app/[locale]/blog/page.tsx` |
| 4 | Blog post | `/[locale]/blog/[slug]` | Done | `src/app/[locale]/blog/[slug]/page.tsx` |
| 5 | Kontakt | `/[locale]/kontakt` | Done | `src/app/[locale]/kontakt/page.tsx` |
| 6 | Polityka prywatności | `/[locale]/polityka-prywatnosci` | Done | `src/app/[locale]/polityka-prywatnosci/page.tsx` |
| 7 | Regulamin | `/[locale]/regulamin` | Done (placeholder) | `src/app/[locale]/regulamin/page.tsx` |
| 8 | Kalkulator podziału | `/[locale]/kalkulator` | Done | `src/app/[locale]/kalkulator/page.tsx` |
| 9 | Przejście do aplikacji | `/[locale]/start` | Done (dynamic, noindex) | `src/app/[locale]/start/page.tsx` |
| 10 | 404 | `not-found` | Done | `src/app/not-found.tsx` |
| 11 | Autor | `/[locale]/autor/[slug]` | Done | `src/app/[locale]/autor/[slug]/page.tsx` |
| 12 | Kategoria bloga | `/[locale]/blog/kategoria/[slug]` | Done | `src/app/[locale]/blog/kategoria/[slug]/page.tsx` |
| 13 | Generator OG | `/og?title=&subtitle=` | Done (route handler) | `src/app/og/route.tsx` |

Adresy publiczne EN różnią się od ścieżek wewnętrznych — patrz mapa `pathnames`
w [seo-strategy.md](seo-strategy.md).

_Uzupełniaj w miarę dodawania kolejnych stron._

---

## Context Map — Pliki

| Plik | Zawartość |
|------|-----------|
| [product-context.md](product-context.md) | Cel produktu, persony, value props, CTAs, tone of voice |
| [pages.md](pages.md) | Wszystkie strony, sekcje, hierarchia treści, status |
| [seo-strategy.md](seo-strategy.md) | Architektura SEO, słowa kluczowe, AI SEO, llms.txt |
| [cms-schema.md](cms-schema.md) | Sanity: typy treści, pola, GROQ queries |
| [i18n.md](i18n.md) | Namespace, klucze, konwencje PL/EN, status tłumaczeń |
| [analytics.md](analytics.md) | GA4: eventy, konwersje, GSC konfiguracja |
| [design-system.md](design-system.md) | Tokeny, komponenty, wzorce responsywności |
| [security-rules.md](security-rules.md) | CSP, headers, frontend security |

---

## Architectural Decisions (ADR)

| ADR | Decyzja | Data |
|-----|---------|------|
| ADR-001 | NextJS 15 App Router (nie Pages Router) — RSC domyślnie, minimalizacja client JS | 2026-03-14 |
| ADR-002 | Sanity v3 jako CMS (nie Strapi) — hosted, native NextJS integration, GROQ | 2026-03-14 |
| ADR-003 | next-intl dla i18n (PL + EN) — locale-based routing `/pl/`, `/en/` | 2026-03-14 |
| ADR-004 | Google Analytics 4 (nie PostHog) — landing nie zbiera PII, GA4 wystarczy | 2026-03-14 |
| ADR-005 | SEO-first architecture — generateMetadata(), JSON-LD, llms.txt, AI SEO | 2026-03-14 |
| ADR-006 | Sanity cache: `no-store` w dev, ISR `revalidate:3600` + `tags:['blog']` w prod + webhook `/api/revalidate` | 2026-03-15 |
| ADR-008 | Wszystkie CTA prowadzą do dynamicznej bramki `/[locale]/start`, nie bezpośrednio do `app.ourmoney.pl` — jedno miejsce na detekcję platformy, deep-linki i przeniesienie wybranego planu | 2026-08-02 |
| ADR-007 | PortableText renderowany przez `ArticlePortableText` (custom components) — nie domyślny prose Tailwind | 2026-03-15 |
| ADR-009 | Język przekazywany do aplikacji wyłącznie parametrem `?locale=pl|en` w query stringu — bez cookies, postMessage i wspólnego storage (różne domeny). Jedyne miejsce budowy: `withAppLocale()` w `src/lib/appLinks.ts` | 2026-08-02 |
| ADR-011 | Angielskie ścieżki URL przez `pathnames` w `defineRouting` (`/en/calculator`, `/en/about`, `/en/author/[slug]`, `/en/privacy-policy`, `/en/terms`, `/en/blog/category/[slug]`) zamiast polskich slugów pod `/en`. Adresy budowane wyłącznie przez `src/lib/urls.ts`; stare adresy mają 301 w `next.config.ts` | 2026-08-02 |
| ADR-012 | `proxy.ts` mieszka w `src/`, nie w katalogu głównym repo — projekt używa katalogu `src/`, więc Next szuka pliku tam. Wersja z rootu była po cichu ignorowana (`middleware-manifest.json` pusty): nie działała detekcja języka ani tracking AgentMonitor, a `/` → `/pl` pochodziło z `src/app/page.tsx`, co maskowało problem. Weryfikacja: build musi wypisać `ƒ Proxy (Middleware)` | 2026-08-02 |
| ADR-010 | Next.js 16 (Turbopack jako builder dev+prod), konwencja `proxy.ts` zamiast `middleware.ts` (runtime nodejs), ESLint flat config (`eslint.config.mjs`, skrypt `eslint .` — `next lint` usunięty z frameworka). Sanity podbite do v4 + next-sanity v11 (wymóg peer deps Next 16); świadomie BEZ `cacheComponents` i React Compiler — osobne decyzje | 2026-08-02 |

---

## Log Ostatnich Zmian

| Data | Zmiana | Dotknięty obszar |
|------|--------|-----------------|
| 2026-08-02 | Fix analytics: `pushEvent` przestaje używać `sendGAEvent` (@next/third-parties) — działa tylko z ich komponentem `<GoogleAnalytics>`, a gtag.js ładujemy ręcznie, więc customowe eventy po cichu NIE docierały do GA4 (tylko do dataLayer/GTM); teraz bezpośrednia komenda gtag (push `arguments` do dataLayer) + obiektowy push dla GTM | analytics |
| 2026-08-02 | Optymalizacje Next 16 faza 2: React Compiler on (`reactCompiler: true` + babel-plugin-react-compiler), Turbopack FS cache dev (`turbopackFileSystemCacheForDev`), refaktor 4 wzorców setState-in-effect (CookieConsentBanner i StartRedirect → `useSyncExternalStore`; CountUpValue i PriorityBadge → reset w callbacku IntersectionObserver), reguła `react-hooks/set-state-in-effect` wraca na error; `cacheComponents` przetestowane i ODRZUCONE (regresja SSG + brak wsparcia next-intl, rewizyta przy next-intl#1493) — plan `ai-lib/plans/2026-08-02-optymalizacje-next16-faza2.md` | architektura, tooling |
| 2026-08-02 | Upgrade Next.js 15.3→16.2.12 (React 19.2, next-intl 4.13, sanity 3→4.22, next-sanity 9→11, @next/third-parties 16): `middleware.ts`→`proxy.ts`, `revalidateTag(tag,'max')` w webhooku, `data-scroll-behavior="smooth"` na `<html>`, ESLint flat config + naprawy nowych reguł react-hooks v6 (ref w renderze w PageTransitionOverlay, samoreferencyjny useCallback w TestimonialsCarousel), `set-state-in-effect` zdegradowane do warn (4 legalne wzorce client-only sync); plan `ai-lib/plans/2026-08-02-nextjs-16-upgrade.md` | architektura, tooling |
| 2026-08-02 | Nowe eventy analytics: contact_form_submit, cookie_consent, faq_open, share_click, email_copy, calculator_mode_change, section_view; helper pushEvent (gtag + dataLayer.push dla triggerów GTM); InteractionTracker w layout (1 listener toggle + 1 IntersectionObserver, atrybuty data-section-view / data-track-faq); plan ai-lib/plans/2026-08-02-gtm-eventy-analytics.md | analytics |
| 2026-03-14 | Inicjalizacja Next.js 15 — wszystkie strony, komponenty, i18n PL+EN, Sanity schema | pages, i18n, cms-schema, seo |
| 2026-03-14 | Poprawka navbar: rgba(0,0,0,0.8) + blur, SVG logo, hero-bg.webp | design-system |
| 2026-03-14 | Inicjalizacja systemu ai-lib dla OurMoney Landing | dokumentacja |
| 2026-03-15 | Redesign bloga: dark theme, FeaturedPostCard + grid, abstract SVG placeholder | pages, design-system |
| 2026-03-15 | GA4 podłączone (G-J6Z26RXMQY): cta_click, language_switch, blog_post_read, locale user property | analytics |
| 2026-03-15 | Pełna implementacja bloga: [slug] page, Sanity translations, ArticlePortableText, ArticleCTA, ReadingProgressBar, ShareButton, AnimatedWord hero | pages, cms-schema, design-system, seo |
| 2026-03-15 | Sanity schemat blogPost rozszerzony: author/category ref, relatedFaq, aiSeo (TL;DR, keyTakeaways), cta object, seo.canonical/keywords | cms-schema |
| 2026-03-15 | BlogPage i18n rozszerzony: tldr, keyTakeaways, articleFaqTitle, langLabel, inArticleCta, backToBlog, authorSection, relatedPosts, shareArticle | i18n |
| 2026-03-15 | SEO blog post: JSON-LD Article+Person, BreadcrumbList, FAQPage (warunkowy), hreflang z _translations, AI SEO meta tags | seo |
| 2026-03-15 | Hero headline AnimatedWord: TABU→STRESU→KONFLIKTÓW→PROBLEMÓW→NAPIĘCIA (PL) | pages |
| 2026-08-02 | Sekcja aiReport: logo OurMoney zamiast ikony Sparkles, tytuł "Raport Agenta Finansowego", kaskadowy reveal każdego elementu karty, licznik kwot 0→wartość (CountUpValue), symulowana kwalifikacja priorytetu niski→średni→wysoki (PriorityBadge, klucz `HomePage.aiReport.priorityScale`) | pages, i18n, design-system |
| 2026-07-25 | Nowe screeny produktu (6 PNG) w public/app-screens; Features: podmiana na dodawaj-prosto-wydatki/wspolne-cele/koperty; hero: mockup telefonu (strona-glowna.png, xl+); FAQ +pytanie o instalację PWA (PL+EN, wchodzi do FAQPage JSON-LD); plany: kalkulator podziału + lead magnet (ai-lib/plans/2026-07-25-*) | pages, i18n, seo |
| 2026-07-25 | Homepage: unifikacja typografii H2 (font-display wszędzie), eyebrow w PainPoints, hero z kaskadowym wejściem (.hero-stagger), ScrollReveal z rootMargin -10% (wcześniejszy reveal przy Lenis), Testimonials przeniesione przed Comparison (social proof wyżej + naprawiony rytm teł) | pages, design-system |
| 2026-07-25 | Liquid Glass UI: klasy .glass/.glass-nav/.glass-light/.sheen w globals.css, Header jako floating glass pill, glass social proof w hero, cookie banner glass sheet, karty BrandPromise glass-light, CTABanner glass card z poświatą akcentu; fallbacki a11y (reduced-transparency/motion, @supports) | design-system |
| 2026-07-25 | Audyt SEO + poprawki: naprawa JSON-LD postów (logo, URL autora, breadcrumb), og:image na /blog /kontakt /o-nas, hreflang x-default wszędzie, sitemap +autorzy +_updatedAt, robots scalone reguły, scalony SoftwareApplication JSON-LD (aggregateRating w page.tsx), WebVitalsReporter→GA4, skrócony tytuł EN home, dłuższe meta desc kontaktu, keywords w hero, usunięte *-original.avif, wszystkie długie myślniki→"-" | seo, i18n, analytics, pages |
| 2026-07-26 | Features: realistyczny mockup iPhone 17 Pro Max (tytanowa ramka, Dynamic Island z kamerą, pasek statusu, przyciski boczne, home indicator, tło #f8f8f7 dopasowane do screenów); akordeon przebudowany na 5 itemów w nowej kolejności (pulpit, podział, zasady, moje-twoje-nasze, import z banku) z mapowaniem 1:1 na screeny; usunięty item "Wspólne cele finansowe" (PL+EN) | pages, i18n, design-system |
| 2026-08-01 | Kalkulator podziału wydatków: komponent `SplitCalculator` + `SplitDonut` (inline SVG, geometria i kolory 1:1 z onboardingiem aplikacji) + `MoneyInput`; strona `/kalkulator` (WebApplication + FAQPage + BreadcrumbList JSON-LD, hreflang) i sekcja na homepage między PainPoints a HowItWorks; logika liczenia zsynchronizowana z aplikacją (procent zaokrąglany przed kwotą); GA4 `calculator_used`; sitemap, footer, llms.txt | pages, i18n, analytics, seo, design-system |
| 2026-08-01 | Audyt design systemu (fonty / kolory / odstępy / 8px grid) - `ai-lib/plans/2026-08-01-audyt-design-system.md` | dokumentacja |
| 2026-08-01 | Wdrożenie audytu: Switzer jako jedyny font body (usunięty Inter Tight + wszystkie inline `fontFamily`), 121 klas z hexem → tokeny, nowe tokeny powierzchni (`surface`, `surface-2`, `surface-cool`, `screen`, `dark-3`, `accent-light`) i promieni (`rounded-card/panel/hero`), 44 klasy odstępu dociągnięte do siatki 8px (75% → 99%), `text-[10px]` → `text-xs`, `design-system.md` przepisany na realne wartości | design-system, pages |
| 2026-08-01 | Kalkulator: przełącznik zasady podziału (proporcjonalnie / po równo) zgodny z `SplitType` w aplikacji + nota o trybie `tracking`; donut naprawiony na orientację recharts (od godziny 3, przeciwnie do wskazówek); globalna reguła łamania tekstu (`balance` na nagłówkach, `pretty` na akapitach); klient Sanity działa bez `projectId` w dev (puste dane zamiast 500) | pages, i18n, design-system |
| 2026-08-01 | Kalkulator: rozbicie wspólnych wydatków na typowe kategorie (kwoty per osoba z liczb użytkownika, proporcje kategorii przykładowe) + linia rozliczenia "kto komu odda na koniec miesiąca" jako pomost do produktu; nowa sekcja `AiReportSection` na homepage po Features - struktura 1:1 z `AIInsightsCard` w aplikacji, treść oznaczona jako przykładowa | pages, i18n, design-system |
| 2026-08-02 | Kalkulator jako osobny punkt wejścia: `/kalkulator` w nawigacji głównej (Header, po "Strona główna"), homepage ma już tylko zajawkę `CalculatorTeaserSection` (dawne `SplitCalculatorSection`) z CTA do strony - koniec duplikacji narzędzia między `/` a `/kalkulator`; nowy klucz `HomePage.calculator.cta` (PL+EN); pasek nawigacji przeszedł na grid `1fr auto 1fr`, żeby linki stały na środku niezależnie od szerokości logo i CTA (kotwice linków dostały `inline-block` - jako inline z blokowym spanem rozdymały `<li>` do 68px i psuły centrowanie w osi Y) | pages, i18n, seo, design-system |
| 2026-08-02 | `/kalkulator` pod frazy: treść z 209 do ~750 słów (PL+EN), H2 "Jak dzielić wydatki w związku przy różnych zarobkach", nowa sekcja trzech modeli podziału (po równo / proporcjonalnie / własne proporcje) z H3, FAQ z 3 do 7 pytań w `h3` (wszystkie w FAQPage JSON-LD), link wewnętrzny do bloga, keyword anchor z homepage | pages, i18n, seo |
| 2026-08-02 | ComparisonSection: kolumna OurMoney wyróżniona pasmem `accent-deep/8` z zaokrągleniem i ciemną pigułką w nagłówku, fajki w tej kolumnie na ciemnym kółku; nowy token `--color-accent-deep` (#557300) dla zieleni na jasnym tle - `accent` na bieli ma 1.3:1, wariant deep 5.4:1; tabela na `border-separate` (promienie na komórkach) | design-system, pages |
| 2026-08-02 | Dynamiczna strona przejścia `/[locale]/start`: wszystkie CTA (hero, features, FAQ, CTABanner, header desktop+mobile, kalkulator, blog, cennik) linkują do bramki zamiast prosto do `app.ourmoney.pl`; detekcja platformy dwuetapowa (serwer z `user-agent` → klient doprecyzowuje iPadOS), osobne targety `APP_TARGETS` per iOS/Android/web (dziś wszystkie na PWA + komunikat "już wkrótce" ze store'ów, flagi `STORE_AVAILABLE`); CTA Premium w cenniku dokłada `?plan=premium`, wersja darmowa i pozostałe CTA nie; nowy event GA4 `app_open`; namespace `StartPage` (PL+EN), usunięty `Common.appUrl` — adres aplikacji przeniesiony do `src/lib/appLinks.ts`; `InvertDotButton`/`TrackedCTALink` otwierają linki wewnętrzne w tej samej karcie | pages, i18n, analytics, seo |
| 2026-08-02 | **Fix: `proxy.ts` przeniesiony z rootu do `src/`** — przy katalogu `src/` Next nie rejestrował middleware z rootu (`middleware-manifest.json` pusty), więc detekcja locale z `Accept-Language` i tracking AgentMonitor nie działały także na produkcji; przekierowanie `/` → `/pl` szło z `src/app/page.tsx` i maskowało problem. Build potwierdza `ƒ Proxy (Middleware)` | architektura |
| 2026-08-02 | Angielskie ścieżki URL (`pathnames` w `routing.ts`): `/en/calculator`, `/en/about`, `/en/contact`, `/en/author/[slug]`, `/en/privacy-policy`, `/en/terms`; nowy `src/lib/urls.ts` (`absoluteUrl`/`alternatesFor`/`ogImageUrl`) jako jedyne źródło adresów dla canonical, hreflang, JSON-LD i sitemapy; 301 ze starych adresów w `next.config.ts`; `Link` dla tras dynamicznych przechodzi na formę `{ pathname, params }`, przełącznik języka w Header używa `usePathname()` + `useParams()` | seo, architektura |
| 2026-08-02 | SEO homepage: eyebrow z frazą „Wspólny budżet domowy dla par" nad H1, subheadline podniesiony do `<h2>`, nazwy funkcji w akordeonie jako `<h3>` opakowujące `<button>`; `CalculatorPromo` w szablonie posta domyka brakujący link blog → `/kalkulator`. Sekcja z najnowszymi postami na homepage była zbudowana i **wycofana** — fetch z `revalidate: 3600` skracał okno regeneracji strony głównej z 24 h do 1 h | pages, i18n, seo |
| 2026-08-02 | Strony kategorii bloga `/blog/kategoria/[slug]` (EN `/blog/category/[slug]`) z `CollectionPage` + `BreadcrumbList`, pigułka kategorii w poście stała się linkiem; do sitemapy trafiają tylko kategorie z co najmniej jednym postem | pages, i18n, seo, cms-schema |
| 2026-08-02 | Dynamiczne OG images: `src/app/og/route.tsx` (poza `[locale]` i poza matcherem proxy, żeby adres nie zależał od slugów) podpięty pod `/kalkulator`, `/blog` i strony kategorii; `Organization` rozszerzone o description, email, contactPoint, founder; usunięty `aggregateRating` (self-serving reviews) wraz z osieroconym fetchem opinii na homepage; regulamin i polityka prywatności przestają być `noindex` i wchodzą do sitemapy | seo |
| 2026-08-02 | `llms.txt` i `llms-full.txt` uzupełnione o cennik i FAQ, dołożone wersje EN w `public/en/`; treści zaufania: „Szyfrowanie end-to-end" (opisane jako SSL/TLS) → „Szyfrowane połączenie"/TLS, rozbudowana odpowiedź FAQ o bezpieczeństwie na bazie twierdzeń już obecnych na stronie | seo, i18n |
| 2026-08-02 | Scalenie `BeforeAfterSection` z `ComparisonSection` w jedną sekcję (obie niosły ten sam argument); wydzielone `BeforeAfterCards` i `ScribbleWord` — sekcja zostaje serwerowa; akordeon funkcji: kliknięcie zatrzymuje autocykl na stałe (hover pauzował tylko na desktopie); pole `testimonial.context` + render pod imieniem w karuzeli | pages, design-system, cms-schema, i18n |
| 2026-08-02 | Przekazywanie języka do aplikacji: `withAppLocale()` dokleja `?locale=pl|en` (przez `URLSearchParams`, przed `#`, bez nadpisywania istniejących parametrów) do każdego linku na `app.ourmoney.pl` — bramka `/start`, CTA z Sanity (`ArticleCTA`), linki w treści artykułów (`ArticlePortableText`) i dwa odnośniki w regulaminie; `normalizeAppLocale()` tnie region (`en-US`→`en`) i sprowadza nieznane wartości do `pl`; linki do store'ów i adresy względne nietknięte (sprawdzany origin); `/start` przenosi dalej `utm_*`/`ref`/`gclid`/`fbclid`/`msclkid` (`pickForwardedParams()`), żeby redirect nie gubił atrybucji | pages, analytics, i18n |

---

_Ostatnia aktualizacja: 2026-08-02_
_Wersja: 1.0.0 — OurMoney Landing_
