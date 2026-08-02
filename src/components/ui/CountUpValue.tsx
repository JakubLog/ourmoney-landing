'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  /** Gotowa wartosc z CMS/i18n, np. "11 000 zl", "11%", "1,200 zl" */
  value: string;
  delay?: number;
  duration?: number;
  className?: string;
};

type Parsed = {
  prefix: string;
  suffix: string;
  target: number;
  decimals: number;
  groupSep: string;
  decimalSep: string;
};

/**
 * Rozbija sformatowana wartosc na liczbe + otoczke, zeby licznik mogl odtworzyc
 * dokladnie ten sam zapis (PL uzywa spacji, EN przecinka jako separatora tysiecy).
 * Zwraca null dla wartosci bez liczby - wtedy renderujemy tekst bez animacji.
 */
function parseValue(raw: string): Parsed | null {
  const match = raw.match(/-?\d[\d\s .,]*\d|-?\d/);
  if (!match || match.index === undefined) return null;

  const core = match[0];
  const prefix = raw.slice(0, match.index);
  const suffix = raw.slice(match.index + core.length);

  // Separator z 1-2 cyframi na koncu to czesc dziesietna, kazdy inny to grupowanie tysiecy
  const decimalMatch = core.match(/[.,](\d{1,2})$/);
  const decimals = decimalMatch ? decimalMatch[1].length : 0;
  const decimalSep = decimalMatch ? core.charAt(core.length - decimals - 1) : ',';
  const intPart = decimals ? core.slice(0, -(decimals + 1)) : core;
  const groupMatch = intPart.match(/\d([\s .,])\d/);

  const digits = intPart.replace(/[^\d]/g, '');
  if (!digits) return null;
  const target = Number(`${core.startsWith('-') ? '-' : ''}${digits}.${decimalMatch?.[1] ?? '0'}`);
  if (!Number.isFinite(target)) return null;

  return {
    prefix,
    suffix,
    target,
    decimals,
    groupSep: groupMatch ? groupMatch[1] : '',
    decimalSep,
  };
}

function format(n: number, p: Parsed): string {
  const fixed = Math.abs(n).toFixed(p.decimals);
  const [intPart, decPart] = fixed.split('.');
  const grouped = p.groupSep
    ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, p.groupSep)
    : intPart;
  const sign = n < 0 ? '-' : '';
  return `${p.prefix}${sign}${grouped}${decPart ? p.decimalSep + decPart : ''}${p.suffix}`;
}

/**
 * Licznik 0 -> wartosc docelowa, startuje gdy kafel wjezdza w viewport.
 * SSR renderuje od razu wartosc koncowa (poprawna bez JS i dla czytnikow ekranu),
 * zerowanie dzieje sie dopiero na kliencie - kafel jest wtedy jeszcze przezroczysty.
 */
export function CountUpValue({ value, delay = 0, duration = 1400, className = '' }: Props) {
  const parsed = useMemo(() => parseValue(value), [value]);
  const [display, setDisplay] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !parsed) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    let timer = 0;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        // easeOutExpo - szybki start, miekkie dojscie do kwoty
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setDisplay(format(parsed.target * eased, parsed));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        // Zerowanie dopiero przy wejsciu w viewport - kafel jest wtedy jeszcze
        // przezroczysty (reveal sekcji), wiec skok wartosc->0 nie jest widoczny
        setDisplay(format(0, parsed));
        timer = window.setTimeout(run, delay);
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [parsed, delay, duration]);

  // Czytnik ekranu dostaje wartosc koncowa, nie kolejne klatki licznika
  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
