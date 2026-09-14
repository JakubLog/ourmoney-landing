'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef } from 'react';

type Props = {
  children: ReactNode;
  /** Opoznienie startu (stagger kart w siatce), w ms. */
  delay?: number;
  className?: string;
};

// Shared IntersectionObserver - fire-once, wzorem ScrollReveal / ChatDialogue:
// jeden obserwator dla wszystkich kart zamiast jednego per karta.
let sharedObserver: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        el.classList.remove('pain-card--pending');
        el.classList.add('pain-card--in');
        sharedObserver!.unobserve(el);
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
  );
  return sharedObserver;
}

/**
 * Karta sekcji "wyzwania": po wejsciu w viewport odslania sie (fade + lekkie
 * uniesienie), a razem z nia rysuje sie kreska ilustracji w rogu
 * (PainPointIllustration). Cala choreografia siedzi w CSS
 * (globals.css, klasy .pain-card--pending / .pain-card--in + .il-*) -
 * komponent tylko przelacza klase po wejsciu w viewport.
 *
 * Wlasny wrapper zamiast ScrollReveal, bo ScrollReveal steruje inline-stylem
 * i nie zostawia klasy, od ktorej moglyby zalezec animacje SVG w srodku.
 */
export function PainPointCard({ children, delay = 0, className = '' }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: karta i ilustracja od razu w stanie koncowym.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.classList.add('pain-card--pending');
    const observer = getObserver();
    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, []);

  return (
    <article
      ref={ref}
      className={`pain-card ${className}`}
      style={{ '--card-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </article>
  );
}
