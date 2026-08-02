# Plan: Optymalizacje Next 16 — faza 2 (po upgrade)

**Data:** 2026-08-02
**Status:** Zrobione (pkt 1–6); `cacheComponents` odrzucone po eksperymencie — patrz Wynik
**Poprzednik:** [2026-08-02-nextjs-16-upgrade.md](2026-08-02-nextjs-16-upgrade.md)

## Cel

Wdrożenie optymalizacji świadomie pominiętych przy samym upgrade: React Compiler,
Turbopack FS cache (dev), refaktor 4 wzorców `setState-in-effect` na zgodne z
react-hooks v6 + przywrócenie reguły do `error`. Eksperyment z `cacheComponents`.

## Kroki

1. **React Compiler** — `reactCompiler: true` w next.config.ts +
   `babel-plugin-react-compiler` (devDep). Automatyczna memoizacja komponentów.
2. **Turbopack FS cache (dev)** — `experimental.turbopackFileSystemCacheForDev: true`.
3. **CookieConsentBanner** — `useSyncExternalStore` na localStorage (subscribe:
   `storage` + custom event; server snapshot `'unknown'` → baner ukryty do hydracji).
   Bonus: synchronizacja między kartami.
4. **StartRedirect** — `useSyncExternalStore` dla platformy (server snapshot =
   `initialPlatform` z UA, client snapshot = `detectPlatformClient()` z cache
   modułowym). Efekt przekierowania bez `setPlatform`.
5. **CountUpValue / PriorityBadge** — zerowanie stanu przeniesione z ciała efektu
   do callbacku IntersectionObserver (async = zgodne z regułą; wizualnie identyczne,
   bo kafel jest przezroczysty do momentu reveal).
6. **ESLint** — usunięcie downgrade'u `react-hooks/set-state-in-effect` (wraca error).
7. **Eksperyment `cacheComponents`** — flaga on → build → analiza błędów.
   Znane ograniczenie: next-intl nie wspiera (`getTranslations`/`Link` czytają
   `headers()` w zasięgu `use cache`; czeka na `next/root-params`) —
   github.com/amannn/next-intl/issues/1493. Jeśli build padnie → revert + notatka.

## Wynik eksperymentu `cacheComponents` (2026-08-02)

Build z flagą padł na kompilacji: `revalidate`/`dynamic` route segment configs są
niekompatybilne (4 strony: `/`, `/blog`, `/o-nas`, `/start`). Po ich usunięciu
czekałaby ściana next-intl (issue #1493). Decyzja: **odrzucone**, bo dla landingu
to regresja architektury:

- Dziś: pełne SSG + ISR (`revalidate` + tag `blog` + webhook) — strony statyczne z CDN.
- Pod `cacheComponents`: strony domyślnie dynamiczne; pełną statykę odzyskuje się
  przez `'use cache'`, którego next-intl nie wspiera (`getTranslations`/`Link`
  czytają `headers()` w zasięgu cache; czeka na `next/root-params`).
- PPR daje wartość przy stronach mieszających statykę z treścią per-request —
  u nas tylko `/start`, już optymalna jako `force-dynamic`.

Rewizyta: gdy next-intl ogłosi wsparcie `cacheComponents` (śledzić issue #1493).

## Ryzyka

- React Compiler wydłuża build (Babel per plik).
- Zmiana momentu zerowania licznika/plakietki — teoretycznie widoczna, jeśli reveal
  sekcji wyprzedzi IntersectionObserver komponentu (oba używają rootMargin -10%).
- `cacheComponents` prawie na pewno do odrzucenia w tej iteracji (next-intl).
