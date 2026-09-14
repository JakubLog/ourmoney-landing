'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { CountUpValue } from '@/components/ui/CountUpValue';
import { ResultCell } from '@/components/ui/ResultCell';
import { SplitDonut } from '@/components/ui/SplitDonut';

// Te same liczby co DEFAULTS w SplitCalculator - mockup pokazuje dokladnie to,
// co uzytkownik zastanie po wejsciu na /kalkulator
const INCOME_YOU = 6500;
const INCOME_PARTNER = 4500;
const COSTS = 4000;
// Math.round(6500 / 11000 * 100) - ta sama kolejnosc dzialan co w SplitCalculator
const PROP_PERCENT = 59;
const TWEEN_MS = 700;

export type CalculatorMode = 'proportional' | 'equal';

/** Plynne dojscie do nowego celu przy kazdej jego zmianie (easeOutCubic). */
function useTween(target: number, animate: boolean) {
  const [value, setValue] = useState(target);
  const current = useRef(target);
  useEffect(() => {
    if (!animate) {
      current.current = target;
      return;
    }
    const from = current.current;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / TWEEN_MS, 1);
      const v = from + (target - from) * (1 - Math.pow(1 - t, 3));
      current.current = v;
      setValue(v);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, animate]);
  return value;
}

/**
 * Nieinteraktywny, zapetlony podglad kalkulatora: tryb podzialu przelacza sie
 * sam, a donut i kwoty tweenuja miedzy 59/41 a 50/50. Pauzuje poza viewportem,
 * przy prefers-reduced-motion zastyga na podziale proporcjonalnym.
 */
export function CalculatorMockup({
  label,
  mode,
  running,
}: {
  label: string;
  mode: CalculatorMode;
  running: boolean;
}) {
  const t = useTranslations('SplitCalculator');
  const locale = useLocale();

  const money = useMemo(
    () =>
      new Intl.NumberFormat(locale === 'pl' ? 'pl-PL' : 'en-US', {
        style: 'currency',
        currency: 'PLN',
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const pct = useTween(mode === 'equal' ? 50 : PROP_PERCENT, running);
  const percentYou = Math.round(pct);
  const percentPartner = 100 - percentYou;
  const payYou = COSTS * (pct / 100);

  const inputRows = [
    { label: t('yourIncome'), amount: INCOME_YOU, delay: 0 },
    { label: t('partnerIncome'), amount: INCOME_PARTNER, delay: 150 },
    { label: t('sharedCosts'), amount: COSTS, delay: 300 },
  ];

  return (
    <div role="img" aria-label={label} className="glass h-full rounded-hero p-6 text-left md:p-8">
      <div aria-hidden="true" className="flex h-full flex-col justify-between">
        <div>
          {/* Atrapa przelacznika trybu - ten sam wyglad co SplitModeToggle */}
          <div className="flex gap-2 rounded-full bg-white/[0.06] p-1">
            {(['proportional', 'equal'] as const).map((m) => (
              <span
                key={m}
                className={`flex-1 rounded-full px-4 py-2 text-center text-xs font-semibold transition-colors duration-500 ${
                  mode === m ? 'bg-accent text-black' : 'text-white/60'
                }`}
              >
                {m === 'proportional' ? t('modeProportional') : t('modeEqual')}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            {inputRows.map((row) => (
              <div key={row.label} className="flex items-baseline justify-between gap-4">
                <span className="text-sm text-white/60">{row.label}</span>
                <CountUpValue
                  value={money.format(row.amount)}
                  delay={row.delay}
                  className="font-semibold text-white tabular-nums"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-4 border-t border-white/10 pt-6">
          <SplitDonut
            percentYou={percentYou}
            percentPartner={percentPartner}
            label={t('barLabel', { you: percentYou, partner: percentPartner })}
          />
          <div className="grid w-full grid-cols-2 gap-4">
            <ResultCell
              color="var(--color-accent)"
              name={t('you')}
              amount={money.format(payYou)}
              share={
                mode === 'equal' ? t('halfOfCosts') : t('shareOfIncome', { percent: percentYou })
              }
            />
            <ResultCell
              color="#3f3f46"
              name={t('partner')}
              amount={money.format(COSTS - payYou)}
              share={
                mode === 'equal' ? t('halfOfCosts') : t('shareOfIncome', { percent: percentPartner })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
