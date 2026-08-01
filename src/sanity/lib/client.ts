import { createClient } from 'next-sanity';

type SanityClient = ReturnType<typeof createClient>;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';

/**
 * Klient zastepczy na czas pracy bez dostepu do Sanity (brak .env lokalnie).
 * Zwraca puste dane zamiast rzucac bledem, dzieki czemu caly landing da sie
 * ogladac i rozwijac lokalnie - strony renderuja sie po prostu bez tresci z CMS.
 *
 * Zapytania z projekcja `[0]` zwracaja pojedynczy obiekt albo null, reszta listy -
 * stad rozroznienie po tresci zapytania.
 */
function createOfflineClient(): SanityClient {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      '[sanity] Brak NEXT_PUBLIC_SANITY_PROJECT_ID - tresci z CMS beda puste. ' +
        'Zestaw zmienna w .env.local, jesli potrzebujesz realnych danych.',
    );
  }
  return {
    fetch: async (query: string) => (/\[0\]/.test(query) ? null : []),
  } as unknown as SanityClient;
}

// Na produkcji brak projectId to blad konfiguracji, a nie powod do cichego
// serwowania pustej strony - wtedy createClient ma prawo rzucic.
export const client =
  projectId || process.env.NODE_ENV === 'production'
    ? createClient({
        projectId: projectId ?? '',
        dataset,
        apiVersion: '2026-03-14',
        useCdn: process.env.NODE_ENV === 'production',
      })
    : createOfflineClient();

export const fetchOptions =
  process.env.NODE_ENV === 'production'
    ? { next: { revalidate: 3600, tags: ['blog'] } }
    : { cache: 'no-store' as const };
