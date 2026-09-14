'use client';

import { useEffect, useRef, useState } from 'react';
import { CalculatorMockup, type CalculatorMode } from '@/components/sections/CalculatorMockup';
import { ExpenseSplitAnimation } from '@/components/sections/ExpenseSplitAnimation';

type Phase = 0 | 1 | 2 | 3;

const HOLD_MS = 3200;
const FOLLOW_MS = 700;

type Props = {
  calculatorLabel: string;
  expenseLabel: string;
};

/**
 * Jedna os czasu dla obu makiet:
 * 0. oba widoki proporcjonalne,
 * 1. lewy przelacza sie na 50/50,
 * 2. prawa strona z opoznieniem pokazuje skutek,
 * 3. lewy wraca do proporcji, po czym prawa strona znow go dogania.
 */
export function CalculatorAnimationShowcase({ calculatorLabel, expenseLabel }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>(0);

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
    if (!running || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const delay = phase === 0 || phase === 2 ? HOLD_MS : FOLLOW_MS;
    const timeout = window.setTimeout(
      () => setPhase((current) => ((current + 1) % 4) as Phase),
      delay,
    );
    return () => window.clearTimeout(timeout);
  }, [phase, running]);

  const leftMode: CalculatorMode = phase === 1 || phase === 2 ? 'equal' : 'proportional';
  const rightMode: CalculatorMode = phase === 2 || phase === 3 ? 'equal' : 'proportional';

  return (
    <div
      ref={ref}
      className="grid h-full items-stretch gap-5 lg:grid-cols-[0.88fr_1.12fr]"
    >
      <CalculatorMockup label={calculatorLabel} mode={leftMode} running={running} />
      <ExpenseSplitAnimation label={expenseLabel} mode={rightMode} running={running} />
    </div>
  );
}
