'use client';

import { useEffect, useRef, useState } from 'react';
import { trackBlogPostRead } from '@/lib/analytics';

type Props = {
  slug: string;
  locale: string;
};

export function ReadingProgressBar({ slug, locale }: Props) {
  const [progress, setProgress] = useState(0);
  const firedRef = useRef(false);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(pct);

      if (!firedRef.current && pct >= 75) {
        firedRef.current = true;
        trackBlogPostRead(slug, locale);
      }
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [slug, locale]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent pointer-events-none">
      <div
        className="h-full bg-[#bbff00] transition-[width] duration-75 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
