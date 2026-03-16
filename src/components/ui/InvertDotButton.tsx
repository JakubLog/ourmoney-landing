'use client';

import { useRef, useCallback } from 'react';
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
  dotSize = 40,
}: Props) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dotRef.current || !linkRef.current) return;
      const rect = linkRef.current.getBoundingClientRect();
      dotRef.current.style.left = `${e.clientX - rect.left}px`;
      dotRef.current.style.top = `${e.clientY - rect.top}px`;
    },
    [],
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      if (!dotRef.current) return;
      handleMouseMove(e);
      dotRef.current.style.transform = 'translate(-50%,-50%) scale(1)';
    },
    [handleMouseMove],
  );

  const handleMouseLeave = useCallback(() => {
    if (!dotRef.current) return;
    dotRef.current.style.transform = 'translate(-50%,-50%) scale(0)';
  }, []);

  return (
    <a
      ref={linkRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative overflow-hidden cursor-pointer ${className}`}
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
      <span className="relative z-10">{children}</span>
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
