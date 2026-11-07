'use client';

import { useRef, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { trackCTAClick } from '@/lib/analytics';

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
  location: string;
  locale: string;
  dotSize?: number;
};

export function InvertDotButton({
  href,
  children,
  className = '',
  location,
  locale,
  dotSize = 80,
}: Props) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const whiteTextRef = useRef<HTMLSpanElement>(null);
  const radius = dotSize / 2;

  // Linki wewnetrzne (np. strona przejscia /start) zostaja w tej samej karcie -
  // nowa karta ma sens tylko dla adresow poza landingiem.
  const isInternal = href.startsWith('/');

  const updatePosition = useCallback(
    (x: number, y: number) => {
      if (dotRef.current) {
        dotRef.current.style.left = `${x}px`;
        dotRef.current.style.top = `${y}px`;
      }
      if (whiteTextRef.current) {
        whiteTextRef.current.style.clipPath = `circle(${radius}px at ${x}px ${y}px)`;
      }
    },
    [radius],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!linkRef.current) return;
      const rect = linkRef.current.getBoundingClientRect();
      updatePosition(e.clientX - rect.left, e.clientY - rect.top);
    },
    [updatePosition],
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      handleMouseMove(e);
      if (dotRef.current) {
        dotRef.current.style.transform = 'translate(-50%,-50%) scale(1)';
      }
      if (whiteTextRef.current) {
        whiteTextRef.current.style.opacity = '1';
      }
    },
    [handleMouseMove],
  );

  const handleMouseLeave = useCallback(() => {
    if (dotRef.current) {
      dotRef.current.style.transform = 'translate(-50%,-50%) scale(0)';
    }
    if (whiteTextRef.current) {
      whiteTextRef.current.style.opacity = '0';
    }
  }, []);

  return (
    <a
      ref={linkRef}
      href={href}
      {...(isInternal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
      className={`group/cta relative overflow-hidden cursor-pointer ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() =>
        trackCTAClick({
          location,
          text: typeof children === 'string' ? children : location,
          locale,
        })
      }
    >
      {/* Default text. Strzalka jest tu, a nie w children - tracking bierze
          children jako tekst CTA, wiec musi zostac sam string */}
      <span className="relative z-10 inline-flex items-center justify-center gap-2">
        {children}
        <ArrowRight
          className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover/cta:translate-x-0.5"
          strokeWidth={2.25}
          aria-hidden="true"
        />
      </span>

      {/* White text clipped to dot area */}
      <span
        ref={whiteTextRef}
        aria-hidden="true"
        className="absolute inset-0 z-20 flex items-center justify-center gap-2 text-white pointer-events-none"
        style={{ clipPath: 'circle(0px at 0px 0px)', opacity: 0 }}
      >
        {children}
        <ArrowRight
          className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover/cta:translate-x-0.5"
          strokeWidth={2.25}
        />
      </span>

      {/* Dark dot */}
      <span
        ref={dotRef}
        aria-hidden="true"
        className="absolute rounded-full bg-dark pointer-events-none"
        style={{
          width: dotSize,
          height: dotSize,
          transform: 'translate(-50%,-50%) scale(0)',
          transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'transform',
        }}
      />
    </a>
  );
}
