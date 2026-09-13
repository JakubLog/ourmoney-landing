'use client';

import type { CSSProperties } from 'react';
import { useEffect, useRef } from 'react';

type ChatLine = { speaker: string; line: string };

type Props = {
  label: string;
  lines: ChatLine[];
  delay?: number;
};

// Shared IntersectionObserver - fire-once, wzorem ScrollReveal
// (src/components/ui/ScrollReveal.tsx): jeden obserwator dla wszystkich
// instancji zamiast jednego per karta.
let sharedObserver: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (sharedObserver) return sharedObserver;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        el.classList.remove('chat--pending');
        el.classList.add('chat--play');
        sharedObserver!.unobserve(el);
      }
    },
    { threshold: 0.35, rootMargin: '0px 0px -10% 0px' },
  );
  return sharedObserver;
}

/**
 * Mikro-dialog pary w stylu Messengera: dymka 1 wskakuje, potem wskaznik
 * "pisze..." (3 kropki), potem wskakuje dymka 2. Cale sterowanie sekwencja
 * lezy w CSS (globals.css, klasy .chat--pending / .chat--play) - komponent
 * tylko przelacza klase po wejsciu w viewport (jak ScrollReveal).
 */
export function ChatDialogue({ label, lines, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: wszystko widoczne statycznie, bez wskaznika pisania.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.classList.add('chat--pending');
    const observer = getObserver();
    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, []);

  if (lines.length < 2) return null;

  return (
    <figure
      ref={ref}
      className="chat mt-6 flex flex-col gap-3"
      style={{ '--chat-delay': `${delay}ms` } as CSSProperties}
    >
      <figcaption className="sr-only">{label}</figcaption>

      <div className="chat__msg chat__msg--left self-start max-w-[88%] md:max-w-sm">
        <p className="text-xs uppercase tracking-[0.1em] text-dark/70">
          {lines[0].speaker}
        </p>
        <blockquote className="mt-1 rounded-card rounded-bl-none border border-dark/10 bg-white px-4 py-3">
          <p className="text-sm leading-relaxed text-dark/80">
            {lines[0].line}
          </p>
        </blockquote>
      </div>

      <div className="chat__msg chat__msg--right relative self-end max-w-[88%] md:max-w-sm text-right">
        <p className="text-xs uppercase tracking-[0.1em] text-dark/70">
          {lines[1].speaker}
        </p>
        <blockquote className="mt-1 rounded-card rounded-br-none bg-dark px-4 py-3 text-left">
          <p className="text-sm leading-relaxed text-white/90">
            {lines[1].line}
          </p>
        </blockquote>
        <span className="chat__typing" aria-hidden="true">
          <span className="chat__dot" />
          <span className="chat__dot" />
          <span className="chat__dot" />
        </span>
      </div>
    </figure>
  );
}
