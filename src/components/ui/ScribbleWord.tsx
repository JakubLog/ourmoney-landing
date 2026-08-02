'use client';

import { useRef, useEffect, useState } from 'react';

type Props = { children: React.ReactNode };

/**
 * Wyroznione slowo z odreczna obwodka, ktora rysuje sie po wejsciu w viewport.
 * Wydzielone z BeforeAfterSection przy scalaniu jej z ComparisonSection - dzieki
 * temu sama sekcja zostaje komponentem serwerowym.
 */
export function ScribbleWord({ children }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: obwodka nadal pojawia sie przy wejsciu w viewport,
    // tylko bez animacji rysowania
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && svgRef.current) {
      svgRef.current.style.transition = 'none';
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className="relative inline-block">
      <svg
        ref={svgRef}
        className="absolute -left-2 -right-2 -bottom-1 top-0 w-[calc(100%+16px)] h-full origin-left"
        style={{
          transform: revealed ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 1.4s cubic-bezier(0.22, 1, 0.36, 1) 0.6s',
        }}
        viewBox="0 0 200 60"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M8 45 C20 50, 40 52, 60 48 C80 44, 100 38, 130 36 C150 34, 175 36, 192 40 C196 28, 194 18, 188 14 C170 8, 140 6, 110 8 C80 10, 50 14, 25 18 C12 20, 4 28, 8 45Z"
          className="fill-accent/25"
        />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}
