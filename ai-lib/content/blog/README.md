# Drafty blogowe

Źródło prawdy dla treści bloga jest w Sanity. Ten katalog trzyma **drafty przed publikacją**:
teksty pisane poza Studio, gotowe do wklejenia i do review w PR.

## Format pliku

Każdy plik ma dwie części:

1. **Blok "Pola do Sanity (blogPost)"** na górze. Nazwy pól odpowiadają 1:1 schematowi
   `src/sanity/schemas/blogPost.ts` (`title`, `slug`, `excerpt`, `seo.*`, `aiSeo.*`, `cta.*`).
2. **Treść posta** poniżej separatora, w Markdown. Wkleja się ją do pola `body` (Portable Text).

## Zasady, które te drafty spełniają

Zgodnie z `.claude/rules/seo-rules.md` (Reguła 9) i `ai-lib/context-map/seo-strategy.md`:

- `title` max 80 znaków, `seo.title` max 60, `seo.description` max 155, `excerpt` max 200
- `aiSeo.aiSummary` max 300 znaków, `aiSeo.keyTakeaways` od 3 do 5 pozycji
- slug bez polskich znaków
- minimum 2 linki wewnętrzne w każdym poście
- każdy post pod inną frazę, żeby posty nie kanibalizowały się w SERP
- każdy post prowadzi do aplikacji: wypełniony obiekt `cta` (renderowany przez
  `ArticleCTA` w połowie i na końcu, z trackingiem) plus zamknięcie tekstu linkiem
  do `app.ourmoney.pl`

## Publikacja

Ręcznie w Sanity Studio (`/studio`): nowy `blogPost`, przepisanie pól z bloku na górze,
wklejenie treści do `body`. Do uzupełnienia w Studio: `mainImage` z alt textem, `author`,
`category`, `publishedAt`, opcjonalnie `relatedFaq`.

Po publikacji warto dopisać slug do tabeli long-tail w `ai-lib/context-map/seo-strategy.md`.
