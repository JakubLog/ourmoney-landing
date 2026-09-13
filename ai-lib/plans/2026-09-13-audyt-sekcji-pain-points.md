# Audyt i redesign sekcji PainPoints („Czy te wyzwania brzmią znajomo?")

**Data**: 2026-09-13
**Komponent**: `src/components/sections/PainPointsSection.tsx`
**Pozycja na stronie**: 1. sekcja pod hero (`src/app/[locale]/page.tsx` → Hero → **PainPoints** → CalculatorTeaser → HowItWorks → Features → …)
**Autor audytu**: senior product design review (UI/UX + conversion copy)
**Status**: propozycja, nic nie zaimplementowane — żaden plik projektu nie został zmieniony

---

## 1. Diagnoza — co dziś nie działa

### 1.1 Sekcja jest jedyną „martwą strefą" wizualną na całej stronie

Przegląd wszystkich sekcji homepage pod kątem elementu wizualnego:

| Sekcja | Element wizualny |
|--------|------------------|
| Hero | zdjęcie tła + awatary social proof + animowane słowo |
| **PainPoints** | **brak — trzy prostokąty z samym tekstem** |
| CalculatorTeaser | `CalculatorMockup` (podgląd narzędzia) |
| HowItWorks | ikony lucide w rombach + wielkie cyfry + linia łącząca + podkreślenie SVG |
| Features | render iPhone'a z 5 screenami aplikacji |
| BrandPromise | zdjęcie pary + dwie pływające karty wydatków |

PainPoints leży dokładnie w miejscu największego spadku scroll-depth (pierwsza sekcja pod linią zgięcia) i jest jedynym miejscem, gdzie użytkownik nie dostaje **żadnego** bodźca wizualnego. Trzy pastelowe prostokąty z `h3` + akapitem to layout „placeholder", nie sekcja produktowa.

### 1.2 Trzy kolory kart są przypadkowe (i to widać)

```tsx
const CARD_COLORS = [
  'var(--color-surface-cool)',  // #e4e9f5 — chłodny błękit
  'var(--color-beige)',         // #e2dbd2 — ciepły beż
  'var(--color-surface-2)',     // #eeeceb — neutralna szarość
];
```

Trzy różne rodziny barwne (zimna / ciepła / neutralna) bez żadnego znaczenia semantycznego. Kolor nie koduje niczego — ani wagi problemu, ani kolejności, ani kategorii. Wygląda jak „nie wiedzieliśmy, czym wypełnić karty". `--color-surface-cool` istnieje w `globals.css` wyłącznie po to, żeby obsłużyć tę jedną kartę (komentarz w kodzie: _„chłodny wariant karty (PainPoints)"_) — token powołany pod przypadkową decyzję.

### 1.3 Bug do wyzwolenia: `CARD_COLORS[i]` bez zabezpieczenia

Tablica kolorów ma sztywno 3 pozycje, a `items` pochodzi z `t.raw('items')` — czyli z `messages/pl.json`. Dodanie czwartego punktu bólu przez kogokolwiek edytującego tłumaczenia daje `backgroundColor: undefined` → karta przezroczysta na białym tle, bez błędu w konsoli i bez failu buildu. Brakuje `CARD_COLORS[i % CARD_COLORS.length]` albo — lepiej — rezygnacji z tablicy kolorów w ogóle.

Drugorzędnie: `key={i}` zamiast stabilnego klucza (`FeaturesSection` używa `key={item.title}`).

### 1.4 Dostępność — dwa realne faile kontrastu

Policzone wg WCAG 2.1 (kontrast na realnych tokenach):

| Element | Klasa | Tło | Kontrast | Wymóg | Wynik |
|---------|-------|-----|----------|-------|-------|
| Eyebrow | `text-dark/40` | `white` | **2,3:1** | 4,5:1 | **FAIL** |
| Opis karty 2 | `text-dark/60` | `--color-beige` #e2dbd2 | **4,26:1** | 4,5:1 | **FAIL** |
| Opis karty 1 | `text-dark/60` | `--color-surface-cool` #e4e9f5 | 4,51:1 | 4,5:1 | pass na styk |
| Opis karty 3 | `text-dark/60` | `--color-surface-2` #eeeceb | ~4,6:1 | 4,5:1 | pass na styk |

Eyebrow to **nie** element dekoracyjny — niesie frazę SEO („Wasze wyzwania finansowe jako pary"), więc obowiązuje go pełne 4,5:1. `text-dark/40` na bieli to 12px uppercase przy 2,3:1 — nieczytelne dla dużej części użytkowników.
Poprawka: eyebrow → `text-dark/60` (4,81:1), opisy kart → `text-dark/70` (na beżu 5,88:1).

### 1.5 Dostępność — semantyka i landmarki

- `<ul className="... list-none ...">` — `list-style: none` w Safari **usuwa semantykę listy** z VoiceOver (znany bug WebKit). Brakuje `role="list"` na `<ul>`. Ten sam błąd jest w `FeaturesSection` (`<ol className="list-none">`) i `HowItWorksSection`.
- `<section>` bez `aria-labelledby` → to bezimienny region; użytkownik nawigujący po landmarkach nie wie, gdzie jest.
- Brak `id` na sekcji → nie da się do niej linkować ani z menu, ani z bloga.

### 1.6 Hierarchia typograficzna wewnątrz karty jest płaska

```tsx
<h3 className="text-dark text-lg leading-snug">          // 18px, waga 500 (body default)
<p  className="text-dark/60 text-sm leading-relaxed">    // 14px, waga 500
```

Różnica 18 → 14 px przy tej samej wadze i bez zmiany koloru nagłówka daje bardzo słaby skok hierarchii. Przy trzech kartach obok siebie oko nie wie, gdzie zaczyna się skan. Dla porównania `HowItWorksSection` używa `text-lg md:text-xl font-medium` na `h3` — czyli w obrębie tego samego landingu istnieją dwie różne konwencje `h3` w karcie.

Drobiazg systemowy: `rounded-2xl` zamiast tokenu `rounded-card` (obie wartości to 16px, ale `design-system.md` mówi wprost o skali `card/panel/hero`).

### 1.7 Rytm siatki: `md:grid-cols-3` jest za wcześnie

`grid md:grid-cols-3 gap-6` przy `md` = 768px daje kolumnę ~230px na kartę o paddingu `p-8` (32px) → ~166px na tekst. Tytuł „Jak planować wspólną przyszłość bez stresu?" łamie się na tablecie na 4–5 linii. Brakuje pośredniego kroku `md:grid-cols-2 lg:grid-cols-3`.

### 1.8 Emocja: sekcja tylko pyta, nigdy nie odpowiada — i powtarza chwyt z hero

Ciąg retoryczny, jaki dostaje użytkownik w pierwszych dwóch ekranach:

```
H1 (hero):    „Czy pieniądze są źródłem TABU w Waszym związku?"        ← pytanie
H2 (pain):    „Czy te wyzwania brzmią znajomo?"                        ← pytanie
h3 karta 1:   „Kto powinien płacić za co?"                             ← pytanie
h3 karta 2:   „Jak uniknąć kłótni o pieniądze?"                        ← pytanie
h3 karta 3:   „Jak planować wspólną przyszłość bez stresu?"            ← pytanie
```

**Pięć pytań pod rząd, zero odpowiedzi.** Hero już raz wymusiło odpowiedź „tak" — druga runda tego samego chwytu nie dokłada napięcia, tylko je rozcieńcza. Copy jest przy tym abstrakcyjne („brak transparentności prowadzi do nieufności" to język raportu, nie „pomocnego znajomego" z `product-context.md` → tone of voice: _lekkość, konkretność, ciepło_). Nie ma ani jednego zdania, w którym para mogłaby rozpoznać samą siebie — nie ma sceny, nie ma cytatu, nie ma liczby.

Efekt: **brak momentu „aha"**. Użytkownik czyta trzy ogólniki, kiwa głową i scrolluje dalej — albo wychodzi.

### 1.9 Brak mostu do kalkulatora — zmarnowana najlepsza szansa na stronie

Następna sekcja to `CalculatorTeaserSection` z H2: **„Ile sprawiedliwie powinno płacić każde z Was?"** — czyli dokładna odpowiedź na kartę nr 1 („Kto powinien płacić za co?"). Te dwa zdania dzieli jedna twarda krawędź `bg-white` → `bg-dark` i ani jedno słowo łączące. Sekcja problemu nie zapowiada rozwiązania, kalkulator startuje od zera. Narracja hero → problem → narzędzie rozpada się dokładnie w zawiasie.

