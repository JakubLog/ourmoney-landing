'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Check, Home, ShoppingBasket, Sparkles, Zap } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type { CalculatorMode } from '@/components/sections/CalculatorMockup';

const SPLIT_YOU = 59;
function useAnimatedAmount(target: number, animate: boolean) {
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
      const progress = Math.min((now - start) / 650, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = from + (target - from) * eased;
      current.current = next;
      setValue(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, animate]);

  return value;
}

function AnimatedMoney({
  value,
  running,
  format,
  className,
}: {
  value: number;
  running: boolean;
  format: (value: number) => string;
  className: string;
}) {
  const animated = useAnimatedAmount(value, running);
  return <span className={className}>{format(Math.round(animated))}</span>;
}

export function ExpenseSplitAnimation({
  label,
  mode,
  running,
}: {
  label: string;
  mode: CalculatorMode;
  running: boolean;
}) {
  const t = useTranslations('HomePage.calculator.expenseAnimation');
  const locale = useLocale();

  const expenses = useMemo(
    () => [
      { key: 'rent', total: 2200, Icon: Home },
      { key: 'groceries', total: 1200, Icon: ShoppingBasket },
      { key: 'utilities', total: 600, Icon: Zap },
    ],
    [],
  );

  const money = useMemo(
    () =>
      new Intl.NumberFormat(locale === 'pl' ? 'pl-PL' : 'en-US', {
        style: 'currency',
        currency: 'PLN',
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const percentYou = mode === 'equal' ? 50 : SPLIT_YOU;
  const percentPartner = 100 - percentYou;
  const total = expenses.reduce((sum, expense) => sum + expense.total, 0);

  return (
    <div
      role="img"
      aria-label={label}
      className={`expense-animation glass relative h-full min-h-[31rem] overflow-hidden rounded-hero p-5 text-left md:p-7 ${
        running ? 'expense-animation--running' : ''
      }`}
    >
      <div className="expense-animation__glow" aria-hidden="true" />

      <div aria-hidden="true" className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              <Sparkles size={14} />
              {t('eyebrow')}
            </div>
            <p className="max-w-sm text-lg font-semibold leading-snug text-white md:text-xl">
              {t('title')}
            </p>
          </div>

          <div className="shrink-0 rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent">
            <span key={mode} className="expense-split-chip inline-block">
              {percentYou}/{percentPartner}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-1 flex-col gap-3">
          {expenses.map(({ key, total: rowTotal, Icon }, index) => {
            const you = rowTotal * (percentYou / 100);
            const partner = rowTotal - you;
            return (
              <article
                key={key}
                className="expense-row rounded-card border border-white/10 bg-white/[0.055] p-4"
                style={{ '--expense-delay': `${120 + index * 220}ms` } as CSSProperties}
              >
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.08] text-white/80">
                    <Icon size={17} strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{t(`items.${key}`)}</p>
                    <p className="mt-0.5 text-xs text-white/40">{t('sharedExpense')}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold tabular-nums text-white">
                    {money.format(rowTotal)}
                  </p>
                  <span className="expense-row__check grid size-6 shrink-0 place-items-center rounded-full bg-accent text-black">
                    <Check size={14} strokeWidth={3} />
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="expense-row__bar h-full rounded-full bg-accent"
                    style={{ width: `${percentYou}%` }}
                  />
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center justify-between gap-2 text-white/50">
                    <span>{t('you', { percent: percentYou })}</span>
                    <AnimatedMoney
                      value={you}
                      running={running}
                      format={money.format}
                      className="font-semibold tabular-nums text-white"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 border-l border-white/10 pl-3 text-white/50">
                    <span>{t('partner', { percent: percentPartner })}</span>
                    <AnimatedMoney
                      value={partner}
                      running={running}
                      format={money.format}
                      className="font-semibold tabular-nums text-white/75"
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="expense-summary mt-5 border-t border-white/10 pt-5">
          <div>
            <p className="text-xs text-white/40">{t('totalLabel')}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-white">
              {money.format(total)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
