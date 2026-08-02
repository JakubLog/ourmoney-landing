'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

const EASE = 'cubic-bezier(0.76, 0, 0.24, 1)';

export function PageTransitionOverlay() {
  const pathname = usePathname();
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  const isFirst = useRef(true);
  const isAnimating = useRef(false);
  const routerRef = useRef(router);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  // When pathname changes (navigation complete) → reveal
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (!isAnimating.current) return;
    const el = overlayRef.current;
    if (!el) return;

    async function reveal() {
      // Small pause so the new page renders behind the overlay
      await new Promise<void>(r => setTimeout(r, 50));
      const anim = el!.animate(
        [{ transform: 'translateX(0%)' }, { transform: 'translateX(-100%)' }],
        { duration: 380, easing: EASE, fill: 'forwards' },
      );
      await anim.finished;
      el!.style.transform = 'translateX(100%)';
      anim.cancel();
      isAnimating.current = false;
    }

    reveal();
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

      // Same-page click → no transition (pathname won't change, reveal would never fire)
      const targetPath = href.split('?')[0].replace(/\/+$/, '') || '/';
      const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
      if (targetPath === currentPath) return;

      const el = overlayRef.current;
      if (!el) return;

      // Block Next.js from navigating immediately
      e.preventDefault();
      e.stopPropagation();

      isAnimating.current = true;

      // Cover the screen fully first
      const anim = el.animate(
        [{ transform: 'translateX(100%)' }, { transform: 'translateX(0%)' }],
        { duration: 280, easing: EASE, fill: 'forwards' },
      );
      await anim.finished;
      anim.cancel();
      el.style.transform = 'translateX(0%)';

      // NOW navigate - page swaps behind the overlay
      routerRef.current.push(href);
    }

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, []);

  return (
    <div
      ref={overlayRef}
      style={{ transform: 'translateX(100%)' }}
      className="fixed inset-0 z-[9999] bg-dark pointer-events-none will-change-transform"
    />
  );
}
