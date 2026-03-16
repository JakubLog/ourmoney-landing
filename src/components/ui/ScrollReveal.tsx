'use client';

import { useEffect, useRef } from 'react';

type Animation = 'fade-up' | 'fade-in' | 'slide-right' | 'scale';

type Props = {
  children: React.ReactNode;
  animation?: Animation;
  delay?: number;
  duration?: number;
  className?: string;
  as?: React.ElementType;
};

const INITIAL_STYLES: Record<Animation, string> = {
  'fade-up': 'opacity:0;transform:translateY(32px)',
  'fade-in': 'opacity:0',
  'slide-right': 'opacity:0;transform:translateX(40px)',
  'scale': 'opacity:0;transform:scale(0.96)',
};

const REVEALED_STYLES: Record<Animation, string> = {
  'fade-up': 'opacity:1;transform:translateY(0)',
  'fade-in': 'opacity:1',
  'slide-right': 'opacity:1;transform:translateX(0)',
  'scale': 'opacity:1;transform:scale(1)',
};

export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  className = '',
  as: Tag = 'div',
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.style.cssText = REVEALED_STYLES[animation];
      return;
    }

    // Mobile: simpler fade only
    const isMobile = window.innerWidth < 768;
    const anim = isMobile ? 'fade-in' : animation;

    el.style.cssText = `${INITIAL_STYLES[anim]};transition:opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms,transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms;will-change:opacity,transform`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.cssText = `${REVEALED_STYLES[anim]};transition:opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms,transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`;
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animation, delay, duration]);

  return (
      <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
