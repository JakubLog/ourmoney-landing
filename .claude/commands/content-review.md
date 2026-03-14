Wykonaj review treści CMS i tłumaczeń projektu OurMoney Landing.

## Flow

### 1. Sprawdź parity PL/EN w messages/
Porównaj `messages/pl.json` i `messages/en.json`:
- Czy wszystkie klucze z PL istnieją w EN?
- Czy są klucze w EN których nie ma w PL?
- Czy są placeholdery `// TODO: translate`?

### 2. Sprawdź kompletność Sanity schemas
Dla każdego document type:
- [ ] Pole `seo.title` wypełnione (lub strona ma fallback)
- [ ] Pole `seo.description` wypełnione
- [ ] `seo.ogImage` istnieje (lub strona ma default)
- [ ] Alt text na wszystkich obrazkach
- [ ] Obie wersje językowe istnieją (PL + EN)

### 3. Sprawdź SEO pola treści
- [ ] Blog post `title` — max 60 znaków
- [ ] Blog post `excerpt` / meta description — max 155 znaków
- [ ] Slug — bez polskich znaków (ą→a, ę→e, etc.), bez spacji
- [ ] `publishedAt` ustawiony na wszystkich published postach
- [ ] Autor wypełniony

### 4. Sprawdź spójność treści
- [ ] Tone of voice spójny między sekcjami (PL i EN osobno)
- [ ] CTA przyciski — spójne (nie mix "Sprawdź", "Dowiedz się więcej", "Kliknij tutaj")
- [ ] Liczby i dane — spójne między stronami PL i EN
- [ ] Linki wewnętrzne działają

### 5. Sprawdź llms.txt
- [ ] `public/llms.txt` odzwierciedla aktualny stan produktu
- [ ] Brak nieaktualnych informacji (features które nie istnieją)
- [ ] Linki działają

## Output
```
## Content Review Report

### i18n Parity
Brakujące w EN: [lista kluczy lub "none"]
Brakujące w PL: [lista kluczy lub "none"]
TODO placeholders: [liczba]

### Sanity CMS
| Document | SEO | Alt text | PL | EN |
|----------|-----|----------|----|----|
| Homepage | OK/WARN | OK/WARN | ✓ | ✓ |
| Blog: [tytuł] | OK/WARN | OK/WARN | ✓ | ✗ |

### Rekomendacje
- [lista]
```
