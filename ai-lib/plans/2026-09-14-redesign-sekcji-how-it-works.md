# Plan: Redesign sekcji „Zacznij w 3 prostych krokach" (HowItWorksSection)

**Data**: 2026-09-14
**Status**: In Progress (rewizja układu)
**Autor**: projektant UI/UX + frontend architekt (Opus), kierunek ustalony przez architekta sesji
**Poprzednik metodologiczny**: [2026-09-13-redesign-sekcji-pain-points.md](2026-09-13-redesign-sekcji-pain-points.md)
(ta sama rodzina rysunku, ten sam sposób pracy z tokenami i i18n)

---

## Kontekst

`HowItWorksSection` (`src/components/sections/HowItWorksSection.tsx`) to czwarta sekcja strony
głównej (`src/app/[locale]/page.tsx:179`), między ciemną zajawką kalkulatora a `FeaturesSection`.
Dziś: nagłówek z `ScribbleWord`, lead i trzy statyczne kolumny (romb z ikoną lucide → duża cyfra
`01/02/03` → `h3` → akapit) spięte poziomą linią gradientową.

Diagnoza UX:

- **Sekcja niczego nie pokazuje.** Trzy ikony lucide (`UserPlus`, `ListChecks`, `Target`) to
  najbardziej generyczny możliwy sygnał — ten sam zestaw znaczy „rejestracja / lista / cel"
  w dowolnym SaaS. Sekcja o nazwie „jak to działa" nie pokazuje ani jednego fragmentu produktu.
- **Cała animacja siedzi w hoverze**, którego nie ma na mobile (60–70% ruchu). Na telefonie sekcja
  jest w pełni statyczna: trzy bloki tekstu jeden pod drugim, ~900 px scrolla bez zdarzenia.
- **Hierarchia jest odwrócona.** `text-6xl` na cyfrze `01` przy `text-lg` na tytule kroku — największym
  elementem kroku jest numer porządkowy, czyli informacja o najmniejszej wartości.
- **Kontrast poniżej progu.** `text-dark/10` na cyfrach (1,1:1) i `text-dark/60` na opisach
  na tle `--color-surface` (4,26:1, wymagane 4,5:1) — ten sam błąd, który 2026-09-13 poprawiano
  w PainPoints. Ikona `text-dark/60` w rombie na białym również ląduje pod progiem dla grafiki.
- **Brak CTA.** Sekcja kończy się trzecim akapitem. Użytkownik właśnie przeczytał „to zajmuje
  30 sekund" i nie dostaje niczego do kliknięcia — najbliższe CTA jest dwie sekcje niżej
  (`FeaturesSection`). To najdroższy pojedynczy błąd tej sekcji.
- **Zero pomiaru.** Brak `data-section-view`, brak `id`, brak `aria-labelledby` — sekcja nie
  istnieje w lejku GA4 (mają go: pain_points, calculator_teaser, features, pricing, faq, cta_banner).
- **Spójność.** `rounded-2xl` zamiast tokenu, inline `style` z `rgba(20,20,20,0.1)` zamiast tokenu,
  `<ol>` bez `role="list"` (Safari + VoiceOver gubi listę przy `list-style: none`).

Ograniczenia twarde (bez zmian od 2026-09-13): brak biblioteki animacji (CSS + `ScrollReveal`),
`reactCompiler: true`, reguła `react-hooks/set-state-in-effect` = **error**, plan Lighthouse
mobile ≥ 90, brak testów jednostkowych (weryfikacja: `lint`, `type-check`, `build`, QA wizualne).
Dev server projektu stoi zwykle na porcie **3001**.

## Cel

Sekcja ma wykonać pracę **usunięcia ostatniej wymówki przed rejestracją**: pokazać, że droga do
wspólnego budżetu ma trzy kroki, że pierwszy z nich jest banalny i że można go zrobić samemu.
Po przeczytaniu użytkownik ma mieć pod palcem przycisk.

Wskaźniki:
- **główny**: `cta_click(how_it_works) / section_view(how_it_works)` — dziś strukturalnie zero
  (nie ma CTA ani eventu sekcji);
- **pomocniczy**: `step_select / section_view(how_it_works)` — czy interaktywność w ogóle zarabia
  na swoje ~2 kB JS; jeśli po 3 tygodniach < 3%, w kolejnej iteracji wracamy do wariantu bez wyspy;
- **guard-rail**: zero regresji LCP/CLS, TBT w granicach szumu (sekcja jest 4 ekrany poniżej zgięcia).

---

## Kierunek: interaktywny stepper z auto-odtwarzaniem

Ustalony przez architekta, tu doprecyzowany. Dwie kolumny: po lewej lista trzech kroków
z paskiem postępu pod aktywnym, po prawej panel z autorską ilustracją aktywnego kroku
(crossfade). Auto-przejście co ~5,5 s w pętli; klik/Enter/Space wybiera krok ręcznie;
hover, focus, wyjście z viewportu i ukryta karta pauzują; `prefers-reduced-motion` wyłącza
auto-play i przejścia. Na końcu CTA `InvertDotButton` + mikrocopy.

### Rozstrzygnięcia projektowe (i dlaczego tak)

