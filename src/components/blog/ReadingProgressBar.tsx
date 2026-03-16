'use client';

import { useEffect, useRef, useCallback } from 'react';
import { trackBlogPostRead } from '@/lib/analytics';

type Props = {
  slug: string;
  locale: string;
};

export function ReadingProgressBar({ slug, locale }: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const firedRef = useRef(false);
  const rafRef = useRef<number>(0);

  const update = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;

    if (barRef.current) {
      barRef.current.style.width = `${pct}%`;
    }

    if (!firedRef.current && pct >= 75) {
      firedRef.current = true;
      trackBlogPostRead(slug, locale);
    }
  }, [slug, locale]);

  useEffect(() => {
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [update]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent pointer-events-none">
      <div
        ref={barRef}
        className="h-full bg-[#bbff00] transition-[width] duration-150 ease-out"
        style={{ width: '0%' }}
      />
    </div>
  );
}
