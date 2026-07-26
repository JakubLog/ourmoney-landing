# Prompt: System typograficzny i układ sekcji — ourmoney.pl

## Kontekst

Jesteś frontend developerem pracującym nad landing page'em ourmoney.pl — aplikacji do zarządzania wspólnymi finansami dla par. Strona jest zbudowana w Next.js. Twoim zadaniem jest wdrożenie spójnego systemu typograficznego i uporządkowanie kolejności sekcji zgodnie z poniższą specyfikacją.

---

## System typograficzny

Strona używa dwóch czcionek:

1. **Czcionka emocjonalna (serif/italic)** — np. obecna czcionka dekoracyjna widoczna w hero. Używana WYŁĄCZNIE w nagłówkach sekcji emocjonalnych — tych, które mają wzbudzić uczucie, zidentyfikować ból lub pokazać transformację.

2. **Czcionka informacyjna (sans-serif, bold)** — nowoczesna, czytelna. Używana we WSZYSTKICH sekcjach produktowych, logicznych i dowodowych — tam gdzie przekazujemy fakty, mechanizmy działania, porównania.

### Reguła przypisania czcionki do sekcji

| Sekcja | Typ | Czcionka nagłówka | Tło |
|--------|-----|-------------------|-----|
| Hero | emocjonalna | serif/italic | zdjęcie pary (ciemne) |
| Pain Points — „Czy te wyzwania brzmią znajomo?" | emocjonalna | serif/italic | białe |
| Przed i po OurMoney | emocjonalna | serif/italic | beżowe |
| Jak OurMoney rozwiązuje Wasze problemy | informacyjna | sans-serif bold | białe |
| Dlaczego nie Excel, Splitwise czy notatki? | informacyjna | sans-serif bold | beżowe |
| Zacznij w 3 prostych krokach | informacyjna | sans-serif bold | białe |
| Jesteśmy po stronie związku | emocjonalna | serif/italic | białe |
| Testimoniale | informacyjna | sans-serif bold | beżowe |
| FAQ | informacyjna | sans-serif bold | białe |
| Końcowe CTA | emocjonalna | serif/italic | ciemne/gradient |

### Logika podziału

- **Serif/italic = emocje.** Sekcje, które mają rezonować z uczuciami użytkownika: ból, transformacja, aspiracja, zamknięcie (CTA).
- **Sans-serif bold = logika.** Sekcje, które pokazują JAK działa produkt, DLACZEGO jest lepszy, CO robić, dowód społeczny.
- Tło (beż/biel) jest **drugorzędnym** sygnałem wizualnym — służy do oddzielenia sąsiednich sekcji i zapobiegania monotonii, ale NIE determinuje czcionki.

### Podtytuły (subtitle)

Każda sekcja ma strukturę:

```
[opcjonalny podtytuł — mały, szary, uppercase lub normal weight]
[nagłówek główny — duży, w odpowiedniej czcionce]
```

Reguły podtytułów:

- Podtytuł pojawia się TYLKO gdy nagłówek główny jest emocjonalny/intrygujący i wymaga dookreślenia kontekstu.
- Podtytuł NIE pojawia się, gdy nagłówek jest sam w sobie jednoznaczny.
- Styl podtytułu jest ZAWSZE taki sam: mniejszy rozmiar, kolor szary (np. text-gray-500), font-normal, sans-serif — niezależnie od czcionki nagłówka.

| Sekcja | Podtytuł | Nagłówek |
|--------|----------|----------|
| Hero | brak | Czy pieniądze są źródłem NAPIĘCIA w Waszym związku? |
| Pain Points | Wasze wyzwania finansowe jako pary | Czy te wyzwania brzmią znajomo? |
| Przed i po | brak | Finanse przed i po OurMoney |
| Rozwiązania | brak lub „Nie kolejny arkusz Excel..." | Jak OurMoney rozwiązuje Wasze problemy |
| Porównanie | OurMoney to jedyne narzędzie zaprojektowane specjalnie dla par — nie dla współlokatorów, nie dla grup. | Dlaczego nie Excel, Splitwise czy notatki? |
| 3 kroki | Konfiguracja zajmuje mniej niż minutę. Bez skomplikowanych formularzy, bez karty kredytowej. | Zacznij w 3 prostych krokach |
| Jesteśmy po stronie związku | brak | Jesteśmy po stronie związku |
| Testimoniale | brak | Osoby, które wzięły finanse w swoje ręce |
| FAQ | brak | FAQ |
| CTA końcowe | brak | Sprawdź, jak proste mogą być wspólne finanse. |

