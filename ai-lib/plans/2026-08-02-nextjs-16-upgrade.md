# Plan: Aktualizacja Next.js 15.3 → 16.x

**Data:** 2026-08-02
**Status:** Zrobione (build + lint + type-check zielone)

## Cel

Aktualizacja Next.js do najnowszej stabilnej wersji (16.2.x) wraz z podmianą
deprecated API i adopcją nowych domyślnych zachowań.

## Audyt kodu — co nas dotyczy

| Obszar | Stan w kodzie | Działanie |
|--------|--------------|-----------|
| Async `params`/`searchParams` | ✅ Już wszędzie `Promise<...>` + `await` | Brak |
| `middleware.ts` | ⚠️ Deprecated — nowa konwencja `proxy.ts` | Rename plik + funkcja (runtime i tak nodejs) |
| `revalidateTag(tag)` (1 arg) | ⚠️ Deprecated w `src/app/api/revalidate/route.ts` | `revalidateTag(tag, 'max')` |
| `scroll-behavior: smooth` w globals.css | ⚠️ Next 16 nie nadpisuje przy nawigacji | `data-scroll-behavior="smooth"` na `<html>` |
| `next lint` | ❌ Usunięte w 16, brak configu ESLint w repo | `eslint.config.mjs` (flat) + skrypt `eslint .` |
| Turbopack | Domyślny w 16; brak custom webpack config | Weryfikacja builda |
| `next/image` defaults | Brak `quality` props, remotePatterns OK | Brak zmian |
| Sitemap / OG images | Brak `generateSitemaps`, brak plików og-image | Brak zmian |
| AMP / runtime config / PPR | Nie używane | Brak zmian |

## Kroki

1. Bump zależności: `next@16`, `react@19.2`, `react-dom`, `next-intl@latest`,
   `@next/third-parties@16`, `eslint-config-next@16`, typy. Sprawdzić peer deps
   `next-sanity` (może wymagać v10/11).
2. `middleware.ts` → `proxy.ts` (funkcja `middleware` → `proxy`, usunąć
   `export const runtime` — proxy zawsze nodejs).
3. `revalidateTag(tag, 'max')` w webhooku rewalidacji.
4. `data-scroll-behavior="smooth"` w `src/app/[locale]/layout.tsx`.
5. Migracja lint: `eslint.config.mjs` flat config + skrypt w package.json.
6. Weryfikacja: `tsc --noEmit`, `next build` (Turbopack).

## Nie robimy (świadomie)

- `cacheComponents` (dawne PPR/dynamicIO) — duża zmiana modelu cache, osobny plan.
- React Compiler (`reactCompiler: true`) — stabilny, ale wydłuża build (Babel);
  do rozważenia osobno.
- Turbopack FS cache (`experimental.turbopackFileSystemCacheForDev`) — beta,
  można włączyć później dla szybszego dev.

## Ryzyka

- Peer deps `next-sanity@9` / `sanity@3` mogą nie wspierać Next 16 → możliwy
  bump do nowszych majorów.
- Turbopack jako domyślny builder — pierwsza produkcyjna weryfikacja w tym repo.