### 1.10 Zero pomiaru

`InteractionTracker` wysyła `section_view` dla każdego `[data-section-view]`. Mają to: `features`, `pricing`, `faq`, `cta_banner`, `calculator_teaser`. **PainPoints nie ma.** Czyli dziś nie wiadomo nawet, ilu użytkowników w ogóle dociera do tej sekcji i jaki procent z nich idzie dalej do kalkulatora — a to jedyna liczba, która pozwoliłaby ocenić, czy redesign coś dał.

### 1.11 Motion

`ScrollReveal delay={i*100}` jest poprawny (respektuje `prefers-reduced-motion`, na mobile degraduje do `fade-in`, animuje wyłącznie `opacity`/`transform` → 0 CLS). Dwie uwagi:
- Na mobile karty i tak wchodzą w viewport pojedynczo, więc `delay` 100/200 ms dokłada opóźnienie do elementu, który już jest opóźniony scrollem — użytkownik patrzy chwilę na puste miejsce.
- `will-change: opacity, transform` ustawiane w `ScrollReveal` nigdy nie jest zdejmowane po animacji (3 dodatkowe warstwy kompozytora utrzymywane do końca życia strony). Przy 3 kartach to szum, ale to systemowy koszt `ScrollReveal` wart odnotowania w kontekście planu mobile-performance.

### 1.12 Poza zakresem, ale znalezione po drodze