| # | Decyzja | Uzasadnienie |
|---|---------|--------------|
| **R1** | **Wszystkie trzy opisy są zawsze widoczne.** Nieaktywne kroki są wyciszone kolorem, nie zwijane. | Architekt zakładał „aktywny rozwinięty, nieaktywne zwinięte". Zwijanie kosztuje trzy rzeczy naraz: (a) auto-play zaczyna przesuwać layout co 5 s — dokładnie ten wzorzec, przed którym broni WCAG 2.2.2, (b) tekst w `overflow:hidden` dalej czyta czytnik ekranu, więc trzeba by go dodatkowo chować `hidden`/`aria-hidden`, a wtedy bez JS znika treść (regres SEO i dostępności), (c) `grid-template-rows 0fr→1fr` to animacja wysokości w pętli, czyli stały koszt layoutu. Po rezygnacji ze zwijania **nic tekstowego nie zmienia się w czasie** — auto-play przesuwa wyłącznie wyróżnienie i rysunek, więc sekcja wychodzi spod WCAG 2.2.2, a CLS jest strukturalnie zero. Wyróżnienie niosą cztery równoległe sygnały: kolor numeru (`text-accent-deep` vs `text-dark/60`), kolor tytułu (`text-dark` vs `text-dark/60`), kolor opisu (`text-dark/80` vs `text-dark/60`) i pasek postępu. Opisy kroków mają 12–18 słów, więc pokazanie wszystkich trzech kosztuje ~90 px. |
| **R2** | **Panel = duża spot-illustration na jasnej karcie.** Nie mini-makieta aplikacji. | Koszt makiety (wzorem `ExpenseSplitAnimation` / `CalculatorMockup`) to ~150 linii markupu na krok, nowe klucze i18n na etykiety w środku makiety i `role="img"` z ręcznym `aria-label`. Efekt byłby **ujemny**: makieta stałaby bezpośrednio pod sekcją kalkulatora, która pokazuje **dwie** szklane makiety, i bezpośrednio nad `FeaturesSection` z prawdziwymi screenami w ramce iPhone'a. Trzecia makieta z rzędu to nie dowód, tylko szum. Rysunek kreskowy wchodzi w inny rejestr wizualny, kosztuje ~1,5 kB, zero i18n, zero obrazów, a do tego kontynuuje rodzinę `PainPointIllustration` wprowadzoną dzień wcześniej — landing dostaje **system ilustracji**, a nie kolejny jednorazowy element. |
| **R3** | **Timer = czysty CSS `animation` + `onAnimationEnd`.** Zero `setInterval` / `requestAnimationFrame` w pętli. | Pasek postępu i tak musi być animowany; skoro animacja mierzy czas, niech ona będzie zegarem. Zyski: (a) pauza to jedna deklaracja `animation-play-state: paused` — hover i focus obsługuje sam CSS (`:hover` / `:focus-within`), bez ani jednego handlera w JS, (b) `prefers-reduced-motion` wyłącza auto-play **bez linijki JS**: gdy `animation: none`, zdarzenie `animationend` nigdy nie leci, więc pętla po prostu nie startuje, a klikanie działa dalej, (c) po HMR nie da się zostawić osieroconego timera, bo timera nie ma — React sam odpina listener zdarzenia razem z elementem, (d) zegar nie rozjeżdża się z paskiem, bo to ten sam obiekt. Wykorzystujemy istniejący keyframe `progressFill` z `globals.css` (używa go `FeaturesSection`) — **zero nowych keyframes**. |
| **R4** | **Wzorzec a11y: lista przycisków + `aria-current="step"`.** Nie `role="tablist"`. | Wzorzec tabs wymaga, żeby treść skojarzona z zakładką mieszkała w `tabpanel`. Tutaj treść kroku (tytuł + opis) jest **w samej liście i zawsze widoczna**, a panel po prawej jest w 100% dekoracją (`aria-hidden`). `role="tabpanel"` na pustym semantycznie kontenerze to kłamstwo w drzewie dostępności; do tego zakładki wymuszają roving `tabindex` i własną obsługę strzałek, czyli więcej JS i więcej miejsc na błąd. Lista trzech przycisków daje natywne `Tab` między krokami, natywne `Enter`/`Space`, natywną numerację z `<ol>` i zerowy custom keyboard code. `aria-current="step"` jest dokładnie po to („bieżący krok procesu"). |
| **R5** | **Mobile: panel nad listą, stała `min-h`, auto-play zostaje.** | Rysunek jest nagrodą, nie podsumowaniem — na wąskim ekranie musi być widoczny, zanim użytkownik zacznie czytać, inaczej auto-play przełącza coś, czego nikt nie widzi. W DOM lista jest **pierwsza** (semantyka i SEO), panel dostaje `order-first md:order-none` — wolno, bo panel jest `aria-hidden`, więc kolejność czytania się nie zmienia. Panel ma `min-h-[17rem]` (272 px) na mobile i `md:min-h-[24rem]` (384 px) — obie wartości na siatce 8 px, obie stałe niezależnie od kroku, więc przełączanie nie może dać CLS. Auto-play zostaje, bo nic tekstowego się nie zmienia (R1), a na dotyku i tak nie ma hovera do pauzowania; pierwsze dotknięcie kroku wyłącza pętlę na resztę odsłony. |
| **R6** | **Klik ręczny zatrzymuje auto-play do końca odsłony** (wzorem `FeaturesSection`). | Wybór użytkownika jest mocniejszym sygnałem niż pętla. Po kliknięciu pasek aktywnego kroku zostaje wypełniony na stałe (ten sam wygląd, zero migotania), a sekcja przestaje się ruszać. |
| **R7** | **Tło panelu: `bg-white` + `border-dark/8`** na sekcji `bg-surface`. | `bg-surface-2` na `bg-surface` daje kontrast tła 1,06:1 — panel istniałby wyłącznie dzięki obrysowi (dokładnie problem opisany przy PainPoints, tylko odwrócony). Biel daje najczystsze tło dla rysunku kreskowego i najlepszy „pop" limonkowego akcentu. Sekcja zostaje na `bg-surface`, bo pod nią jest biała `FeaturesSection` — dwie białe sekcje z rzędu skleiłyby się w jedną. |
| **R8** | **Pasek postępu w `bg-accent-deep`, nie `bg-accent`.** | Limonka ma na `--color-surface` 1,3:1 — pasek 2 px byłby niewidoczny (`FeaturesSection` robi to dziś na bieli i ledwo się broni). `--color-accent-deep` (#557300) powstał dokładnie po to: „zieleń na jasnym tle". Limonka zostaje zarezerwowana dla akcentu ilustracji, gdzie ma obrys. |

---

## Zakres Zmian

### Pliki do utworzenia
- `src/components/ui/HowItWorksIllustration.tsx` — **już utworzony w ramach tego planu**; trzy autorskie
  spot-illustrations SVG (`account` / `expenses` / `invite`), siatka 64×64, kreska `currentColor` 1.75,
  dokładnie jeden akcent `var(--color-accent)` z obrysem. Prop `size`: `'panel'` (`size-40 md:size-56`)
  i `'inline'` (`size-16 md:size-20`, rezerwa na przyszłe użycia). Server-safe, bez `'use client'`.
- `src/components/ui/HowItWorksStepper.tsx` — jedyna nowa wyspa kliencka (`'use client'`): lista kroków
  + panel + auto-play. Bez `next-intl` w środku — wszystkie teksty wchodzą propsami z RSC.

### Pliki do modyfikacji
- `src/components/sections/HowItWorksSection.tsx` — przebudowa: RSC zostaje właścicielem nagłówka,
  tłumaczeń i CTA; dochodzi `locale` w propsach, `id`, `aria-labelledby`, `data-section-view`.
- `src/app/[locale]/page.tsx` — `<HowItWorksSection />` → `<HowItWorksSection locale={locale} />`.
- `src/app/globals.css` — nowy blok `HowItWorks — stepper` (bez nowych keyframes).
- `src/lib/analytics.ts` — `trackStepSelect()`.
- `messages/pl.json`, `messages/en.json` — blok `HomePage.howItWorks` (punktowo!).
- `ai-lib/context-map/*` — po wdrożeniu (lista na końcu planu).

### Pliki do usunięcia
- brak. Ikony `lucide-react` (`UserPlus`, `ListChecks`, `Target`) znikają z importów sekcji;
  paczka zostaje, bo używa jej pół landingu.

### Czego NIE ruszamy
- Copy kroków (`steps[].title`, `steps[].description`), `title`, `titleHighlight`, `subtitle` —
  są dobre, opisują produkt konkretnie i zawierają frazy SEO. Zmiana byłaby ruchem bez powodu.
- `ScribbleWord`, `SectionLead`, `ScrollReveal` — zostają dokładnie tam, gdzie są.
- `messages/*.json` poza blokiem `howItWorks` — w drzewie roboczym są niezacommitowane zmiany
  w obu plikach; edycja musi być punktowa, bez przeformatowania całości.

---

## Podejście Techniczne

### Podział odpowiedzialności

| Plik | Typ | Odpowiada za |
|------|-----|--------------|
| `sections/HowItWorksSection.tsx` | **RSC** (`async`) | `<section>` z `id` / `aria-labelledby` / `data-section-view`, nagłówek (`ScrollReveal` + `ScribbleWord` + `SectionLead`), odczyt tłumaczeń, CTA + mikrocopy |
| `ui/HowItWorksStepper.tsx` | **client** (jedyna nowa wyspa) | stan `active` / `auto`, pauza przez `IntersectionObserver` + `visibilitychange`, lista kroków, panel ze slajdami |
| `ui/HowItWorksIllustration.tsx` | czysty komponent (bez dyrektywy) | trzy rysunki SVG; wchodzi do bundla klienta razem ze stepperem (~1,5 kB) |
| `app/globals.css` | — | blok `HowItWorks — stepper`: `.hiw-progress`, `.hiw-list`, `.hiw-slide`, `.hiw-panel__glow`, pauzy, reduced-motion |

Wszystkie teksty idą z RSC propsami (`steps`, `stepsLabel`) — wyspa nie importuje `next-intl`,
więc do bundla klienta nie wchodzą ani tłumaczenia, ani runtime `useTranslations`.

### Wartości: czasy, easing, tokeny

| Element | Wartość | Uwaga |
|---------|---------|-------|
| Czas jednego kroku | **5500 ms**, `linear` | Opis kroku ma 12–18 słów ≈ 5 s czytania; `linear`, bo pasek jest zegarem |
| Wejście wyróżnienia węzła i segmentu | **420 ms**, `cubic-bezier(0.22, 1, 0.36, 1)` | dominujący easing repo; ~~crossfade panelu~~ — panel nie istnieje po rewizji układu |
| Zmiany kolorów w liście | **300 ms** (`transition-colors duration-300`) | krótsze niż crossfade — tekst „zapala się" przed rysunkiem |
| `ScrollReveal` nagłówka / CTA | bez zmian / `delay={150}` | |
| ~~Wysokość panelu~~ | — | nieaktualne po rewizji układu: panelu nie ma, CLS 0 wynika z tego, że przełączenie kroku zmienia wyłącznie kolor i `transform` |
| Ilustracja | `size-10 md:size-14` (40 / 56 px) | prop `size="node"` — rysunek siedzi w węźle ścieżki (64 / 96 px), nie w panelu |
| Węzeł ścieżki | `size-16 md:size-24` (64 / 96 px), `bg-white` + `border-dark/8`, aktywny `scale-105 shadow-md` | |
| Pierścień-zegar | SVG `circle` `r=47`, `pathLength=100`, `stroke-width` 3.5, `-inset-2` | `stroke-accent-deep`; ~~pasek postępu~~ zastąpiony pierścieniem |
| Linia ścieżki + segmenty | `h-px` (md) / `w-px` (mobile), `bg-dark/10` → `bg-accent-deep` | 1 px to grubość kreski, nie odstęp — siatka 8 px nie dotyczy |
| Promienie | `rounded-full` (węzeł, pierścień, CTA), `rounded-card` (focus ring przycisku) | |
| Kolory | `bg-surface` (sekcja), `bg-white` + `border-dark/8` (węzeł), `text-dark` / `text-dark/80` / `text-dark/60`, `text-accent-deep` (numer, pierścień, segmenty), `bg-accent` (tylko CTA i akcent SVG) | zero hexów, zero `text-dark/10..50` |

### Szkielet — `sections/HowItWorksSection.tsx` (RSC)

```tsx
import { getTranslations } from 'next-intl/server';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ScribbleWord } from '@/components/ui/ScribbleWord';
import { SectionLead } from '@/components/ui/SectionLead';
import { InvertDotButton } from '@/components/ui/InvertDotButton';
import { HowItWorksStepper, type HowItWorksStep } from '@/components/ui/HowItWorksStepper';
import { startHref } from '@/lib/appLinks';

type Props = { locale: string };

export async function HowItWorksSection({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage.howItWorks' });
  const steps = t.raw('steps') as HowItWorksStep[];

  return (
    <section
      id="jak-to-dziala"
      aria-labelledby="howitworks-title"
      data-section-view="how_it_works"
      className="bg-surface overflow-hidden px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mb-12 text-center md:mb-16">
          <h2 id="howitworks-title" className="font-display text-4xl leading-tight text-dark md:text-5xl lg:text-6xl">
            {t('title')} <ScribbleWord>{t('titleHighlight')}</ScribbleWord>
          </h2>
          <SectionLead className="mt-6">{t('subtitle')}</SectionLead>
        </ScrollReveal>

        <HowItWorksStepper steps={steps} stepsLabel={t('stepsLabel')} locale={locale} />

        <ScrollReveal delay={150} className="mt-12 text-center md:mt-16">
          <InvertDotButton
            href={startHref(locale)}
            className="sheen inline-block rounded-full bg-accent px-10 py-4 text-sm font-semibold text-black"
            location="how_it_works"
            locale={locale}
          >
            {t('cta')}
          </InvertDotButton>
          <p className="mt-4 text-sm text-dark/60">{t('ctaNote')}</p>
        </ScrollReveal>
      </div>
    </section>
  );
}
```

`overflow-hidden` zostaje na sekcji — obwódka `ScribbleWord` wychodzi poza obrys słowa.

### Szkielet — `ui/HowItWorksStepper.tsx` (wyspa kliencka)

Stan jest celowo minimalny: **dwa** `useState` i **zero** timerów JS.

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { HowItWorksIllustration, type HowItWorksStepKind } from '@/components/ui/HowItWorksIllustration';
import { trackStepSelect } from '@/lib/analytics';

export type HowItWorksStep = {
  kind: HowItWorksStepKind;
  title: string;
  description: string;
};

type Props = {
  steps: HowItWorksStep[];
  stepsLabel: string;
  locale: string;
};

export function HowItWorksStepper({ steps, stepsLabel, locale }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const [active, setActive] = useState(0);
  // Pierwszy reczny wybor konczy petle na reszte odslony (wzorem FeaturesSection)
  const [auto, setAuto] = useState(true);

  // Pauza poza viewportem i w ukrytej karcie. Klasa na roocie, nie stan: setState
  // przy kazdym przecieciu viewportu przerysowywalby liste i zerowal pasek postepu.
  // className roota jest stala, wiec React nigdy nie nadpisze tej klasy.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const sync = () => {
      root.classList.toggle('hiw--paused', !visibleRef.current || document.hidden);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[entries.length - 1].isIntersecting;
        sync();
      },
      { threshold: 0.25 },
    );
    observer.observe(root);
    document.addEventListener('visibilitychange', sync);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  // Oba setState siedza w callbackach zdarzen (klik, animationend), nigdy w ciele
  // efektu - regula react-hooks/set-state-in-effect jest w tym repo bledem.
  const goToNext = () => setActive((current) => (current + 1) % steps.length);

  const selectStep = (index: number) => {
    setActive(index);
    setAuto(false);
    trackStepSelect('how_it_works', index + 1, locale);
  };

  return (
    <div
      ref={rootRef}
      className="hiw hiw--paused grid gap-10 md:grid-cols-2 md:items-center md:gap-12 lg:gap-16"
    >
      <ol role="list" aria-label={stepsLabel} className="hiw-list m-0 list-none p-0">
        {steps.map((step, index) => {
          const isActive = index === active;

          return (
            <li key={step.kind}>
              {/* h3 opakowuje przycisk, nie odwrotnie - <button> przyjmuje tylko
                  tresc frazowa (ten sam uklad co FeaturesSection) */}
              <h3 className="m-0">
                <button
                  type="button"
                  onClick={() => selectStep(index)}
                  aria-current={isActive ? 'step' : undefined}
                  aria-describedby={`hiw-step-${index}`}
                  className="flex w-full cursor-pointer items-baseline gap-4 rounded-card py-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
                >
                  <span
                    aria-hidden="true"
                    className={`font-display w-10 shrink-0 text-2xl leading-none tabular-nums transition-colors duration-300 ${
                      isActive ? 'text-accent-deep' : 'text-dark/60'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`flex-1 text-lg font-medium leading-snug transition-colors duration-300 md:text-xl ${
                      isActive ? 'text-dark' : 'text-dark/60'
                    }`}
                  >
                    {step.title}
                  </span>
                </button>
              </h3>

              <p
                id={`hiw-step-${index}`}
                className={`mb-4 max-w-md pl-14 text-sm leading-relaxed transition-colors duration-300 ${
                  isActive ? 'text-dark/80' : 'text-dark/60'
                }`}
              >
                {step.description}
              </p>

              {/* Tor postepu. Pasek zyje TYLKO pod aktywnym krokiem - zmiana kroku
                  odmontowuje go i montuje na nowo, wiec animacja startuje od zera. */}
              <div aria-hidden="true" className="h-0.5 w-full overflow-hidden rounded-full bg-dark/10">
                {isActive &&
                  (auto ? (
                    <span
                      className="hiw-progress block h-full w-full origin-left bg-accent-deep"
                      onAnimationEnd={goToNext}
                    />
                  ) : (
                    <span className="block h-full w-full bg-accent-deep" />
                  ))}
              </div>
            </li>
          );
        })}
      </ol>

      {/* Panel jest dekoracja - tresc kroku niesie lista obok. Stala min-h + slajdy
          w position:absolute => przelaczanie nie moze przesunac layoutu. */}
      <div
        aria-hidden="true"
        className="relative order-first grid min-h-[17rem] place-items-center overflow-hidden rounded-panel border border-dark/8 bg-white md:order-none md:min-h-[24rem]"
      >
        <span className="hiw-panel__glow" />
        {steps.map((step, index) => (
          <span key={step.kind} className="hiw-slide" data-active={index === active}>
            <HowItWorksIllustration kind={step.kind} size="panel" className="text-dark" />
          </span>
        ))}
      </div>
    </div>
  );
}
```

**Kolejność zdarzeń przy starcie**: SSR renderuje `active = 0`, root ma klasę `hiw--paused`
(pasek stoi na `scaleX(0)`) → hydracja → efekt podpina `IntersectionObserver` → wejście sekcji
w viewport zdejmuje klasę → animacja paska rusza → po 5500 ms `animationend` → `setActive(1)` →
stary `<span>` znika razem z listenerem, nowy montuje się pod krokiem 2. Pętla nie ma żadnego
stanu poza `active`, więc nie da się jej „rozdwoić".

**Sprzątanie**: jedyne zasoby to `IntersectionObserver` i listener `visibilitychange` — oba
odpinane w cleanupie efektu. Brak `setTimeout` / `setInterval` / `requestAnimationFrame`.

### CSS — nowy blok w `src/app/globals.css`

Dopisać na końcu pliku, w stylu istniejących bloków (po bloku `PainPoints — dymki rozmowy`).
**Zero nowych keyframes** — `progressFill` już istnieje (używa go `FeaturesSection`).

```css
/* HowItWorks — stepper krokow.
   Zegar auto-przejscia to ta sama animacja co pasek postepu: pauza = animation-play-state,
   koniec kroku = zdarzenie animationend (handler w HowItWorksStepper). Dzieki temu
   prefers-reduced-motion wylacza auto-play bez ani jednej linijki JS - bez animacji
   nie ma zdarzenia, wiec petla nie startuje, a klikanie krokow dziala dalej. */
.hiw-progress {
  transform: scaleX(0);
  animation: progressFill 5500ms linear forwards;
}

/* Pauza: sekcja poza viewportem lub ukryta karta (klasa z JS) oraz focus w liscie */
.hiw--paused .hiw-progress,
.hiw-list:focus-within .hiw-progress {
  animation-play-state: paused;
}

/* Hover pauzuje tylko tam, gdzie hover istnieje - na dotyku :hover potrafi sie zaciac */
@media (hover: hover) {
  .hiw-list:hover .hiw-progress {
    animation-play-state: paused;
  }
}

.hiw-slide {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  opacity: 0;
  transform: translateY(10px) scale(0.96);
  transition:
    opacity 420ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.hiw-slide[data-active='true'] {
  opacity: 1;
  transform: none;
}

/* Cieplo marki pod rysunkiem. color-mix zamiast rgba() - zero hexow w CSS. */
.hiw-panel__glow {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 62%;
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--color-accent) 26%, transparent),
    transparent 70%
  );
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .hiw-progress {
    animation: none;
    transform: none;
  }
  .hiw-slide {
    transition: none;
  }
}
```

### Analytics — `src/lib/analytics.ts`

```ts
// Stepper "Jak to dziala" - raportujemy WYLACZNIE reczny wybor kroku. Auto-przejscia
// nie sa interakcja, a event po kazdym cyklu zalalby GA4 (12 zdarzen na minute widoku).
export function trackStepSelect(section: string, step: number, locale: string) {
  pushEvent('step_select', { section, step_index: step, locale });
}
```

`cta_click` z `cta_location: 'how_it_works'` leci sam z `InvertDotButton`.
`section_view` z `section: 'how_it_works'` leci sam z `InteractionTracker` (atrybut na `<section>`).

---

## i18n — pełna lista kluczy

Namespace `HomePage.howItWorks`. Istniejące `title`, `titleHighlight`, `subtitle`
oraz `steps[].title` / `steps[].description` **bez zmian**.

| Klucz | Status | PL | EN |
|-------|--------|----|----|
| `title` | bez zmian | Zacznij w | Get started in |
| `titleHighlight` | bez zmian | 3 prostych krokach | 3 simple steps |
| `subtitle` | bez zmian | Wspólny budżet skonfigurujecie w mniej niż minutę. Bez skomplikowanych formularzy, bez karty kredytowej, bez zgody obojga na start. | You can set up a shared budget in under a minute. No complicated forms, no credit card, no need for both of you to sign up on day one. |
| `stepsLabel` | **NOWY** | Trzy kroki do wspólnego budżetu | Three steps to a shared budget |
| `steps[0].kind` | **NOWY** | `account` | `account` |
| `steps[1].kind` | **NOWY** | `expenses` | `expenses` |
| `steps[2].kind` | **NOWY** | `invite` | `invite` |
| `cta` | **NOWY** | Zróbcie pierwszy krok - za darmo | Take the first step - for free |
| `ctaNote` | **NOWY** | Bez karty kredytowej · Konto gotowe w 30 sekund | No credit card · Account ready in 30 seconds |

Docelowy kształt bloku (kolejność pól jak w `painPoints`: `kind` przed `title`):

```jsonc
"howItWorks": {
  "title": "Zacznij w",
  "titleHighlight": "3 prostych krokach",
  "subtitle": "…bez zmian…",
  "stepsLabel": "Trzy kroki do wspólnego budżetu",
  "steps": [
    { "kind": "account",  "title": "Załóż konto",     "description": "…bez zmian…" },
    { "kind": "expenses", "title": "Dodaj wydatki",   "description": "…bez zmian…" },
    { "kind": "invite",   "title": "Zaproś partnera", "description": "…bez zmian…" }
  ],
  "cta": "Zróbcie pierwszy krok - za darmo",
  "ctaNote": "Bez karty kredytowej · Konto gotowe w 30 sekund"
}
```

Uwagi do copy:
- `cta` celowo **nie** powtarza hero („Zacznijcie razem - za darmo") ani `CTABanner` / `features`
  („Zacznij od siebie - dodaj partnera później”). „Pierwszy krok” domyka narrację sekcji o trzech
  krokach, a forma „Wy” i człon „za darmo” trzymają ton marki.
- `ctaNote` to obietnica z `subtitle` w formie mikrodowodu przy samym przycisku: kasuje dwie
  ostatnie obiekcje (koszt, czas). Separator `·` z odstępami, myślnik zwykły `-` jak w reszcie repo.
- `kind` jest **kluczem technicznym** (mapuje krok na rysunek i służy za `key` w React) — nigdy
  nie tłumaczymy jego wartości; w obu plikach ma identyczne wartości. Ten sam wzorzec co
  `painPoints.items[].kind`.

---

## Kolejność Implementacji (checklista dla implementatora)

> Dev servera **nie uruchamiamy** w trakcie kroków 1–6 (bywa na porcie 3001 i psuje `.next/dev/types`).
> Kroki weryfikacyjne to `lint`, `type-check`, `build`.

- [ ] **1. i18n.** Punktowo dopisz `stepsLabel`, `steps[].kind`, `cta`, `ctaNote` w `messages/pl.json`
      i `messages/en.json`. Nie dotykaj innych bloków — w obu plikach są niezacommitowane zmiany.
- [ ] **2. Analytics.** `trackStepSelect()` w `src/lib/analytics.ts` (wzorem `trackFaqOpen`).
- [ ] **3. CSS.** Blok `HowItWorks — stepper` na końcu `src/app/globals.css`. Sprawdź, że
      keyframe `progressFill` nadal istnieje i nie jest modyfikowany.
- [ ] **4. Wyspa.** `src/components/ui/HowItWorksStepper.tsx` wg szkieletu powyżej.
      `HowItWorksIllustration.tsx` już istnieje — nie modyfikuj bez powodu.
- [ ] **5. Sekcja.** Przebudowa `HowItWorksSection.tsx` (RSC) + `locale` w propsach.
      Usuń import `lucide-react`, tablicę `STEP_ICONS`, linię gradientową i inline `style`.
- [ ] **6. Strona.** `src/app/[locale]/page.tsx`: `<HowItWorksSection locale={locale} />`.
- [ ] **7. Weryfikacja statyczna.** `npm run lint` → 0 błędów (szczególnie
      `react-hooks/set-state-in-effect` i `react-hooks/exhaustive-deps`), `npm run type-check` → 0,
      `npm run build` → pass. Po ubitym dev serwerze może być konieczne `rm -rf .next/dev/types`.
- [ ] **8. QA wizualne** (dev na 3001, PL i EN, 1440 / 768 / 390 px):
      - pętla przechodzi 1 → 2 → 3 → 1 i wraca w nieskończoność;
      - kursor na liście zatrzymuje pasek, zjechanie go wznawia (nie restartuje);
      - `Tab` wchodzi na trzy przyciski po kolei, `Enter` i `Space` wybierają krok,
        focus ring jest widoczny (`outline-accent-deep`), pętla po kliknięciu stoi;
      - zwinięcie/rozwinięcie karty przeglądarki nie przyspiesza ani nie dubluje przejść;
      - wyjście sekcji z ekranu zatrzymuje pasek;
      - przełączanie kroków **nie rusza** niczego poza rysunkiem i kolorami (zmierz: narzędzia
        deweloperskie → Performance → Layout Shift Regions ma być puste);
      - DevTools → Rendering → *Emulate prefers-reduced-motion*: brak auto-play, brak crossfade,
        klikanie kroków nadal działa, pasek aktywnego kroku pokazuje pełną długość.
- [ ] **9. QA dostępności.** Lighthouse Accessibility na `/pl` = 100. Kontrasty do sprawdzenia
      pipetą: `text-dark/60` na `--color-surface` (4,5:1 — dolna granica), `text-accent-deep`
      na `--color-surface`, pasek `bg-accent-deep` na `bg-dark/10`.
- [ ] **10. Pomiar.** GA4 DebugView: `section_view` z `section: how_it_works`,
      `step_select` z `step_index`, `cta_click` z `cta_location: how_it_works`.
- [ ] **11. Context map + commit** (architekt) — lista niżej, potem `/commit`.

---

## SEO / i18n / CMS — Impact

- **SEO**: bez zmian w `generateMetadata` i JSON-LD. Cała treść kroków zostaje w HTML-u
  renderowanym serwerowo (R1) — brak regresu indeksowalności. Nowa kotwica `#jak-to-dziala`
  jako cel linków wewnętrznych z bloga (ta sama konwencja co `#wyzwania`, `#kalkulator`;
  kotwica jest polska w obu wersjach językowych — świadomie, jak w PainPoints).
- **i18n**: cztery nowe klucze + pole techniczne `kind`; parity PL/EN obowiązkowa.
- **CMS**: brak — sekcja zostaje w `messages/`.

## Context Map — Co zaktualizować

- [ ] `pages.md` — opis sekcji 4 „Jak to działa”: pozioma ścieżka trzech kroków z auto-play
      (zegar = pierścień wokół węzła), na mobile pionowa oś czasu, CTA do `/start`,
      kotwica `#jak-to-dziala`
- [ ] `analytics.md` — nowy event `step_select` (tabela eventów + lista atrybutów deklaratywnych),
      dopisanie `how_it_works` do listy wartości `section` w `section_view` i do konsumentów
      `data-section-view`, nowy `cta_location: how_it_works`
- [ ] `i18n.md` — nowe klucze w `HomePage.howItWorks` (`stepsLabel`, `cta`, `ctaNote`, `steps[].kind`)
- [ ] `design-system.md` — (a) **poprawić nieaktualne zdanie** z 2026-09-13: „HowItWorksSection jest
      serwerowy” → sekcja jest serwerowa, ale zawiera wyspę `HowItWorksStepper`; (b) nowy wzorzec
      „ścieżka kroków z auto-play sterowanym animacją CSS (zegar = pierścień `stroke-dashoffset`)”;
      (c) dopisać `HowItWorksIllustration` do rodziny spot-illustrations obok `PainPointIllustration`;
      (d) zasada: dwie sąsiadujące sekcje nie mogą dzielić tej samej kompozycji (lista + panel)
- [ ] `INDEX.md` — Log Ostatnich Zmian

---

## Ryzyka

| # | Ryzyko | Mitygacja |
|---|--------|-----------|
| **1** | **CLS przy przełączaniu kroku.** | Strukturalnie wykluczony: żaden tekst nie pojawia się ani nie znika (R1), slajdy panelu są `position: absolute` w kontenerze o stałym `min-h`, animowane są wyłącznie `opacity` i `transform`. Do sprawdzenia w kroku QA 8 (Layout Shift Regions). |
| **2** | **Podwójne timery po HMR.** | Nie występują — nie ma ani jednego timera JS (R3). Jedyne miejsce, w którym `animationend` mógłby wystrzelić dwa razy, to zagnieżdżona animacja wewnątrz `.hiw-progress`; element musi zostać **bezdzietny**. Gdyby kiedyś dostał dziecko z animacją, dodać `if (event.target !== event.currentTarget) return;`. |
| **3** | **React Compiler + refy.** | Refy (`rootRef`, `visibleRef`) są czytane i zapisywane wyłącznie w efekcie i w callbackach obserwatora — nigdy w ciele renderu, więc kompilator nie ma czego zmemoizować błędnie. `className` roota jest **stałym literałem**, dlatego React nigdy nie nadpisze klasy `hiw--paused` dokładanej przez `classList` (ten sam kontrakt co `ChatDialogue`). Jeśli ktoś kiedyś uzależni `className` roota od stanu — pauza przestanie działać. |
| **4** | **`react-hooks/set-state-in-effect` (error w tym repo).** | Żadne `setState` nie stoi w ciele efektu. `setActive` żyje w `onAnimationEnd` i `onClick`, `setAuto` w `onClick`. Efekt robi wyłącznie subskrypcje i `classList`. |
| **5** | **Lenis a IntersectionObserver.** | `SmoothScroll` używa Lenis w trybie natywnego scrolla (bez wrappera z `transform`), więc IO działa — potwierdzają to `ScrollReveal`, `ChatDialogue` i `InteractionTracker`. Gdyby Lenis kiedyś przeszedł na wrapper, **wszystkie** IO w repo wymagałyby opcji `root` — to zmiana globalna, nie lokalna dla tej sekcji. |
| **6** | **Brak auto-play przy `prefers-reduced-motion` wygląda jak bug.** | To jest mechanizm, nie usterka (R3): bez animacji nie ma `animationend`. Nie „naprawiać” tego fallbackiem w JS — pasek aktywnego kroku pokazuje pełną długość, a klikanie działa. Udokumentowane w komentarzu w CSS. |
| **7** | **Regres „sekcja w 100% serwerowa”** z optymalizacji 2026-09-13 (TBT). | Wyspa to ~2 kB (stepper + trzy SVG), bez `next-intl` po stronie klienta, 4 ekrany poniżej zgięcia, hydracja nie blokuje LCP. Guard-rail: porównanie TBT/LCP w Lighthouse mobile przed i po (krok QA 9). Jeśli `step_select / section_view` < 3% po 3 tygodniach — wracamy do wariantu bez wyspy, zostawiając ilustracje i CTA. |
| **8** | **Podwójna numeracja dla czytnika ekranu** (`<ol>` + wizualne `01`). | Cyfry w przycisku mają `aria-hidden="true"`; numerację niesie `<ol>` z `role="list"` i `aria-label` (`stepsLabel`). |
| **9** | **Auto-play a WCAG 2.2.2 (Pause, Stop, Hide).** | Kryterium dotyczy automatycznie zmieniającej się **treści**; tu zmienia się wyłącznie dekoracja i wyróżnienie (R1). Dodatkowo są trzy niezależne sposoby zatrzymania: hover, focus w liście, kliknięcie kroku (trwałe). |
| **10** | **Rozjazd `kind` ↔ liczba kroków.** | `kind` jest zarazem `key` w React; dodanie czwartego kroku bez `kind` da runtime'owy `undefined` w ilustracji (pusty SVG, bez crasha). Przy rozszerzaniu listy kroków najpierw dopisz wariant w `HowItWorksIllustration`. |

---

## Rewizja układu (2026-09-14)

### Powód

Wdrożony wariant (lista kroków z paskiem postępu po lewej + panel z ilustracją po prawej)
powielał kompozycję `FeaturesSection`, która stoi **bezpośrednio pod** tą sekcją: akordeon
z `progressFill` po lewej, makieta iPhone'a po prawej. Dwie sąsiadujące sekcje o identycznym
szkielecie „lista z paskiem | duży wizual” czytają się jak jedna rozciągnięta sekcja —
użytkownik traci sygnał, że zmienił się temat, a sekcja o trzech krokach przestaje wyglądać
jak **droga** i zaczyna wyglądać jak kolejny spis funkcji. Diagnoza D2 (nie kopiuj makiety
sąsiada) była trafna, ale zatrzymała się na treści panelu zamiast objąć jego kompozycję.

### Nowy układ: pozioma ścieżka trzech kart

- **Desktop (md+)**: `grid-cols-3` bez odstępu kolumnowego. Każda karta: **węzeł** (okrąg
  `size-24`, `bg-white` + `border-dark/8`, w środku `HowItWorksIllustration`) na górze, pod nim
  numer `01/02/03`, `h3 > button` z tytułem i zawsze widoczny opis. Za węzłami biegnie pozioma
  linia (`h-px`, `bg-dark/10`) od środka pierwszego do środka trzeciego węzła — powrót do
  kompozycji sprzed redesignu, ale z linią jako **żywym** wskaźnikiem postępu.
- **Mobile (<768px)**: pionowa oś czasu — węzeł `size-16` po lewej, linia `w-px` w dół,
  tekst po prawej. Ten sam markup, przełączony `flex-col` ↔ `flex-row`.
- **Zegar auto-play = pierścień** wokół węzła aktywnego kroku zamiast paska postępu.
- **Stan ścieżki**: segment i→i+1 zapala się (`bg-accent-deep`, 420 ms) gdy `active > i`;
  węzły już przebyte dostają `border-accent-deep/30`, aktywny `border-accent-deep/40`
  + `scale-105` + `shadow-md`. Powrót pętli do kroku 1 gasi całą ścieżkę.

Mechanika **bez zmian**: pętla przez `animationend`, pauza klasą `hiw--paused` + `:hover` /
`:focus-within`, klik kończy auto-play na resztę odsłony, `step_select` w GA4, zero timerów JS,
zero `setState` w ciele efektu, `className` roota nadal stałym literałem.

Decyzje D1 (wszystkie opisy widoczne), D3 (zegar = animacja CSS), D4 (lista + `aria-current`),
D6 (klik zatrzymuje pętlę), D8 (`accent-deep`, nie `accent`) **obowiązują dalej**.
D2 zostaje w mocy w części „rysunek zamiast makiety”. D5 (panel nad listą na mobile) i D7
(tło panelu) **wygasają razem z panelem**.

### Zmiany w plikach

| Plik | Co się zmieniło |
|------|-----------------|
| `src/components/ui/HowItWorksStepper.tsx` | przepisany układ: `ol` w `md:grid-cols-3`, `li` = węzeł + segmenty + blok tekstu; usunięty panel, `hiw-slide`, `hiw-panel__glow`, pasek `hiw-progress`; dodany pierścień SVG z `onAnimationEnd` |
| `src/components/ui/HowItWorksIllustration.tsx` | rozmiary: `panel`/`inline` → **`node`** (`size-10 md:size-14`) / `inline` (`size-8 md:size-10`); `node` jest domyślny |
| `src/app/globals.css` | blok `HowItWorks` przepisany: nowy keyframe **`hiwRing`**, klasy `.hiw-ring`, `.hiw-node`, `.hiw-seg`; usunięte `.hiw-progress`, `.hiw-slide`, `.hiw-panel__glow` (zero martwego CSS) |
| `src/components/sections/HowItWorksSection.tsx` | bez zmian |
| `messages/pl.json`, `messages/en.json` | bez zmian — żadnych nowych kluczy |
| `src/lib/analytics.ts` | bez zmian — `trackStepSelect` działa jak wcześniej |

### Nowy keyframe i klasy

```css
@keyframes hiwRing {
  from { stroke-dashoffset: 100; }
  to   { stroke-dashoffset: 0; }
}
```

`pathLength="100"` na `<circle>` normalizuje obwód, więc ten sam keyframe obsługuje oba rozmiary
węzła (64 px na mobile, 96 px od `md`) — bez liczenia `2πr` i bez drugiej wartości `dasharray`.

| Klasa | Rola |
|-------|------|
| `.hiw-ring` | pierścień-zegar: `stroke-dasharray: 100`, `animation: hiwRing 5500ms linear forwards`; montowany tylko pod aktywnym krokiem (remount = restart) |
| `.hiw-node` | przejście `transform` / `box-shadow` / `border-color` 420 ms — zero wpływu na layout |
| `.hiw-seg` | przejście `background-color` 420 ms dla segmentów linii |
| `.hiw--paused`, `.hiw-list` | **bez zmian** — te same selektory pauzy, przełączone z `.hiw-progress` na `.hiw-ring` |

`progressFill` zostaje w `globals.css` — nadal używa go `FeaturesSection`.

### Weryfikacja rewizji

- `npx eslint` na `HowItWorksStepper.tsx` + `HowItWorksSection.tsx` + `HowItWorksIllustration.tsx` → 0
- `npm run type-check` → 0, `npm run build` → pass
- dev (`/pl`): `hiw-ring` obecny (1 × aktywny krok), `hiw-seg` 6 ×, `hiw-slide` / `hiw-progress` 0 ×
- pętla 1 → 2 → 3 → 1 z zapalaniem i gaszeniem segmentów; klik ustawia pierścień na pełny
  (`stroke-dasharray: none`, `stroke-dashoffset: 0`) i wysyła `step_select`
- mobile 390 px: `li` stykają się bez przerw, linia biegnie w osi węzłów (x = środek węzła),
  segmenty poziome są `display:none`
- kontrast `--color-accent-deep` (#557300): **5,0:1** na `--color-surface`, **5,5:1** na białym —
  powyżej progu 4,5:1 dla tekstu i 3:1 dla grafiki

### Otwarte po rewizji

- pełne QA wizualne (kroki 8–10 checklisty) nadal po stronie architekta — auto-play da się
  obejrzeć tylko w **aktywnej** karcie przeglądarki: ukryta karta jest pauzowana z założenia
  (`visibilitychange`), więc „sekcja stoi” w zminimalizowanym oknie to zachowanie, nie usterka
