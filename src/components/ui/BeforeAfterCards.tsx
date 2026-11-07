'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Check, Brain } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Logo } from '@/components/ui/Logo';

type Props = {
  before: string[];
  after: string[];
  beforeLabel: string;
  afterLabel: string;
};

const FIRST_MS = 400;
const HOLD_MS = 2200;

/**
 * Punkty "przed" i "po" o tym samym indeksie tworza pare i podswietlaja sie
 * razem, po kolei w petli. Petla dziala tylko w viewporcie; przy
 * prefers-reduced-motion nic sie nie podswietla (stan jak przed animacja).
 */
export function BeforeAfterCards({ before, after, beforeLabel, afterLabel }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  const [active, setActive] = useState(-1);
  const pairs = Math.max(before.length, after.length);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => setRunning(entries.some((entry) => entry.isIntersecting)),
      { threshold: 0.3 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running || pairs === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timeout = window.setTimeout(
      () => setActive((current) => (current + 1) % pairs),
      active === -1 ? FIRST_MS : HOLD_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [active, running, pairs]);

  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-6">
      <ScrollReveal>
        <div className="rounded-2xl bg-white border border-dark/10 p-8 md:p-10 h-full">
          <h3 className="text-dark/60 text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
            <Brain className="w-4 h-4 shrink-0" aria-hidden="true" />
            {beforeLabel}
          </h3>
          <ul className="list-none p-0 m-0">
            {before.map((item, index) => {
              const on = index === active;
              return (
                <li
                  key={item}
                  className={`flex items-start gap-3 -mx-3 px-3 py-2 rounded-xl transition-colors duration-500 ${
                    on ? 'bg-red-50' : 'bg-transparent'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-[background-color,transform] duration-500 ${
                      on ? 'bg-red-500 scale-110' : 'bg-red-100'
                    }`}
                  >
                    <X
                      className={`w-3 h-3 transition-colors duration-500 ${on ? 'text-white' : 'text-red-500'}`}
                    />
                  </div>
                  <span
                    className={`text-sm leading-relaxed transition-colors duration-500 ${
                      on ? 'text-dark' : 'text-dark/60'
                    }`}
                  >
                    {item}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="rounded-2xl bg-dark p-8 md:p-10 h-full">
          {/* Logo zamiast tekstu; afterLabel zostaje jako nazwa dostepna naglowka */}
          <h3 className="mb-4 flex items-center">
            <span className="sr-only">{afterLabel}</span>
            <span aria-hidden="true" className="flex">
              <Logo />
            </span>
          </h3>
          <ul className="list-none p-0 m-0">
            {after.map((item, index) => {
              const on = index === active;
              return (
                <li
                  key={item}
                  className={`flex items-start gap-3 -mx-3 px-3 py-2 rounded-xl transition-colors duration-500 ${
                    on ? 'bg-white/10' : 'bg-transparent'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-[background-color,transform] duration-500 ${
                      on ? 'bg-accent scale-110' : 'bg-accent/20'
                    }`}
                  >
                    <Check
                      className={`w-3 h-3 transition-colors duration-500 ${on ? 'text-dark' : 'text-accent'}`}
                    />
                  </div>
                  <span
                    className={`text-sm leading-relaxed transition-colors duration-500 ${
                      on ? 'text-white' : 'text-white/70'
                    }`}
                  >
                    {item}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </ScrollReveal>
    </div>
  );
}