`BrandPromiseSection.tsx` ma zahardkodowane polskie treści w komponencie: `Biedronka`, `Zakupy spożywcze`, `129,89 zł`, `23.02.2026`, imiona `Agnieszka` / `Rafał` oraz polski `alt` („Para korzystająca z aplikacji OurMoney"). To złamanie Reguły 1 z `.claude/rules/i18n-rules.md` — na wersji EN sekcja pokaże polski tekst. Mój spec poniżej celowo **nie** powiela tego wzorca (imiona idą do `messages/*.json`).

---

## 2. Cel sekcji w lejku

### Praca do wykonania (jobs-to-be-done sekcji)

Sekcja jest **pierwszym ekranem po hero** — czyli miejscem, w którym rozstrzyga się, czy użytkownik zostanie na stronie. Ma wykonać cztery ruchy w tej kolejności:

1. **Lustro** — pokazać parze jej własną codzienność tak konkretnie, żeby pomyślała „to dosłownie my". Nie kategorię problemu, tylko scenę.
2. **Nazwanie** — dać nazwę czemuś, co para przeżywa, ale czego nie umie nazwać („po równo ≠ sprawiedliwie"). To jest moment „aha" — użytkownik dostaje słownik na własny problem.
3. **Napięcie** — pokazać koszt bezczynności (kłótnia, nieufność, plany utknięte na „kiedyś"), ale bez straszenia i bez oskarżania którejkolwiek ze stron. Marka jest „po stronie związku", nie po stronie tego, kto lepiej liczy.
4. **Zawias** — przekazać uwagę dalej: „pierwsze z tych pytań ma konkretną odpowiedź, jest tuż niżej". Sekcja ma **zarobić na kolejny scroll**, a nie tylko go założyć.

### Stan emocjonalny

| Wejście (po hero) | Wyjście (do kalkulatora) |
|---|---|
| Ciekawość + lekka defensywa („no dobra, znowu apka finansowa") | Rozpoznanie: „to o nas, nie jesteśmy w tym sami" |
| Problem odczuwany, ale nienazwany i wstydliwy | Problem nazwany, odwstydzony i **wspólny** (nie „twoja wina") |
| Brak oczekiwań wobec strony | Konkretne oczekiwanie: „zaraz dostanę narzędzie, nie kazanie" |
| Gotowość do scrolla ~50% | Intencja scrolla: chce zobaczyć liczbę |

**Czego sekcja robić NIE ma**: sprzedawać funkcji (od tego są `Features`), pokazywać produktu (od tego jest `Features`/`BrandPromise`), zbierać kliknięcia w główne CTA (to konkurowałoby z hero i rozbiłoby lejek). Jedyne wyjście z tej sekcji, które ma sens, to **w dół, do kalkulatora**.

---

## 3. Trzy kierunki redesignu

### Kierunek A — „Karty rozmowy" (dialog pary)

Każda karta zawiera **mikro-dialog dwóch osób** — dwie dymki czatu, jedna z każdej strony — czyli dokładnie to zdanie, które pada w prawdziwym mieszkaniu. Pod dialogiem twierdzenie (nie pytanie) nazywające mechanizm i jedno zdanie o koszcie. Pod całą siatką jednolinijkowy **most** do kalkulatora.

```
┌────────────────────── bg-white, py-20 md:py-28 ──────────────────────┐
│                        ZNAMY TE ROZMOWY                              │  eyebrow
│            Trzy rozmowy, które odkładacie na później                 │  h2 font-display
│      Nierówne zarobki, wydatki w biegu, temat na weekend…            │  SectionLead
│                                                                      │
│  ┌──── karta 1 ─────┐  ┌──── karta 2 ─────┐  ┌──── karta 3 ─────┐   │
│  │ Agnieszka        │  │ Rafał            │  │ Agnieszka        │   │
│  │ ╭──────────────╮ │  │ ╭──────────────╮ │  │ ╭──────────────╮ │   │
│  │ │ Zapłaciłem   │ │  │ │ Ile wydaliś- │ │  │ │ Zbieramy na  │ │   │
│  │ │ za zakupy.   │ │  │ │ my w tym     │ │  │ │ wkład własny?│ │   │
│  │ │ Znowu.       │ │  │ │ miesiącu?    │ │  │ ╰──────────────╯ │   │
│  │ ╰──────────────╯ │  │ ╰──────────────╯ │  │        Rafał     │   │
│  │        Rafał     │  │      Agnieszka   │  │ ╭──────────────╮ │   │
│  │ ╭──────────────╮ │  │ ╭──────────────╮ │  │ │ Od czegoś    │ │   │
│  │ │ A ja czynsz  │ │  │ │ Nie wiem.    │ │  │ │ trzeba by    │ │   │
│  │ │ i prąd.      │ │  │ │ Nie liczyłam.│ │  │ │ zacząć.      │ │   │
│  │ ╰──────────────╯ │  │ ╰──────────────╯ │  │ ╰──────────────╯ │   │
│  │ ──────────────── │  │ ──────────────── │  │ ──────────────── │   │
│  │ Płacicie po      │  │ Rozmowa o kasie  │  │ Wspólne plany    │   │
│  │ równo, choć za-  │  │ kończy się       │  │ utknęły na       │   │
│  │ rabiacie różnie  │  │ kłótnią          │  │ „kiedyś"         │   │
│  │ Po równo ≠ spra- │  │ Bez pełnego obra-│  │ Bez wspólnego    │   │
│  │ wiedliwie…       │  │ zu zostaje domysł│  │ licznika…        │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
│                                                                      │
│      Pierwsze z tych pytań ma konkretną odpowiedź.                   │  most
│      → Policzcie sprawiedliwy podział                                │  link #kalkulator
└──────────────────────────────────────────────────────────────────────┘
```

**Kluczowy element wizualny**: dymki dialogowe zbudowane wyłącznie z CSS (`rounded-card` + jeden róg wyzerowany jako „ogonek"), jedna jasna (`bg-white` + `border-dark/10`), jedna ciemna (`bg-dark`, `text-white/90`) — czytelny na pierwszy rzut oka wzorzec „czat". Zero obrazów, zero SVG, zero nowych fontów.

**Plusy**
- Najmocniejsze „aha" z trzech kierunków: cytat działa jak lustro, kategoria problemu nie działa.
- Zero nowych bajtów JS i zero obrazów → neutralne dla LCP/CLS/TBT (kluczowe przy planie mobile-perf ≥ 90).
- Wizualnie **nie duplikuje** żadnej innej sekcji: nigdzie na stronie nie ma dymek. HowItWorks ma ikony w rombach, Features ma telefon, BrandPromise ma karty wydatków.
- Buduje ciągłość marki: ta sama para (Agnieszka + Rafał) wraca w `BrandPromiseSection`, gdzie widać już jej wydatki w aplikacji — mikro-narracja przez całą stronę.
- W pełni RSC, copy w 100% w `messages/*.json`.

**Minusy**
- Ryzyko tonu: źle napisany dialog brzmi jak wyrzut („Znowu.") i może posadzić winę po jednej stronie. Wymaga świadomego balansu — po jednym zdaniu każdej osoby, żadna nie jest „tą złą".
- Więcej tekstu do utrzymania (6 kwestii × 2 języki) i realne ryzyko, że tłumaczenie EN zabrzmi sztucznie — dialog to najtrudniejszy rodzaj copy do przełożenia.
- Karta rośnie w pionie (~+120 px na desktopie), sekcja staje się wyższa.

**Koszt implementacji**: **M** (~3–4 h: komponent + restrukturyzacja kluczy i18n + copy PL/EN + przegląd a11y)
**Ryzyko CLS/LCP/JS**: **znikome**. Brak obrazów → LCP bez zmian (zostaje hero). Treść tekstowa renderowana serwerowo → CLS 0. JS: +3 instancje istniejącego `ScrollReveal` (ten sam chunk, **+0 kB** bundle'a).

---

### Kierunek B — „Dowód i liczba" (editorial + statystyka)

Rezygnacja z kart na rzecz redakcyjnego, dwukolumnowego układu: lewa kolumna to blok nagłówkowy (sticky na desktopie), prawa to trzy wiersze problemów z ikoną lucide, twardą statystyką i mikro-linkiem.

```
┌─────────────────────── bg-white ────────────────────────────────────┐
│ ┌──── sticky, 5/12 ────┐   ┌──────────── 7/12 ──────────────────┐   │
│ │ WASZE WYZWANIA       │   │ ┌──┐  44%                          │   │
│ │                      │   │ │⚖ │  par kłóci się o pieniądze    │   │
│ │ Czy te wyzwania      │   │ └──┘  częściej niż o cokolwiek     │   │
│ │ brzmią znajomo?      │   │       innego                        │   │
│ │                      │   │       ────────────────────────────  │   │
│ │ Nierówne zarobki,    │   │ ┌──┐  2 na 3                       │   │
│ │ wydatki w biegu…     │   │ │💬│  pary nie wiedzą, ile wydały  │   │
│ │                      │   │ └──┘  razem w tym miesiącu         │   │
│ │ → Policzcie podział  │   │       ────────────────────────────  │   │
│ │                      │   │ ┌──┐  7 lat                        │   │
│ └──────────────────────┘   │ │🎯│  tyle średnio para zbiera     │   │
│                            │ └──┘  na wkład własny              │   │
│                            └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

**Kluczowy element wizualny**: duża liczba w `font-display` (spójna z użyciem Instrument Serif na kwotach) + ikony lucide (`Scale`, `MessagesSquare`, `Target`) + cienkie separatory.

**Plusy**
- Wiarygodność i „waga" — liczba zatrzymuje oko skuteczniej niż akapit i daje materiał do udostępnienia / cytowania (wartość SEO i PR).
- Najniższy koszt: to w zasadzie zamiana siatki na listę wierszy.
- Sticky lewa kolumna czyta się „premium" i nie powtarza wyśrodkowanego rytmu reszty strony.

**Minusy**
- **Wymaga prawdziwych źródeł.** Wymyślona statystyka na stronie fintechu to ryzyko reputacyjne i regulacyjne — każda liczba musi mieć publikację i przypis. Dziś takich danych w repo nie ma.
- Lewa kolumna + prawa lista to dokładnie ten sam szkielet, co `FeaturesSection` (lewo: nagłówek + lista, prawo: wizual) — dwie sekcje na jednej stronie o tej samej kompozycji.
- Liczba chłodzi emocję. Sekcja miała budować empatię, a buduje raport.
- Sticky column wymaga uwagi na tablecie i może powodować „lepkie" wrażenie przy Lenisie.

**Koszt implementacji**: **S/M** (~2 h kodu) + **nieoszacowany research** źródeł
**Ryzyko CLS/LCP/JS**: znikome dla kodu (`position: sticky` = czysty CSS, 0 kB JS). Realne ryzyko leży poza kodem — w danych.

---

### Kierunek C — „Które z tych brzmi znajomo?" (interaktywny wybór)

Trzy „chipy" do zaznaczenia. Zaznaczenie odsłania spersonalizowaną odpowiedź i kieruje do właściwego miejsca (kalkulator / koperty / cele).

```
┌──────────────────────── bg-white ───────────────────────────────────┐
│                  Które z tych brzmi znajomo?                        │
│                                                                     │
│   ┌───────────────┐ ┌───────────────┐ ┌───────────────┐            │
│   │ ☑ Nie wiemy,  │ │ ☐ Kłócimy się │ │ ☐ Plany stoją │            │
│   │   kto ile     │ │   o wydatki   │ │   w miejscu   │            │
│   │   powinien    │ │               │ │               │            │
│   └───────────────┘ └───────────────┘ └───────────────┘            │
│                                                                     │
│   ╭───────────────── panel odpowiedzi ────────────────────╮         │
│   │ Zaznaczyliście 1 z 3. To najczęstszy start.           │         │
│   │ Zacznijcie od podziału → Policzcie w 30 sekund        │         │
│   ╰────────────────────────────────────────────────────────╯        │
└─────────────────────────────────────────────────────────────────────┘
```

**Kluczowy element wizualny**: interakcja sama w sobie (chipy + odsłaniany panel). Da się to zrobić **bez JS** — `<input type="checkbox" class="sr-only peer">` + `peer-checked:` w Tailwind — więc bundle rośnie tylko wtedy, gdy chcemy to mierzyć.

**Plusy**
- Mikro-zaangażowanie: zaznaczenie = mikro-zobowiązanie, klasyczny mechanizm podnoszący konwersję dalej w lejku.
- Daje twardy sygnał produktowy: **który** ból wybierają użytkownicy — bezcenne do priorytetyzacji roadmapy i do copy reszty strony.
- Naturalna, uzasadniona personalizacja mostu do kolejnej sekcji.

**Minusy**
- Na pierwszej sekcji pod hero interakcja **konkuruje z głównym CTA** i może rozpraszać zamiast prowadzić. Ryzyko „zabawki".
- Bez trackingu traci połowę wartości, a tracking = komponent kliencki + nowy event GA4 + zgoda cookie (wybór bólu finansowego to dana wrażliwa marketingowo — do sprawdzenia z polityką prywatności).
- Odsłaniany panel = **zmiana wysokości dokumentu po interakcji**. To nie liczy się do CLS (jest po interakcji użytkownika), ale przesuwa całą stronę pod spodem — na mobile bardzo nieprzyjemne.
- Najwyższy koszt projektowy: trzeba zaprojektować i napisać stany 0/1/2/3 zaznaczeń (4 warianty × 2 języki).

**Koszt implementacji**: **L** (~6–8 h z trackingiem, testami stanów i a11y dla grupy checkboxów)
**Ryzyko CLS/LCP/JS**: **najwyższe z trzech**. Wariant CSS-only: +0 kB, ale ryzyko skoku layoutu. Wariant z trackingiem: +~1,5 kB JS, kolejna wyspa kliencka na krytycznej ścieżce — wprost pod prąd planu `2026-03-17-mobile-performance-90.md`.

---

## 4. Rekomendacja

### Kierunek A — „Karty rozmowy", z jednym elementem zapożyczonym z B

**Wybieram A** i świadomie wchłaniam z B **wyłącznie most do kalkulatora** (jednolinijkowy wiersz pod siatką). Z B **nie** biorę statystyk — do czasu, aż będą prawdziwe źródła. C odrzucam.

**Uzasadnienie:**

1. **Praca sekcji to empatia, nie dowód.** Pozycja 1 pod hero to moment rozpoznania, nie moment argumentacji. Dowód (liczby, porównanie z konkurencją, opinie) ma na tej stronie już swoje miejsca: `ComparisonSection`, `TestimonialsSection`, `TrustSection`. Wstawianie statystyk tutaj dubluje ich pracę i chłodzi ścieżkę dokładnie tam, gdzie powinna się rozgrzewać.

2. **Cytat konwertuje lepiej niż kategoria.** „Kto powinien płacić za co?" to nazwa problemu. „Zapłaciłem za zakupy. Znowu." / „A ja wzięłam czynsz i prąd." to **scena**, którą para przeżyła w zeszłym tygodniu. Rozpoznanie siebie to jedyny mechanizm, który zamienia obojętny scroll w uwagę.

3. **Zero kosztu wydajnościowego.** Projekt jest po (i wciąż w trakcie) walki o Lighthouse mobile ≥ 90. A nie dokłada ani jednego bajtu JS, ani jednego obrazu, ani jednego żądania sieciowego. LCP zostaje na hero, CLS = 0, TBT bez zmian. Przy B ryzyko też jest niskie, ale przy C — realne.

4. **Wizualna unikalność bez nowego wzorca.** Dymka to nowy kształt na stronie, ale zbudowany wyłącznie z istniejących tokenów (`--color-dark`, `--color-surface`, `--radius-card`) i istniejących komponentów (`ScrollReveal`, `SectionLead`). Nie powstaje nowy podsystem do utrzymania.

5. **Most naprawia najdroższy błąd audytu** (§1.9) niższym kosztem niż cały redesign: jedno zdanie i jeden kotwiczący link zszywają „problem" z „narzędziem".

**Element kliencki**: **żaden nowy.** Sekcja zostaje Server Componentem. Jedyny JS to `ScrollReveal`, który już jest w bundlu, i `InteractionTracker`, który już jest na stronie — wystarczy dodać atrybut `data-section-view="pain_points"` (patrz §7).
Most implementujemy jako zwykłe `<a href="#kalkulator">` — zero JS, działa bez hydracji, jest indeksowalny jako link wewnętrzny. Trackowanie kliknięcia w most jest **opcjonalne** i wymagałoby maleńkiego komponentu klienckiego; rekomenduję najpierw zmierzyć lejek przez `section_view` (koszt 0) i dopiero potem zdecydować, czy warto (patrz §7).

---

## 5. Spec kierunku A

### 5.1 Layout — desktop (≥ 1024 px)

Kontener bez zmian: `max-w-6xl mx-auto px-6`, sekcja `bg-white py-20 md:py-28`.

```
│←─────────────────────── max-w-6xl (1152) ───────────────────────────→│

                      ZNAMY TE ROZMOWY                      ← eyebrow, text-xs
         Trzy rozmowy, które odkładacie na później          ← h2, lg:text-6xl
      Nierówne zarobki, wydatki ustalane w biegu, temat     ← SectionLead
              pieniędzy przekładany na weekend…               (max-w-2xl)

                          ↕ mb-12 md:mb-16

┌── karta (1/3) ──────┐ ┌── karta (1/3) ──────┐ ┌── karta (1/3) ──────┐
│ p-8                 │ │                     │ │                     │
│ Agnieszka      ←12px│ │ Rafał               │ │ Agnieszka           │
│ ╭─────────────────╮ │ │ ╭─────────────────╮ │ │ ╭─────────────────╮ │
│ │ jasna dymka     │ │ │ │                 │ │ │ │                 │ │
│ │ max-w-[85%]     │ │ │ │                 │ │ │ │                 │ │
│ ╰─────────────────╯ │ │ ╰─────────────────╯ │ │ ╰─────────────────╯ │
│         ↕ gap-2     │ │                     │ │                     │
│          Rafał  →   │ │        Agnieszka →  │ │           Rafał →   │
│ ╭─────────────────╮ │ │ ╭─────────────────╮ │ │ ╭─────────────────╮ │
│ │ ciemna dymka    │ │ │ │                 │ │ │ │                 │ │
│ ╰─────────────────╯ │ │ ╰─────────────────╯ │ │ ╰─────────────────╯ │
│         ↕ mt-8      │ │                     │ │                     │
│ ─── separator ───   │ │ ─── separator ───   │ │ ─── separator ───   │
│         ↕ mt-6      │ │                     │ │                     │
│ h3 — twierdzenie    │ │ h3                  │ │ h3                  │
│         ↕ mt-3      │ │                     │ │                     │
│ p  — koszt, 1 zdanie│ │ p                   │ │ p                   │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘
        ↑ gap-8 (32) między kartami, karty h-full = równa wysokość

                          ↕ mt-16

        Pierwsze z tych pytań ma konkretną odpowiedź.       ← bridgeLead
             Policzcie sprawiedliwy podział  →              ← link #kalkulator
```

Karty: `rounded-panel` (24 px — świadomie większy niż `rounded-card` 16 px używany w HowItWorks/BrandPromise, żeby sekcja miała własny charakter), `bg-surface` (#f7f5f2), `border border-dark/8`, bez cienia.
**Jedno tło dla wszystkich trzech kart** — likwidacja `CARD_COLORS`. Różnicuje treść, nie losowy odcień.

### 5.2 Layout — tablet (768–1023 px)

```
┌──── karta 1 (1/2) ────┐ ┌──── karta 2 (1/2) ────┐
│                       │ │                       │
└───────────────────────┘ └───────────────────────┘
┌──────── karta 3 (col-span-2, dymki obok siebie) ─┐
│ ╭──── dymka A ────╮   ╭──── dymka B ────╮        │
│ h3 + p na całej szerokości, max-w-xl             │
└──────────────────────────────────────────────────┘

                 most (wyśrodkowany)
```

Klasy: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8`, trzecia karta `md:col-span-2 lg:col-span-1`.
To naprawia §1.7 — dziś `md:grid-cols-3` ściska kartę do ~230 px przy 768 px.

### 5.3 Layout — mobile (≤ 400 px)

```
┌──────── px-6, karta p-6 ────────┐
│ Agnieszka                       │
│ ╭─────────────────────────╮     │
│ │ dymka jasna, max-w-[88%]│     │
│ ╰─────────────────────────╯     │
│                        Rafał    │
│     ╭─────────────────────────╮ │
│     │ dymka ciemna            │ │
│     ╰─────────────────────────╯ │
│ ────────────────────────────    │
│ h3 (text-lg)                    │
│ p  (text-sm)                    │
└─────────────────────────────────┘
              ↕ gap-6
        [karta 2]  [karta 3]
              ↕ mt-12
     Pierwsze z tych pytań ma
       konkretną odpowiedź.
    Policzcie sprawiedliwy podział →
```

Jedna kolumna, **ten sam układ co desktop** (tylko węższy) → zero dywergencji layoutów, zero ryzyka rozjazdu przy edycji copy. Dymki `max-w-[88%]` zamiast 85%, żeby przy 360 px nie robiły z 8-wyrazowego zdania czterech linii. Link mostu w osobnej linii pod tekstem, touch target `min-h-[44px]` przez `py-3 -my-3`.

### 5.4 Typografia (wyłącznie istniejące klasy)

| Element | Klasy | Uwaga |
|---|---|---|
| Eyebrow | `text-xs uppercase tracking-[0.2em] text-dark/60` | **zmiana z `/40`** — fix kontrastu 2,3:1 → 4,81:1 |
| H2 | `font-display text-4xl md:text-5xl lg:text-6xl text-dark leading-tight` | bez zmian |
| Lead | `<SectionLead>` | bez zmian (komponent trzyma `max-w-2xl`) |
| Imię nad dymką | `text-xs uppercase tracking-[0.1em] text-dark/60` | 12 px, nie schodzić niżej (audyt DS: `text-[10px]` zakazane) |
| Tekst w dymce jasnej | `text-sm leading-relaxed text-dark/80` | 14 px, waga body 500 |
| Tekst w dymce ciemnej | `text-sm leading-relaxed text-white/90` | min. `/80` wg zasad DS |
| H3 karty | `text-lg md:text-xl font-medium text-dark leading-snug` | **zmiana** — wyrównanie do konwencji `HowItWorksSection` |
| Opis karty | `text-sm leading-relaxed text-dark/70` | **zmiana z `/60`** — fix kontrastu |
| Most — zdanie | `text-base text-dark/70` | |
| Most — link | `text-sm font-semibold text-accent-deep` | `--color-accent-deep` istnieje dokładnie po to: 5,4:1 na jasnym |

`font-display` **wyłącznie** w H2. Żadnych wartości arbitralnych w skali. Reguła `text-wrap: balance/pretty` działa globalnie — nie dodawać punktowo.

### 5.5 Kolory (tylko tokeny z `globals.css`)

| Rola | Token | Wartość |
|---|---|---|
| Tło sekcji | `bg-white` | — (bez zmian, zachowuje alternację hero-dark → jasne → calculator-dark) |
| Tło karty | `--color-surface` → `bg-surface` | #f7f5f2 |
| Obrys karty | `--color-dark` @ 8% → `border-dark/8` | |
| Dymka „ona" | `bg-white` + `border-dark/10` | |
| Dymka „on" | `--color-dark` → `bg-dark`, tekst `text-white/90` | #141414 |
| Separator w karcie | `bg-dark/8` (`h-px`) | |
| Tekst główny | `--color-dark` → `text-dark` | |
| Tekst wspierający | `text-dark/70`, `text-dark/60` | |
| Link mostu | `--color-accent-deep` → `text-accent-deep` | #557300 |
| Focus ring | `outline-accent-deep` | `--color-accent` (#bbff00) na bieli ma 1,3:1 — **nie nadaje się na focus ring** |

**Do usunięcia**: tablica `CARD_COLORS` i wszystkie inline `style={{ backgroundColor }}`. Token `--color-surface-cool` (#e4e9f5) traci jedynego konsumenta — do rozważenia usunięcie z `@theme` przy sprzątaniu (osobny commit, nie razem z tą zmianą).

### 5.6 Spacing (siatka 8 px)

```
sekcja            px-6 py-20 md:py-28          (24 / 80 / 112)
blok nagłówka     mb-12 md:mb-16               (48 / 64)
siatka            gap-6 lg:gap-8               (24 / 32)
karta             p-6 md:p-8                   (24 / 32)
imię → dymka      mt-1                         (4  — legalny mikro-krok: label ↔ wartość)
dymka → dymka     mt-2                         (8)
dymki → separator mt-8                         (32)
separator → h3    mt-6                         (24)
h3 → p            mt-3                         (12 — legalny mikro-krok wewnątrz komponentu)
siatka → most     mt-12 md:mt-16               (48 / 64)
zdanie → link     mt-2                         (8)
dymka padding     px-4 py-3                    (16 / 12)
```

Zero wartości `-0.5`, `-1.5`, `-3.5`, `-5`, `-7` i zero arbitralnych px — zgodnie z §Odstępy w `design-system.md`.

### 5.7 Ikony i elementy rysunkowe

- **Karty: bez ikon.** Świadoma decyzja — `HowItWorksSection` ma ikony w rombach, `BrandPromiseSection` ikony w kółkach. Trzecia sekcja z ikonami zamieniłaby stronę w katalog ikon, a dymka jest już wystarczająco czytelnym znakiem.
- **Most**: `ArrowDown` z `lucide-react` (`size={16}`, `aria-hidden="true"`) — strzałka w dół, nie w prawo, bo cel jest niżej na tej samej stronie. `ArrowRight` jest już zajęte przez CTA kalkulatora i Features; `ArrowDown` czytelnie oznacza „scroll", nie „przejście".
- **Ogonek dymki**: bez SVG i bez trójkątów CSS. `rounded-panel` z jednym rogiem wyzerowanym: dymka lewa `rounded-panel rounded-bl-none`, prawa `rounded-panel rounded-br-none`. Zero nowych wartości promienia.

### 5.8 Motion

| Co | Jak | Dlaczego |
|---|---|---|
| Blok nagłówka | `<ScrollReveal>` domyślne `fade-up`, 500 ms | bez zmian |
| Karta | `<ScrollReveal delay={i * 90}>` | stagger skrócony ze 100 → 90 ms; 3 × 90 = 270 ms całego wejścia |
| **Dymka-odpowiedź** | zagnieżdżony `<ScrollReveal delay={i * 90 + 180}>` | druga kwestia pojawia się **po** pierwszej — mikro-dramaturgia „odpowiedzi". Używa istniejącego komponentu, **0 kB nowego kodu** |
| Most | `<ScrollReveal delay={300}>` | wchodzi jako ostatni, domyka narrację |
| Hover dymki (desktop) | `@media (hover: hover)` → `transition-transform hover:-translate-y-px` | ledwo zauważalne „ożywienie"; pominąć, jeśli zespół uzna za szum |

Easing: `cubic-bezier(0.22, 1, 0.36, 1)` — dziedziczone z `ScrollReveal`, identyczne z resztą strony.
**`prefers-reduced-motion`**: obsłużone bez dodatkowego kodu — `ScrollReveal` sprawdza `matchMedia` i przy `reduce` ustawia stan końcowy natychmiast. Hover-lift dodatkowo zgasić w `@media (prefers-reduced-motion: reduce)`.
**Mobile**: `ScrollReveal` sam degraduje do `fade-in` (bez translacji) — zgodnie z planem mobile-perf.
**CLS**: animowane wyłącznie `opacity` i `transform` → 0. Żaden element nie zmienia wysokości dokumentu.

### 5.9 Stany hover / focus

- **Karta nie jest klikalna** → **żadnego** hovera na karcie (dziś też go nie ma i dobrze). Cień/uniesienie sugerowałoby link, którego nie ma — to najczęstszy fałszywy sygnał afordancji na landingach.
- **Dymka**: opcjonalny `-translate-y-px` (§5.8), czysto dekoracyjny.
- **Link mostu** — jedyny interaktywny element sekcji:
  - `hover:` — `underline underline-offset-4 decoration-2` + `text-accent-deep` bez zmiany koloru (kolor już jest akcentem);
  - `focus-visible:` — `outline-2 outline-offset-4 outline-accent-deep rounded-card` (widoczny na bieli, w przeciwieństwie do `--color-accent`);
  - target dotykowy `py-3 -my-3` → 44 px wysokości bez zmiany rytmu wizualnego;
  - `transition-colors duration-200`.

### 5.10 Dostępność

```tsx
<section
  id="wyzwania"
  aria-labelledby="painpoints-title"
  data-section-view="pain_points"
  className="bg-white px-6 py-20 md:py-28"
>
  …
  <h2 id="painpoints-title" className="font-display …">{t('title')}</h2>
  …
  <ul role="list" className="grid … list-none p-0 m-0">
    <li>
      <article className="h-full rounded-panel border border-dark/8 bg-surface p-6 md:p-8">
        <h3 className="text-lg md:text-xl font-medium …">{item.title}</h3>
        <figure className="mt-6 m-0 flex flex-col gap-2">
          <figcaption className="sr-only">{t('dialogueLabel')}</figcaption>
          {/* dymka 1: imię (p.text-xs) + <blockquote><p>…</p></blockquote> */}
          {/* dymka 2: j.w., wyrównana do prawej */}
        </figure>
        <p className="mt-6 text-sm leading-relaxed text-dark/70">{item.description}</p>
      </article>
    </li>
    …
  </ul>
```

Decyzje i uzasadnienia:

1. **`role="list"` na `<ul>`** — `list-none` w Safari wycina semantykę listy z VoiceOver. Ten sam fix należy się `FeaturesSection` i `HowItWorksSection` (osobne zadanie).
2. **Kolejność w DOM: `h3` → dialog → opis.** Czytnik ekranu słyszy najpierw twierdzenie („Płacicie po równo, choć zarabiacie różnie"), potem ilustrujący je cytat, potem konsekwencję — logiczna kolejność bez żadnego przestawiania CSS-em. Wariant „dialog na górze" odrzucony: wymagałby rozjazdu DOM vs widok.
3. **`<figure>` + `<blockquote>` + `<figcaption class="sr-only">`** z tekstem „Przykładowa rozmowa pary o wspólnych wydatkach" — czytnik dostaje kontekst, że to scenka, a nie prawdziwa opinia klienta. To ważne także etycznie: to nie są testimoniale.
4. **Imiona są widocznym tekstem** przed każdą dymką, więc czytnik naturalnie czyta „Agnieszka … Rafał …" — bez potrzeby `aria-label`.
5. **Kontrast** — wszystkie pary policzone w §1.4 i §5.4; po zmianach każda kombinacja ≥ 4,5:1 (tekst) i ≥ 3:1 (obrysy).
6. **Kolejność fokusa**: w sekcji jest **jeden** element fokusowalny (link mostu), umieszczony jako ostatni w DOM i ostatni wizualnie — zero pułapek.
7. **Kotwica `id="wyzwania"`** — cel dla linków z bloga, ale **nie** dodawać do nawigacji (menu ma już 4 pozycje).
8. **Zoom 200% / `text-spacing`**: karty rosną w pionie, siatka schodzi do 1 kolumny, dymki `max-w-[88%]` — nic nie ucieka poza viewport.
9. **Bez JS strona jest w pełni czytelna** — `ScrollReveal` ukrywa elementy dopiero w `useEffect`, więc przy zablokowanym JS treść po prostu jest widoczna (ważne: nie wolno przenosić stanu początkowego do klas SSR).

---

## 6. Copy — PL i EN

### 6.1 Struktura kluczy `HomePage.painPoints` (zmiana schematu)

```jsonc
{
  "eyebrow":  "…",            // ZMIANA treści
  "title":    "…",            // ZMIANA treści
  "subtitle": "…",            // ZMIANA treści (skrót)
  "dialogueLabel": "…",       // NOWY — figcaption sr-only
  "items": [{
    "title":       "…",       // ZMIANA: pytanie → twierdzenie
    "description": "…",       // ZMIANA: język raportu → język ludzki
    "dialogue": [             // NOWE pole
      { "speaker": "…", "line": "…" },
      { "speaker": "…", "line": "…" }
    ]
  }],
  "bridgeLead": "…",          // NOWY — zdanie mostu
  "bridgeCta":  "…"           // NOWY — link do #kalkulator
}
```

Typ w komponencie rozszerza się o `dialogue: { speaker: string; line: string }[]`. Imiona **w pliku tłumaczeń**, nie w kodzie — inaczej powtórzymy błąd z `BrandPromiseSection` (§1.12).

### 6.2 PL — `messages/pl.json`

| Klucz | Propozycja | Status |
|---|---|---|
| `eyebrow` | **Znamy te rozmowy** | ZMIANA |
| `title` | **Trzy rozmowy, które odkładacie na później** | ZMIANA |
| `subtitle` | **Nierówne zarobki, wydatki ustalane w biegu, temat pieniędzy przekładany na weekend. Tak wygląda wspólny budżet domowy w większości związków — i tak zaczyna się większość kłótni.** | ZMIANA (skrót + fraza „wspólny budżet domowy" zostaje) |
| `dialogueLabel` | Przykładowa rozmowa pary o wspólnych wydatkach | NOWY |

**Karta 1** — ZMIANA
- `title`: **Płacicie po równo, choć zarabiacie różnie**
- `dialogue[0]`: Agnieszka — „Zapłaciłam wczoraj za zakupy. Znowu."
- `dialogue[1]`: Rafał — „A ja wziąłem czynsz i prąd. Chyba wychodzi na to samo?"
- `description`: **Po równo nie zawsze znaczy sprawiedliwie. Przy różnych zarobkach ten sam rachunek waży dla każdego z Was inaczej.**

**Karta 2** — ZMIANA
- `title`: **Rozmowa o pieniądzach kończy się kłótnią**
- `dialogue[0]`: Rafał — „Ile w sumie wydaliśmy w tym miesiącu?"
- `dialogue[1]`: Agnieszka — „Nie wiem. Nie liczyłam."
- `description`: **Kiedy żadne z Was nie ma pełnego obrazu, zostaje domysł. A domysł szybko zamienia się w zarzut.**

**Karta 3** — ZMIANA
- `title`: **Wspólne plany utknęły na „kiedyś"**
- `dialogue[0]`: Agnieszka — „Zbieramy na wkład własny czy nie?"
- `dialogue[1]`: Rafał — „Od czegoś trzeba by zacząć."
- `description`: **Mieszkanie, ślub, dziecko. Bez wspólnego licznika każdy plan zostaje w sferze rozmów.**

**Most** — NOWE
- `bridgeLead`: **Pierwsza z tych rozmów ma konkretną odpowiedź.**
- `bridgeCta`: **Policzcie sprawiedliwy podział** (→ `#kalkulator`)

### 6.3 EN — `messages/en.json`

| Klucz | Propozycja | Status |
|---|---|---|
| `eyebrow` | **We know these conversations** | ZMIANA |
| `title` | **Three conversations you keep postponing** | ZMIANA |
| `subtitle` | **Unequal incomes, spending decided on the fly, the money talk pushed to the weekend. That is what a shared household budget looks like in most relationships — and where most arguments start.** | ZMIANA |
| `dialogueLabel` | A sample conversation between partners about shared expenses | NOWY |

**Card 1** — `title`: **You split 50/50, but you don't earn 50/50**
- Anna — „I paid for the groceries yesterday. Again."
- Mark — „And I covered rent and electricity. Roughly even, right?"
- `description`: **Equal is not always fair. When you earn differently, the same bill weighs differently on each of you.**

**Card 2** — `title`: **Every money talk turns into an argument**
- Mark — „How much did we actually spend this month?"
- Anna — „No idea. I didn't count."
- `description`: **When neither of you has the full picture, all that is left is guessing. And guessing quickly turns into blame.**

**Card 3** — `title`: **Your plans are stuck at "someday"**
- Anna — „Are we saving for the deposit or not?"
- Mark — „We'd have to start somewhere."
- `description`: **A flat, a wedding, a child. Without a shared counter, every plan stays a conversation.**

**Bridge** — `bridgeLead`: **The first of those conversations has a concrete answer.** · `bridgeCta`: **Calculate a fair split**

Imiona EN: **Anna / Mark** (neutralne międzynarodowo). Do decyzji właściciela — patrz §8.

### 6.4 Co zostaje bez zmian

- H2, lead i CTA sąsiednich sekcji (hero, kalkulator) — **nie ruszam**.
- Struktura trzech punktów bólu i ich kolejność: podział → kłótnie → plany. Kolejność jest celowa i musi zostać, bo punkt 1 jest zawiasem do kalkulatora.
- Frazy SEO: „wspólny budżet domowy" zostaje w `subtitle`; utracona z `eyebrow` fraza „finanse … pary" i tak kanibalizowała `hero.eyebrow` („Wspólny budżet domowy dla par") oraz `features.subtitle`. Netto strona nic nie traci.

### 6.5 Zasady tonu użyte w copy

- Każda para kwestii jest **zbalansowana** — po jednym zdaniu każdej osoby, żadna nie jest „tą, która nie ogarnia". Marka jest po stronie związku (`brandPromise.title`).
- Zero żargonu, zero straszenia, zero trybu rozkazującego („musicie kontrolować").
- Forma „Wy/Wasze" — spójna z resztą landingu (hero: „w Waszym związku", kalkulator: „każde z Was").
- Tytuły kart to **twierdzenia**. Usuwa to efekt „pięciu pytań pod rząd" z §1.8 i przenosi jedyne pytanie z powrotem tam, gdzie działa — do hero.

---

## 7. Metryki sukcesu i pomiar

### 7.1 Krok zerowy: zmierzyć PRZED redesignem

Najtańsza i najważniejsza rekomendacja całego audytu: **dodać `data-section-view="pain_points"` do obecnej sekcji już teraz** i zebrać 2 tygodnie baseline'u, zanim cokolwiek się zmieni. To jeden atrybut — `InteractionTracker` (`src/components/layout/InteractionTracker.tsx`) obsłuży resztę, wysyłając `section_view` raz na pageview. Bez tego redesign będzie nieweryfikowalny.

### 7.2 Lejek do obserwacji (wszystko na istniejących eventach)

```
page_view (/)
   └─ section_view: pain_points          ← DO DODANIA (dziś nie istnieje)
        └─ section_view: calculator_teaser   ← już jest
             └─ calculator_used              ← już jest (raz na sesję)
                  └─ cta_click / app_open    ← już jest
```

### 7.3 Wskaźniki

| Metryka | Jak liczyć | Cel |
|---|---|---|
| **Zasięg sekcji** | `section_view(pain_points) / page_view(/)` | baseline → utrzymać |
| **Przepływ do kalkulatora** (główna metryka) | `section_view(calculator_teaser) / section_view(pain_points)` | **+5–10 p.p.** vs baseline |
| **Użycie kalkulatora** | `calculator_used / section_view(pain_points)` | +10% względnie |
| **CTR mostu** (jeśli otagowany) | `cta_click[pain_points_bridge] / section_view(pain_points)` | 3–6% to dobry wynik dla linku tekstowego w połowie strony |
| **Zaangażowanie** | `engagement_time_msec` na `/` (GA4) | +5 s mediany |
| **Wyjścia** | exit rate strony głównej | spadek |
| **Jakość, nie tylko ruch** | `app_open` na sesję | bez pogorszenia |
| **Wydajność (guard-rail)** | Lighthouse mobile: LCP, CLS, TBT | **bez regresji** — spec zakłada 0 kB JS i 0 obrazów, więc każda zmiana tych metryk = błąd implementacji |

### 7.4 Nowe eventy — rekomendacja: żadnych

Sekcja w kierunku A nie zyskuje interakcji poza jednym linkiem. **Nie tworzyć nowego eventu.** Jeśli chcemy mierzyć most, użyć istniejącego `trackCTAClick({ location: 'pain_points_bridge', … })` z `src/lib/analytics.ts` — wtedy kliknięcie wpada do tego samego raportu `cta_click`, co wszystkie pozostałe CTA i jest porównywalne. Koszt: mały komponent kliencki opakowujący `<a>` (wzorem `InvertDotButton`). **Decyzja: dodać dopiero w drugiej iteracji**, jeśli `section_view` pokaże, że zasięg jest, a przejście dalej nie rośnie.
(Nowy event — np. `pain_point_select` — byłby potrzebny wyłącznie przy odrzuconym kierunku C.)

### 7.5 Jak weryfikować jakościowo

- 5 nagrań sesji / mapa scroll-depth w Clarity lub Hotjar: czy wzrok zatrzymuje się na dymkach, czy sekcja jest przescrollowywana jednym gestem.
- Test 5-sekundowy na 5 parach: „co ta sekcja o Was mówi?" — jeśli padnie zdanie z dymki, „aha" zadziałało.
- Test A/B jest tu **niepolecany**: przy ~50 parach ruchu (patrz `hero.socialProof`) nie osiągniemy istotności statystycznej. Decyzję oprzeć na baseline → after + obserwacji jakościowej.

---

## 8. Pytania otwarte do właściciela produktu

1. **Imiona jako element marki** — czy Agnieszka i Rafał z `BrandPromiseSection` mogą stać się „parą przewodnią" landingu i wracać w dymkach tej sekcji? Jeśli tak, ich imiona trzeba wyprowadzić z kodu do `messages/*.json` (dziś są zahardkodowane, przez co wersja EN pokazuje polskie imiona). Jeśli nie — potrzebna decyzja o anonimowych etykietach („Ona"/„On" jest tonalnie ryzykowne i wyklucza pary nieheteronormatywne).
2. **Ton dialogów** — czy zdania w rodzaju „Nie wiem. Nie liczyłam." są akceptowalne, czy zbyt blisko przypisania winy? Mam przygotowaną łagodniejszą wersję („Chyba nikt z nas tego nie liczy"), ale traci ona ostrość rozpoznania.
3. **Cel mostu** — kotwica `#kalkulator` (sekcja niżej, użytkownik zostaje na stronie) czy `/kalkulator` (pełne narzędzie, ale wyjście z lejka homepage)? Rekomenduję kotwicę; teaser i tak prowadzi dalej własnym CTA.
4. **H2 przestaje być pytaniem** — czy „Czy te wyzwania brzmią znajomo?" ma jakiekolwiek wyświetlenia w Search Console? Jeśli tak, zamiana na „Trzy rozmowy, które odkładacie na później" wymaga świadomej zgody; jeśli nie (co zakładam), zmiana jest czysto zyskowna.
5. **Budżet na wizual** — czy sekcja ma pozostać text-only (moja rekomendacja: tak, ze względu na LCP/TBT i plan mobile-perf), czy jest apetyt na ilustrację/zdjęcie? Jeśli tak, potrzebna decyzja o źródle i budżecie ~150 kB, którego dziś plan wydajnościowy nie przewiduje.

---

## Załącznik: podsumowanie zmian do wdrożenia

| # | Zmiana | Plik | Koszt | Priorytet |
|---|---|---|---|---|
| 1 | `data-section-view="pain_points"` (baseline pomiaru) | `PainPointsSection.tsx` | 1 min | **przed wszystkim** |
| 2 | Fix kontrastu: eyebrow `/40`→`/60`, opisy `/60`→`/70` | `PainPointsSection.tsx` | 5 min | P0 (a11y) |
| 3 | `role="list"` + `aria-labelledby` + `id` | `PainPointsSection.tsx` | 5 min | P0 (a11y) |
| 4 | Usunięcie `CARD_COLORS`, jedno `bg-surface` + `border-dark/8` | `PainPointsSection.tsx` | 15 min | P1 |
| 5 | `md:grid-cols-2 lg:grid-cols-3` + `md:col-span-2` na 3. karcie | `PainPointsSection.tsx` | 10 min | P1 |
| 6 | Dymki dialogowe + nowa struktura karty | `PainPointsSection.tsx` | ~1,5 h | P1 (rdzeń) |
| 7 | Most do kalkulatora (`<a href="#kalkulator">` + `ArrowDown`) | `PainPointsSection.tsx` | 20 min | P1 (rdzeń) |
| 8 | Copy PL + EN, nowe klucze `dialogue`/`bridgeLead`/`bridgeCta`/`dialogueLabel` | `messages/pl.json`, `messages/en.json` | ~1 h | P1 |
| 9 | `rounded-2xl` → `rounded-panel`, `key={i}` → `key={item.title}` | `PainPointsSection.tsx` | 5 min | P2 |
| 10 | (osobno) `role="list"` w `FeaturesSection` i `HowItWorksSection`; i18n dla twardego copy w `BrandPromiseSection` | 3 pliki | ~40 min | P2, osobny commit |

Po wdrożeniu: aktualizacja `ai-lib/context-map/pages.md` (opis sekcji), `analytics.md` (nowy `section_view: pain_points`), `i18n.md` (nowa struktura klucza `painPoints`) oraz wpis w `INDEX.md` — zgodnie z Regułą 3 z `.claude/rules/ai-lib-workflow.md`.

---

_Raport przygotowany 2026-09-13. Żaden plik projektu nie został zmodyfikowany._
