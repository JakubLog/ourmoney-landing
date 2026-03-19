'use client';

import dynamic from 'next/dynamic';

const PageTransitionOverlay = dynamic(
  () => import('@/components/layout/PageTransitionOverlay').then(m => m.PageTransitionOverlay),
  { ssr: false },
);

export function LazyPageTransition() {
  return <PageTransitionOverlay />;
}
