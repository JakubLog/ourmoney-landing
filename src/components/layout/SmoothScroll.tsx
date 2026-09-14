'use client';

import { useEffect } from 'react';

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Skip smooth scroll on mobile/tablet - native scrolling is better for performance and UX
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    if (isMobile) return;

    let lenis: InstanceType<typeof import('lenis').default> | null = null;
    let rafId: number;
    let anchorClickHandler: ((event: MouseEvent) => void) | null = null;

    async function init() {
      const { default: Lenis } = await import('lenis');

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      // Lenis ustawia scroll-behavior:auto, dlatego linki kotwicowe trzeba
      // przekazac mu jawnie. Delegacja obejmuje tez CTA renderowane pozniej.
      anchorClickHandler = (event: MouseEvent) => {
        const anchor = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
        if (!anchor || !lenis) return;

        const url = new URL(anchor.href, window.location.href);
        if (!url.hash || url.origin !== window.location.origin || url.pathname !== window.location.pathname) {
          return;
        }

        let id: string;
        try {
          id = decodeURIComponent(url.hash.slice(1));
        } catch {
          id = url.hash.slice(1);
        }
        const target = document.getElementById(id);
        if (!target) return;

        event.preventDefault();
        window.history.pushState(null, '', url.hash);
        lenis.scrollTo(target, { offset: -24, duration: 1.2 });
      };
      document.addEventListener('click', anchorClickHandler);

      function raf(time: number) {
        lenis!.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
    }

    // Defer initialization until browser is idle to avoid blocking main thread
    let idleHandle: number | undefined;
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    if ('requestIdleCallback' in window) {
      idleHandle = window.requestIdleCallback(() => init(), { timeout: 2000 });
    } else {
      timeoutHandle = setTimeout(() => init(), 100);
    }

    return () => {
      if (idleHandle !== undefined) window.cancelIdleCallback(idleHandle);
      if (timeoutHandle !== undefined) clearTimeout(timeoutHandle);
      if (rafId) cancelAnimationFrame(rafId);
      if (anchorClickHandler) document.removeEventListener('click', anchorClickHandler);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
