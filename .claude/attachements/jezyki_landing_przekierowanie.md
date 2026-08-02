   # Instrukcja: przekazywanie języka z landingu do aplikacji OurMoney
  
  ## Cel
  Użytkownik wchodzący na landing po angielsku ma trafić do aplikacji od razu w EN,
  bez ręcznego przełączania w ustawieniach.
  
  ## Parametr
  
  | Klucz | Wartości | Miejsce |
  |-------|----------|---------|
  | `locale` | `pl` \| `en` | query string URL-a aplikacji |
  
  **Dokładnie te dwie wartości, lowercase.** Nie `pl-PL`, nie `en-US`, nie `PL`, nie `english`.
  Aplikacja obsługuje wyłącznie `pl` i `en`; nieznana wartość = fallback na `pl`.
  
  Nie wymyślaj alternatywnych nazw (`lang`, `hl`, `language`) — aplikacja czyta wyłącznie `locale`.
     
  ## Gdzie dodawać

  Do **każdego** linku wychodzącego z landingu na domenę aplikacji `https://app.ourmoney.pl`:
  
  - wszystkie CTA („Zacznij", „Wypróbuj", „Zaloguj się", „Załóż konto")
  - linki w nawigacji i stopce (`/privacy`, `/terms`, `/delete-account`)
  - przyciski w sekcjach pricing / feature
  - linki w banerach i pop-upach
  - linki w mailach/newsletterach wychodzących z landingu
  
  Przykłady:
  https://app.ourmoney.pl/?locale=en
  https://app.ourmoney.pl/welcome?locale=en
  https://app.ourmoney.pl/privacy?locale=en
  
  ## Zasady techniczne
  
  1. **Query, nie hash.** Parametr idzie do query stringa, przed ewentualnym `#`.
     Poprawnie: `https://app.ourmoney.pl/welcome?locale=en#section`
     Aplikacja używa hasha do tokenów auth — nie wolno tam nic dopisywać.
  
  2. **Doklejaj, nie nadpisuj.** Jeśli URL ma już parametry (utm, ref), dodaj `locale`
     jako kolejny: `?utm_source=fb&utm_campaign=x&locale=en`. Buduj URL przez
     `URLSearchParams`, nie konkatenacją stringów.

  3. **Przy przekierowaniach parametr musi przetrwać.** Każdy redirect (301/302,
     middleware, JS `window.location`) po drodze do aplikacji przenosi query string
     w całości. Redirect gubiący `locale` = bug.
  
  4. **Wartość bierz z aktualnego języka landingu**, nie z `navigator.language`.
     Jeśli user czyta landing po angielsku, ma dostać `locale=en` — nawet jeśli
     przeglądarka ma polską lokalizację. Odwrotnie tak samo.
  
  5. **Dla PL możesz pominąć parametr** — `pl` jest domyślne. Ale spójne dodawanie
     `locale=pl` też jest OK i nie szkodzi.
  
  ## Czego parametr NIE robi
  
  - **Nie dotyczy linków do App Store / Google Play.** Aplikacja natywna bierze język
    z systemu; parametru nie da się tam przekazać. Nie próbuj.
  - **Nie steruje walutą.** Waluta jest ustawiana per workspace w onboardingu,
    niezależnie od języka.
  - **Nie wymaga nic po stronie landingu poza budową URL-a** — żadnych cookies,
    żadnego postMessage, żadnego wspólnego storage. Domeny są różne, więc i tak
    by nie zadziałało.
     
  ## Jak zweryfikować

  1. Wejdź na landing EN → kliknij dowolne CTA.
  2. W aplikacji sprawdź w DevTools → Application → Local Storage → klucz `i18nextLng`
     powinien mieć wartość `en`.
  3. Otwórz `https://app.ourmoney.pl` bez parametru w nowej karcie — nadal EN
     (wybór jest cache'owany w localStorage).
    