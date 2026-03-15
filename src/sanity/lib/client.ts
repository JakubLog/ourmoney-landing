import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2026-03-14',
  useCdn: process.env.NODE_ENV === 'production',
});

export const fetchOptions =
  process.env.NODE_ENV === 'production'
    ? { next: { revalidate: 3600, tags: ['blog'] } }
    : { cache: 'no-store' as const };
