'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useAnimate } from 'framer-motion';

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

export function PageTransitionOverlay() {
  const pathname = usePathname();
  const [scope, animate] = useAnimate();

  const isFirst = useRef(true);
  const coverDone = useRef(false);
  const revealPending = useRef(false);

  const animateFn = useRef(animate);
  const scopeEl = useRef(scope);
  animateFn.current = animate;
  scopeEl.current = scope;

  async function doReveal() {
    await new Promise<void>(r => setTimeout(r, 80));
    await animateFn.current(scopeEl.current.current, { x: [null, '-100%'] }, { duration: 0.38, ease: EASE });
    animateFn.current(scopeEl.current.current, { x: '100%' }, { duration: 0 });
    coverDone.current = false;
    revealPending.current = false;
  }

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (coverDone.current) {
      doReveal();
    } else {
      revealPending.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    async function handleClick(e: MouseEvent) {
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest('a[href]') as HTMLAnchorElement | null;
      if (!link || link.target === '_blank') return;
      const href = link.getAttribute('href') ?? '';
      if (!href.startsWith('/') || href.includes('#')) return;

      coverDone.current = false;
      revealPending.current = false;

      await animateFn.current(scopeEl.current.current, { x: ['100%', '0%'] }, { duration: 0.28, ease: EASE });

      coverDone.current = true;
      if (revealPending.current) doReveal();
    }

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={scope}
      style={{ transform: 'translateX(100%)' }}
      className="fixed inset-0 z-[9999] bg-[#141414] pointer-events-none will-change-transform"
    />
  );
}
