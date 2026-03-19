'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useAnimate } from 'framer-motion';

const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

export function PageTransitionOverlay() {
  const pathname = usePathname();
  const router = useRouter();
  const [scope, animate] = useAnimate();

  const isFirst = useRef(true);
  const isAnimating = useRef(false);

  const animateFn = useRef(animate);
  const scopeEl = useRef(scope);
  const routerRef = useRef(router);
  animateFn.current = animate;
  scopeEl.current = scope;
  routerRef.current = router;

  // When pathname changes (navigation complete) → reveal
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (!isAnimating.current) return;

    async function reveal() {
      // Small pause so the new page renders behind the overlay
      await new Promise<void>(r => setTimeout(r, 50));
      await animateFn.current(
        scopeEl.current.current,
        { x: [null, '-100%'] },
        { duration: 0.38, ease: EASE },
      );
      animateFn.current(scopeEl.current.current, { x: '100%' }, { duration: 0 });
      isAnimating.current = false;
    }

    reveal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Intercept link clicks: cover first, THEN navigate
  useEffect(() => {
    async function handleClick(e: MouseEvent) {
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element).closest('a[href]') as HTMLAnchorElement | null;
      if (!link || link.target === '_blank') return;
      const href = link.getAttribute('href') ?? '';
      if (!href.startsWith('/') || href.includes('#')) return;
      if (isAnimating.current) return;

      // Block Next.js from navigating immediately
      e.preventDefault();
      e.stopPropagation();

      isAnimating.current = true;

      // Cover the screen fully first
      await animateFn.current(
        scopeEl.current.current,
        { x: ['100%', '0%'] },
        { duration: 0.28, ease: EASE },
      );

      // NOW navigate — page swaps behind the overlay
      routerRef.current.push(href);
    }

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
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
