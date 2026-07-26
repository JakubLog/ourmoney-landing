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
  'fade-up': 'opacity:0;transform:translateY(24px)',
  'fade-in': 'opacity:0',
  'slide-right': 'opacity:0;transform:translateX(32px)',
  'scale': 'opacity:0;transform:scale(0.97)',
};

const REVEALED_STYLES: Record<Animation, string> = {
  'fade-up': 'opacity:1;transform:translateY(0)',
  'fade-in': 'opacity:1',
  'slide-right': 'opacity:1;transform:translateX(0)',
  'scale': 'opacity:1;transform:scale(1)',
};

// Shared IntersectionObserver - one observer for all ScrollReveal instances
type RevealEntry = {
  el: HTMLElement;
  anim: Animation;
  delay: number;
  duration: number;
};

const registry = new Map<Element, RevealEntry>();
let sharedObserver: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const item = registry.get(entry.target);
        if (!item) continue;
        item.el.style.cssText = `${REVEALED_STYLES[item.anim]};transition:opacity ${item.duration}ms cubic-bezier(0.22,1,0.36,1) ${item.delay}ms,transform ${item.duration}ms cubic-bezier(0.22,1,0.36,1) ${item.delay}ms`;
        sharedObserver!.unobserve(entry.target);
        registry.delete(entry.target);
      }
    },
    // rootMargin: reveal zaczyna sie zanim element w pelni wejdzie w viewport -
    // przy szybkim scrollu (Lenis) użytkownik nie widzi pustych sekcji
    { threshold: 0, rootMargin: '0px 0px -10% 0px' },
  );
  return sharedObserver;
}

export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 500,
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

    registry.set(el, { el, anim, delay, duration });
    const observer = getObserver();
    observer.observe(el);

    return () => {
      observer.unobserve(el);
      registry.delete(el);
    };
  }, [animation, delay, duration]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
