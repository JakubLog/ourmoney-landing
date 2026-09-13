# Plan: Redesign sekcji „Czy te wyzwania brzmią znajomo?" (PainPointsSection)

**Data**: 2026-09-13
**Status**: Done (2026-09-13; po review Opusa wdrożono F1–F4: `self-start` na dymce jasnej, karta `bg-surface-2`, marginesy linku `-mt-1 -mb-3`, `md:max-w-sm` na dymkach) — decyzje D1–D4 potwierdzone 2026-09-13 (D1: H2 zostaje pytaniem, D2: Agnieszka/Rafał + Anna/Mark, D3: ton ostrzejszy, D4: kotwica #kalkulator)
**Dokument towarzyszący**: [2026-09-13-audyt-sekcji-pain-points.md](2026-09-13-audyt-sekcji-pain-points.md) (pełny audyt UX/UI: diagnoza, 3 kierunki, spec, copy, metryki)

## Kontekst

`PainPointsSection` to pierwsza sekcja pod hero na stronie głównej (`src/app/[locale]/page.tsx:160`).
Dziś: eyebrow + H2 + lead + 3 pastelowe karty (tylko `h3` + akapit, kolor z tablicy `CARD_COLORS`,
bez ikon, bez elementu wizualnego, bez CTA). Audyt (Opus) i rekonesans techniczny (Sonnet) wykazały:

- **Martwa strefa wizualna** — jedyna sekcja homepage bez żadnego elementu graficznego, wciśnięta
  między hero ze zdjęciem a kalkulator z mockupem. Wygląda jak placeholder.
- **Narracja** — hero, H2 i wszystkie trzy `h3` to pięć pytań pod rząd bez jednej odpowiedzi;
  copy kart brzmi jak raport („brak transparentności prowadzi do nieufności"), nie jak marka.
- **Zmarnowany zawias** — karta „Kto powinien płacić za co?" sąsiaduje z sekcją, której H2 brzmi
  „Ile sprawiedliwie powinno płacić każde z Was?", a między nimi nie ma ani słowa łączącego.
- **Dostępność** — eyebrow `text-dark/40` na bieli = 2,3:1; opis `text-dark/60` na `--color-beige`
  = 4,26:1 (wymagane 4,5:1); `<ul class="list-none">` bez `role="list"` (Safari/VoiceOver gubi listę);
  brak `aria-labelledby` i `id`.
- **Bug uśpiony** — `CARD_COLORS[i]` bez modulo: czwarty item w `messages/*.json` = niewidzialna karta.
- **Rytm** — `md:grid-cols-3` ściska kartę do ~230 px już przy 768 px.
- **Zero pomiaru** — sekcja jako jedyna z kluczowych nie ma `data-section-view`
  (mają: features, pricing, faq, cta_banner, calculator_teaser).
- **Niespójność DS** — jedyna sekcja z `rounded-2xl` zamiast tokenu `rounded-card` / `rounded-panel`.

Ograniczenia twarde (z rekonesansu): brak biblioteki animacji (tylko CSS + `ScrollReveal`),
`reactCompiler: true`, plan Lighthouse mobile ≥ 90 (`2026-03-17-mobile-performance-90.md`),
brak testów jednostkowych — weryfikacja przez `lint`, `type-check`, `build` i QA wizualne.
Dev server projektu stoi zwykle na porcie **3001** (3000 zajmuje inny projekt).

## Cel

Sekcja ma wykonać pracę **rozpoznania i empatii** (nie dowodu): użytkownik widzi scenę z własnego
mieszkania, dostaje nazwę problemu i jednozdaniowy most do rozwiązania niżej na stronie.
Wskaźnik główny: `section_view(calculator_teaser) / section_view(pain_points)` **+5–10 p.p.**
vs baseline. Guard-rail: **zero regresji** LCP/CLS/TBT (spec zakłada 0 kB nowego JS, 0 obrazów).

## Wybrany kierunek: A — „Karty rozmowy"

Z trzech rozważonych kierunków (A dialog pary / B editorial + statystyki / C interaktywny wybór)
wybrano **A** z jednym elementem z B (most do kalkulatora). Uzasadnienie w audycie §4. W skrócie:

- B wymaga prawdziwych źródeł statystyk (ryzyko reputacyjne fintechu) i powiela kompozycję FeaturesSection.
- C dokłada wyspę kliencką pod hero, konkuruje z głównym CTA i przesuwa layout po interakcji.
- A: zero JS, zero obrazów, nowy kształt (dymki) zbudowany wyłącznie z istniejących tokenów,
  ciągłość narracji z BrandPromiseSection (ta sama para wraca dalej na stronie).

Każda karta: `h3` (twierdzenie, nie pytanie) → mikro-dialog dwóch osób (dwie dymki: jasna i ciemna)
→ jedno zdanie o koszcie. Pod siatką: jedno zdanie + link `#kalkulator` z ikoną `ArrowDown`.

## Decyzje do potwierdzenia przez właściciela

| # | Decyzja | Rekomendacja architekta |
|---|---------|-------------------------|
| **D1** | H2: zostawić „Czy te wyzwania brzmią znajomo?" czy zmienić na „Trzy rozmowy, które odkładacie na później" (propozycja audytu)? | **Zostawić pytanie w H2.** To rozpoznawalny hak sekcji, a dialogi w kartach są na nie odpowiedzią („tak, znajomo"). Efekt „pięciu pytań" znika już przez zamianę `h3` na twierdzenia. Zmienić tylko eyebrow („Znamy te rozmowy"). |
| **D2** | Imiona w dialogach: Agnieszka / Rafał (jak w BrandPromiseSection) i Anna / Mark w EN? | **Tak** — para przewodnia landingu. Imiona w `messages/*.json`, nie w kodzie. Osobny follow-up: wyprowadzić imiona z BrandPromiseSection do i18n (dziś EN pokazuje polskie treści). |
| **D3** | Ton dialogów: ostrzejszy („Nie wiem. Nie liczyłam.") czy łagodniejszy („Chyba nikt z nas tego nie liczy")? | **Ostrzejszy**, z zachowaną równowagą (po jednym zdaniu każdej osoby, nikt nie jest „tym złym"). |
| D4 | Cel mostu: kotwica `#kalkulator` (zostaje na stronie) czy `/kalkulator`? | Kotwica — zweryfikowano, że `id="kalkulator"` istnieje w CalculatorTeaserSection. Bez decyzji = kotwica. |

## Zakres Zmian

### Pliki do modyfikacji
- `src/components/sections/PainPointsSection.tsx` — pełna przebudowa karty, most, a11y, `data-section-view`, usunięcie `CARD_COLORS`
- `messages/pl.json` — `HomePage.painPoints`: nowa struktura (`dialogueLabel`, `items[].dialogue`, `bridgeLead`, `bridgeCta`) + nowe copy
- `messages/en.json` — parity 1:1
- `ai-lib/context-map/pages.md`, `analytics.md`, `i18n.md`, `design-system.md`, `INDEX.md` — po wdrożeniu

### Pliki do utworzenia
- brak (bez nowego komponentu klienckiego; dymka to markup w sekcji)

### Pliki, których NIE ruszamy
- Niezacommitowane zmiany w working tree: `HeroSection.tsx`, `CalculatorTeaserSection.tsx`,
  `CalculatorMockup.tsx` (nowy), `Header.tsx`, `.gitignore` oraz klucze `hero.socialProofShort`
  i `calculator.mockupLabel` w `messages/*.json`. Edycja `messages/*.json` musi być **punktowa**
  (tylko blok `painPoints`), bez przeformatowania reszty pliku.
- `--color-surface-cool` traci jedynego konsumenta — usunięcie z `@theme` w osobnym commicie sprzątającym.

## Podejście Techniczne

### Struktura komponentu (Server Component, bez dyrektywy use client)

```tsx
<section id="wyzwania" aria-labelledby="painpoints-title" data-section-view="pain_points"
         className="bg-white px-6 py-20 md:py-28">
  <div className="max-w-6xl mx-auto">
    <ScrollReveal className="text-center mb-12 md:mb-16">
      <p className="text-xs uppercase tracking-[0.2em] text-dark/60 mb-4">{t('eyebrow')}</p>
      <h2 id="painpoints-title" className="font-display text-4xl md:text-5xl lg:text-6xl text-dark leading-tight">{t('title')}</h2>
      <SectionLead className="mt-6">{t('subtitle')}</SectionLead>
    </ScrollReveal>

    <ul role="list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 list-none p-0 m-0">
      {items.map((item, i) => (
        <li key={item.title} className={i === 2 ? 'md:col-span-2 lg:col-span-1' : undefined}>
          <ScrollReveal delay={i * 90} className="h-full">
            <article className="h-full rounded-panel border border-dark/8 bg-surface p-6 md:p-8">
              <h3 className="text-lg md:text-xl font-medium text-dark leading-snug">{item.title}</h3>
              <figure className="mt-6 m-0 flex flex-col gap-2">
                <figcaption className="sr-only">{t('dialogueLabel')}</figcaption>
                {/* dymka 0: lewa, jasna: bg-white border border-dark/10 rounded-panel rounded-bl-none px-4 py-3 max-w-[88%] */}
                {/* dymka 1: prawa (self-end), ciemna: bg-dark text-white/90 rounded-panel rounded-br-none — w <ScrollReveal delay={i*90+180}> */}
                {/* nad każdą dymką: <p className="text-xs uppercase tracking-[0.1em] text-dark/60">{speaker}</p>, treść w <blockquote><p>…</p></blockquote> */}
              </figure>
              <p className="mt-6 text-sm leading-relaxed text-dark/70">{item.description}</p>
            </article>
          </ScrollReveal>
        </li>
      ))}
    </ul>

    <ScrollReveal delay={300} className="mt-12 md:mt-16 text-center">
      <p className="text-base text-dark/70">{t('bridgeLead')}</p>
      <a href="#kalkulator" className="mt-2 inline-flex items-center gap-2 py-3 -my-3 text-sm font-semibold text-accent-deep
         hover:underline underline-offset-4 decoration-2 focus-visible:outline-2 focus-visible:outline-offset-4
         focus-visible:outline-accent-deep rounded-card transition-colors duration-200">
        {t('bridgeCta')} <ArrowDown size={16} aria-hidden="true" />
      </a>
    </ScrollReveal>
  </div>
</section>
```

Kluczowe reguły (pełny spec: audyt §5):
- **Kolory tylko z tokenów**: `bg-surface`, `bg-dark`, `border-dark/8|10`, `text-accent-deep`
  (`--color-accent` ma 1,3:1 na bieli — nie na tekst ani focus ring). Jedno tło dla wszystkich kart.
- **Promienie z tokenów**: `rounded-panel` (24 px) dla kart i dymek, `rounded-card` na focus ringu linku.
  Ogonek dymki = jeden wyzerowany róg (`rounded-bl-none` / `rounded-br-none`), bez SVG i trójkątów.
- **Bez ikon w kartach** (HowItWorks ma ikony w rombach, BrandPromise w kółkach — trzecia sekcja
  z ikonami to katalog ikon). Jedyna ikona: `ArrowDown` w moście.
- **Karta nieklikalna → brak hovera na karcie.** Jedyny element interaktywny: link mostu (ostatni w DOM).
- **Motion**: wyłącznie istniejący `ScrollReveal` (stagger 90 ms, dymka-odpowiedź +180 ms, most 300 ms).
  Reduced-motion i degradacja mobile obsłużone przez komponent. Animowane tylko `opacity`/`transform` → CLS 0.
- **Spacing na siatce 8 px**, bez wartości arbitralnych; imiona `text-xs` (nie schodzić do `text-[10px]`).
- **Typ**: `PainItem` rozszerzony o `dialogue: { speaker: string; line: string }[]`.

### Nowa struktura i18n `HomePage.painPoints`

```jsonc
{
  "eyebrow": "…", "title": "…", "subtitle": "…",
  "dialogueLabel": "…",                      // NOWY, figcaption sr-only
  "items": [{ "title", "description", "dialogue": [{ "speaker", "line" }, { "speaker", "line" }] }],
  "bridgeLead": "…", "bridgeCta": "…"        // NOWE
}
```

### Copy PL (przy D1 = zostawić H2, D2 = Agnieszka/Rafał, D3 = ostrzejszy ton)

| Klucz | Treść |
|---|---|
| eyebrow | Znamy te rozmowy |
| title | Czy te wyzwania brzmią znajomo? *(bez zmian, D1)* |
| subtitle | Nierówne zarobki, wydatki ustalane w biegu, temat pieniędzy przekładany na weekend. Tak wygląda wspólny budżet domowy w większości związków — i tak zaczyna się większość kłótni. |
| dialogueLabel | Przykładowa rozmowa pary o wspólnych wydatkach |
| items[0].title | Płacicie po równo, choć zarabiacie różnie |
| items[0].dialogue | Agnieszka: „Zapłaciłam wczoraj za zakupy. Znowu." / Rafał: „A ja wziąłem czynsz i prąd. Chyba wychodzi na to samo?" |
| items[0].description | Po równo nie zawsze znaczy sprawiedliwie. Przy różnych zarobkach ten sam rachunek waży dla każdego z Was inaczej. |
| items[1].title | Rozmowa o pieniądzach kończy się kłótnią |
| items[1].dialogue | Rafał: „Ile w sumie wydaliśmy w tym miesiącu?" / Agnieszka: „Nie wiem. Nie liczyłam." |
| items[1].description | Kiedy żadne z Was nie ma pełnego obrazu, zostaje domysł. A domysł szybko zamienia się w zarzut. |
| items[2].title | Wspólne plany utknęły na „kiedyś" |
| items[2].dialogue | Agnieszka: „Zbieramy na wkład własny czy nie?" / Rafał: „Od czegoś trzeba by zacząć." |
| items[2].description | Mieszkanie, ślub, dziecko. Bez wspólnego licznika każdy plan zostaje w sferze rozmów. |
| bridgeLead | Pierwsza z tych rozmów ma konkretną odpowiedź. |
| bridgeCta | Policzcie sprawiedliwy podział |

### Copy EN

| Klucz | Treść |
|---|---|
| eyebrow | We know these conversations |
| title | Do these challenges sound familiar? *(bez zmian, D1)* |
| subtitle | Unequal incomes, spending decided on the fly, the money talk pushed to the weekend. That is what a shared household budget looks like in most relationships — and where most arguments start. |
| dialogueLabel | A sample conversation between partners about shared expenses |
| items[0].title | You split 50/50, but you don't earn 50/50 |
| items[0].dialogue | Anna: "I paid for the groceries yesterday. Again." / Mark: "And I covered rent and electricity. Roughly even, right?" |
| items[0].description | Equal is not always fair. When you earn differently, the same bill weighs differently on each of you. |
| items[1].title | Every money talk turns into an argument |
| items[1].dialogue | Mark: "How much did we actually spend this month?" / Anna: "No idea. I didn't count." |
| items[1].description | When neither of you has the full picture, all that is left is guessing. And guessing quickly turns into blame. |
| items[2].title | Your plans are stuck at "someday" |
| items[2].dialogue | Anna: "Are we saving for the deposit or not?" / Mark: "We'd have to start somewhere." |
| items[2].description | A flat, a wedding, a child. Without a shared counter, every plan stays a conversation. |
| bridgeLead | The first of those conversations has a concrete answer. |
| bridgeCta | Calculate a fair split |

Kolejność kart (podział → kłótnie → plany) jest celowa: karta 1 jest zawiasem do kalkulatora.
Zasady tonu: forma „Wy/Wasze", zero żargonu i straszenia, zbalansowane kwestie.

## Kolejność Implementacji (orkiestracja subagentów)

Architekt (sesja główna) trzyma decyzje, spina fazy i robi context-map + commit. Każda faza to osobny commit.

### Faza 0 — baseline i szybkie fixy (Sonnet, effort niski, ~15 min) — commit 1
Niezależna od D1–D3, do zrobienia od razu:
1. `data-section-view="pain_points"` na `<section>` (baseline pomiaru — im wcześniej, tym lepiej).
2. `id="wyzwania"`, `aria-labelledby`, `role="list"` na `<ul>`.
3. Kontrast: eyebrow `text-dark/40` → `/60`, opis `text-dark/60` → `/70`.
4. `key={i}` → `key={item.title}`, `rounded-2xl` → `rounded-panel`.
Weryfikacja: `npm run lint`, `npm run type-check`.

### Faza 1 — redesign (Sonnet, effort wysoki, ~2–3 h) — commit 2
Wejście: ten plan + audyt §5–6 + decyzje D1–D3. Zadania:
1. Przebudowa `PainPointsSection.tsx` wg struktury powyżej (RSC, bez nowego JS).
2. Punktowa edycja `messages/pl.json` i `messages/en.json` (tylko blok `painPoints`, parity 1:1, bez
   naruszania niezacommitowanych zmian w tych plikach).
3. Usunięcie `CARD_COLORS` i inline `style`.
4. `npm run lint && npm run type-check && npm run build` (uwaga: po ubitym dev serwerze może wymagać
   usunięcia `.next/dev/types`).
5. Screenshoty sekcji na 1440 / 768 / 390 px (dev na porcie 3001) — PL i EN.

### Faza 2 — review równoległy (2 agentów)
- **Opus, effort wysoki — review designu i a11y**: wierność specowi (tokeny, spacing, brak wartości
  arbitralnych, kontrasty ≥ 4,5:1), semantyka (`figure`/`blockquote`/`figcaption`, kolejność DOM),
  zgodność z `.claude/rules/*` (i18n, design system, anty-wzorce), ocena screenshotów. Wynik: lista
  poprawek z priorytetem, bez edycji plików.
- **Sonnet, effort średni — guard-rail wydajności**: `npx lighthouse` mobile na `/pl` przed i po
  (LCP, CLS, TBT); sprawdzenie, że bundle client nie urósł (brak nowych chunków); parity kluczy PL/EN
  (skryptowo, diff struktury JSON).
Poprawki z review wdraża Sonnet z Fazy 1 (kontynuacja tego samego agenta — ma kontekst).

### Faza 3 — domknięcie (architekt)
1. Aktualizacja context-map (lista niżej).
2. `/commit`.
3. Follow-upy jako osobne zadania: `role="list"` w FeaturesSection i HowItWorksSection;
   i18n dla zahardkodowanych treści BrandPromiseSection (Biedronka, kwoty, imiona, `alt`);
   usunięcie `--color-surface-cool` z `@theme`; opcjonalnie tracking mostu przez
   `trackCTAClick({ location: 'pain_points_bridge' })` — dopiero gdy baseline pokaże, że zasięg
   jest, a przejście dalej nie rośnie.

### Faza 4 — animacja „Messenger" (2026-09-13, Sonnet effort wysoki + review architekta)
Zamiast zagnieżdżonego `ScrollReveal` na dymce 2: client component `src/components/ui/ChatDialogue.tsx`
(fire-once, współdzielony IntersectionObserver, `chat--pending` → `chat--play` przez `classList`, bez setState
w efekcie) i blok CSS w `globals.css`: dymka 1 `chatPop` +200 ms → wskaźnik „pisze…" (3 kropki, `aria-hidden`,
`position:absolute` na górze slotu odpowiedzi, więc bez wpływu na layout) 650–1550 ms → dymka 2 `chatPop`
+1500 ms; `--chat-delay` = i × 120 ms. Reduced-motion: wszystko statyczne, wskaźnik `display:none`.
Dymki `rounded-card` (mniej „pigułkowe"), `gap-3` między wiadomościami. Odstępy kart/sekcji/mostu bez zmian
po przeglądzie screenshotów 390/768/1440 (Playwright na zainstalowanym Chrome — skrypt w scratchpadzie sesji).

### Faza 5 — spot-illustrations SVG (2026-09-13, Opus effort wysoki + review architekta)
Życzenie właściciela: „jakieś SVG tematyczne dla każdego kafelka". Zamiast ikon lucide w kółkach (katalog ikon)
trzy autorskie rysunki inline w `src/components/ui/PainPointIllustration.tsx` (viewBox 64, kreska `currentColor`
1.75, jeden akcent `--color-accent` z obrysem): waga z monetą na cięższej szalce, dwie rozminięte dymki z iskrą,
flaga celu na wzgórzu z przerywaną ścieżką. Trzy rundy iteracji na arkuszu 48/56/96/220 px. Umiejscowienie:
osobny wiersz nad `h3`, do prawej — wariant „obok h3" odrzucony po pomiarze (przy 1024 px każdy nagłówek łamał się
na 3 linie). Rozmiar podbity przez architekta z 48/56 do 64/80 px, bo przy 56 px rysunek ginął na tle dymek.
Mapowanie przez nowe pole `items[].kind` w `messages/*.json` (`split`/`argument`/`plans`), używane też jako `key`.

## Pomiar

Lejek na istniejących eventach (bez nowych):
`page_view(/)` → `section_view: pain_points` (nowy atrybut) → `section_view: calculator_teaser`
→ `calculator_used` → `cta_click / app_open`.
Test A/B niepolecany (za mały ruch); decyzja na baseline (2 tygodnie po Fazie 0) → after
+ obserwacja jakościowa (nagrania sesji, test 5-sekundowy na parach).

## SEO / i18n / CMS — Impact
- SEO: bez zmian meta/JSON-LD. Fraza „wspólny budżet domowy" zostaje w `subtitle`. Nowa kotwica
  `#wyzwania` jako cel linków wewnętrznych z bloga. H2 bez zmian (D1).
- i18n: zmiana struktury `HomePage.painPoints` (nowe klucze `dialogueLabel`, `items[].dialogue`,
  `bridgeLead`, `bridgeCta`); parity PL/EN obowiązkowa.
- CMS: brak — sekcja pozostaje w `messages/` (jak dotąd).

## Context Map — Co zaktualizować
- [ ] `pages.md` — opis sekcji Pain Points (karty rozmowy, most do `#kalkulator`, kotwica `#wyzwania`)
- [ ] `analytics.md` — nowy `section_view: pain_points`
- [ ] `i18n.md` — nowa struktura klucza `HomePage.painPoints`
- [ ] `design-system.md` — wzorzec „dymka dialogowa" (tokeny, wyzerowany róg jako ogonek)
- [ ] `INDEX.md` — Log Ostatnich Zmian (Faza 0 i Faza 1 osobno)
