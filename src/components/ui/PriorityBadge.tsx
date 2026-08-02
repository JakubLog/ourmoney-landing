'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  label: string;
  /** Skala priorytetow od najnizszego, np. ["niski", "sredni", "wysoki"] */
  steps: string[];
  /** Wartosc koncowa z tresci rekomendacji */
  value: string;
  delay?: number;
  stepDuration?: number;
};

/**
 * Plakietka priorytetu z symulowana kwalifikacja: po wejsciu w viewport przebiega
 * skale od najnizszego stopnia do wartosci koncowej, jakby raport wlasnie liczyl wynik.
 * SSR renderuje od razu wartosc koncowa - bez JS i dla czytnikow ekranu nic sie nie zmienia.
 */
export function PriorityBadge({ label, steps, value, delay = 400, stepDuration = 420 }: Props) {
  const sequence = useMemo(() => {
    const index = steps.findIndex((s) => s.toLowerCase() === value.toLowerCase());
    return index >= 0 ? steps.slice(0, index + 1) : [...steps, value];
  }, [steps, value]);

  // null = stan spoczynku (SSR / reduced motion): od razu wartosc koncowa
  const [stage, setStage] = useState<number | null>(null);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || sequence.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timers: number[] = [];

    const run = () => {
      sequence.forEach((_, i) => {
        timers.push(window.setTimeout(() => setStage(i), i * stepDuration));
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        // Start skali dopiero przy wejsciu w viewport - karta jest wtedy jeszcze
        // przezroczysta (reveal sekcji), wiec skok wartosc->stopien 0 nie jest widoczny
        setStage(0);
        timers.push(window.setTimeout(run, delay));
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [sequence, delay, stepDuration]);

  const settled = stage === null || stage === sequence.length - 1;
  const current = stage === null ? value : sequence[stage];

  return (
    <span
      ref={ref}
      className={`shrink-0 rounded-full px-3 py-1 text-xs transition-colors duration-200 ${
        settled ? 'bg-dark text-white' : 'bg-dark/15 text-dark/60'
      }`}
    >
      <span aria-hidden="true">
        {label}:{' '}
        {/* key wymusza ponowne odpalenie animacji przy kazdym stopniu; */}
        {/* min-w stabilizuje szerokosc plakietki, zeby tytul obok nie skakal */}
        <span
          key={stage ?? 'final'}
          className="inline-block min-w-[6ch] animate-priority-step text-center font-medium"
        >
          {current}
        </span>
      </span>
      <span className="sr-only">
        {label}: {value}
      </span>
    </span>
  );
}