---

## Kolejność sekcji na stronie

Sekcje muszą być ułożone w następującej kolejności. Ta kolejność buduje narrację: **ból → kontrast → mechanizm → przewaga → prostota → zaufanie → dowód → działaj**.

```
1. HERO
   Czy pieniądze są źródłem NAPIĘCIA w Waszym związku?
   → Identyfikacja problemu, pierwsze CTA

2. PAIN POINTS
   Czy te wyzwania brzmią znajomo?
   → 3 karty z bolączkami par — użytkownik ma się rozpoznać

3. PRZED I PO OURMONEY
   Finanse przed i po OurMoney
   → Dwie kolumny: „Bez OurMoney" (czerwone X) vs „Z OurMoney" (zielone ✓)
   → Emocjonalny kontrast — od bólu do ulgi

4. JAK OURMONEY ROZWIĄZUJE WASZE PROBLEMY
   Jak OurMoney rozwiązuje Wasze problemy
   → 3 mechanizmy: podział wydatków, cele, moje/twoje/nasze
   → Screenshot aplikacji w ramce telefonu
   → CTA: „Zacznij od siebie — dodaj partnera później"

5. DLACZEGO NIE EXCEL, SPLITWISE CZY NOTATKI?
   Dlaczego nie Excel, Splitwise czy notatki?
   → Tabela porównawcza z checkmarkami
   → Adresuje obiekcję „po co mi kolejna apka"

6. ZACZNIJ W 3 PROSTYCH KROKACH
   Zacznij w 3 prostych krokach
   → Załóż konto → Dodaj wydatki → Zaproś partnera
   → Redukuje friction — „to jest proste"

7. JESTEŚMY PO STRONIE ZWIĄZKU
   Jesteśmy po stronie związku
   → Zdjęcie pary + floating UI elements z aplikacji
   → Emocjonalne wzmocnienie przed social proof
   → [OPCJONALNIE: rozważ usunięcie tej sekcji jeśli nie wnosi unikatowej wartości]

8. TESTIMONIALE
   Osoby, które wzięły finanse w swoje ręce
   → Karuzela opinii (Aga, Daniel, Klaudia, Mateusz)

9. FAQ
   FAQ
   → 5 pytań: solo start, darmowość, podział, PWA, bezpieczeństwo

10. KOŃCOWE CTA
    Sprawdź, jak proste mogą być wspólne finanse.
    → Ostatni przycisk: „Zacznij od siebie — dodaj partnera później"
```

---

## Zasady implementacji

1. **Nigdy nie mieszaj czcionek w obrębie jednego nagłówka** — cały nagłówek jest albo serif/italic, albo sans-serif bold. Wyjątek: wyróżnione słowo kolorem (np. „NAPIĘCIA" w hero może mieć kolor akcentowy, ale tę samą czcionkę).

2. **Tło alternuje** między sekcjami, żeby unikać monotonii, ale dwie sekcje z tym samym tłem mogą sąsiadować, jeśli są wizualnie rozdzielone innym elementem (np. zdjęcie, separator).

3. **Kolor akcentowy (limonkowy/żółto-zielony)** jest zarezerwowany dla: przycisków CTA, wyróżnień w nagłówkach (jak „prostych krokach"), aktywnych stanów w tabeli porównawczej.

4. **Podtytuły** zawsze nad nagłówkiem, zawsze w tym samym stylu — małe, szare, sans-serif.

5. **Spacing** między sekcjami powinien być jednolity (np. py-20 lub py-24 w Tailwind) — żadna sekcja nie powinna wyglądać na „ściśniętą" w porównaniu z innymi.