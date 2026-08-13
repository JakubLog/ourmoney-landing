# Posty blogowe jako pliki

Teksty postów trzymamy tu w Markdown i wrzucamy do Sanity skryptem, zamiast przeklejać
je ręcznie do Studio. Dzięki temu treść przechodzi review w PR, a limity SEO sprawdza
walidacja, a nie oko.

Źródłem prawdy dla opublikowanego contentu nadal jest Sanity. Ten katalog jest źródłem
dla importu i dla historii zmian.

## Import

```bash
SANITY_API_WRITE_TOKEN=<token> npm run import:blog
```

Token: `sanity.io/manage` → projekt → API → Tokens → uprawnienia **Editor**.

Bez tokenu można odpalić samą walidację:

```bash
npm run import:blog -- --dry-run
```

Podgląd gotowego dokumentu (w tym Portable Text) dla jednego posta:

```bash
npm run import:blog -- --print jak-zarzadzac-wspolnym-budzetem-domowym
```

Skrypt jest idempotentny. Każdy post ma stałe `_id` zbudowane ze sluga, więc ponowne
uruchomienie aktualizuje ten sam dokument zamiast tworzyć duplikat. Po imporcie warto
odświeżyć cache landingu przez `POST /api/revalidate` (tag `blog`).

## Format pliku

Dwie części rozdzielone linią `---`:

1. **Blok pól** na górze, `- **nazwa:** wartość`. Nazwy odpowiadają 1:1 schematowi
   `src/sanity/schemas/blogPost.ts` (`title`, `slug`, `language`, `excerpt`, `seo.*`,
   `aiSeo.*`, `cta.*`) plus dwa pola techniczne importu:
   - `mainImage` — ścieżka do pliku w `images/`
   - `translationOf` — slug wersji PL, po którym wiążemy tłumaczenie
2. **Treść posta** w Markdown. Skrypt zamienia ją na Portable Text: `##`/`###`/`####`,
   akapity, listy punktowane i numerowane, `**pogrubienie**`, `[linki](/pl/...)` i cytaty.
   Pierwszy nagłówek `#` jest pomijany, bo tytuł renderuje strona.

Autor (`magda-nestorowicz`) i kategoria (`finanse-w-zwiazku` / `finances-in-relationship`)
są dowiązywane po slugu z datasetu. Data publikacji bez podanego `publishedAt` to moment importu.

## Co waliduje skrypt

Zgodnie z `.claude/rules/seo-rules.md` (Reguła 9) i schematem:

- `title` do 80 znaków, `excerpt` do 200, `seo.title` do 60, `seo.description` do 155,
  `aiSeo.aiSummary` do 300
- `aiSeo.keyTakeaways` od 3 do 5 pozycji
- slug bez polskich znaków i spacji
- minimum 2 linki wewnętrzne w treści

Import nie ruszy, dopóki którykolwiek plik nie przejdzie walidacji.

## Obrazy

`images/` trzyma pliki źródłowe obrazów głównych, wspólne dla wersji PL i EN.
Skrypt wgrywa je jako assety Sanity (Sanity sam deduplikuje po hashu, więc ten sam plik
nie tworzy dwóch assetów). Alt text jest polem wymaganym w schemacie i bierze się
z `mainImage.alt`.

Grafiki są generowane (Higgsfield, gpt_image_2 + upscale do 2K) pod styl zdjęć na blogu:
ciepła fotografia editorial, paleta beżu, kremu i oliwki, światło dzienne, ziarno filmowe.
