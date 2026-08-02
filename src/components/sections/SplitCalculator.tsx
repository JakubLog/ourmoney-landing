'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { MoneyInput } from '@/components/ui/MoneyInput';
import { ResultCell } from '@/components/ui/ResultCell';
import { SplitDonut } from '@/components/ui/SplitDonut';
import { SplitBreakdown } from '@/components/ui/SplitBreakdown';
import { SplitModeToggle, type SplitMode } from '@/components/ui/SplitModeToggle';
import { InvertDotButton } from '@/components/ui/InvertDotButton';
import { trackCalculatorModeChange, trackCalculatorUsed } from '@/lib/analytics';

type Props = {
  locale: string;
  ctaHref: string;
  /** Skad wywolany - trafia do GA4 (homepage / calculator_page) */
  placement: string;
};

const DEFAULTS = { you: '6500', partner: '4500', costs: '4000' };

// Typowy rozklad wspolnych kosztow w polskim gospodarstwie - suma wag = 1
const CATEGORY_WEIGHTS = [
  { key: 'catRent', weight: 0.55 },
  { key: 'catGroceries', weight: 0.3 },
  { key: 'catUtilities', weight: 0.15 },
] as const;

function toAmount(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function SplitCalculator({ locale, ctaHref, placement }: Props) {
  const t = useTranslations('SplitCalculator');
  const [mode, setMode] = useState<SplitMode>('proportional');
  const [you, setYou] = useState(DEFAULTS.you);
  const [partner, setPartner] = useState(DEFAULTS.partner);
  const [costs, setCosts] = useState(DEFAULTS.costs);

  const money = useMemo(
    () =>
      new Intl.NumberFormat(locale === 'pl' ? 'pl-PL' : 'en-US', {
        style: 'currency',
        currency: 'PLN',
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  const result = useMemo(() => {
    const incomeYou = toAmount(you);
    const incomePartner = toAmount(partner);
    const shared = toAmount(costs);
    const totalIncome = incomeYou + incomePartner;
    if (totalIncome === 0 || shared === 0) return null;

    // Ta sama kolejnosc dzialan co w aplikacji (ProportionVisualizationScreen
    // + partnerBalance.utils): najpierw zaokraglony procent udzialu, dopiero
    // z niego kwota. Inaczej landing pokazywalby inne liczby niz aplikacja.
    const proportionalPercent = Math.round((incomeYou / totalIncome) * 100);
    const percentYou = mode === 'equal' ? 50 : proportionalPercent;
    const percentPartner = 100 - percentYou;

    // Roznica miedzy modelami jest ta sama niezaleznie od wybranego trybu -
    // zmienia sie tylko to, z ktorej strony na nia patrzymy
    const gap = Math.abs(shared * (proportionalPercent / 100) - shared / 2);

    const payYou = shared * (percentYou / 100);

    // Rozbicie na typowe kategorie domowe. Proporcje kategorii sa przykladowe,
    // ale kwoty per osoba licza sie z liczb uzytkownika.
    const categories = CATEGORY_WEIGHTS.map(({ key, weight }) => {
      const total = shared * weight;
      return {
        key,
        total,
        you: total * (percentYou / 100),
        partner: total * (percentPartner / 100),
      };
    });

    // Rozliczenie: zakladamy, ze najwiekszy rachunek placi jedna osoba, reszte druga.
    // To jest realna sytuacja, ktorej kalkulator nie rozwiazuje, a aplikacja tak.
    const paidByYou = categories[0].total;
    const balance = paidByYou - payYou;

    return {
      payYou,
      payPartner: shared * (percentPartner / 100),
      percentYou,
      percentPartner,
      categories,
      // Dodatnie = partner oddaje Tobie, ujemne = Ty oddajesz partnerowi
      settlement: Math.round(balance),
      // Rok liczymy z zaokraglonej kwoty miesiecznej, zeby uzytkownik
      // mnozac to co widzi dostal dokladnie te sama liczbe
      gap: Math.round(gap),
      // Przy podziale po rowno doplaca ta osoba, ktora zarabia mniej
      lowerEarnerIsYou: incomeYou < incomePartner,
      isEven: gap < 1,
    };
  }, [you, partner, costs, mode]);

  const handleChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    trackCalculatorUsed(locale, placement);
  };

  const insightKey = (): string => {
    if (mode === 'equal') {
      return result?.lowerEarnerIsYou ? 'insightModeEqualYou' : 'insightModeEqualPartner';
    }
    return result?.lowerEarnerIsYou ? 'insightYou' : 'insightPartner';
  };

  const insight = !result
    ? null
    : result.isEven
      ? t('insightEqual')
      : t(insightKey(), {
          amount: money.format(result.gap),
          yearly: money.format(result.gap * 12),
        });

  return (
    <div className="glass rounded-hero p-6 md:p-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Wejscie */}
        <div className="flex flex-col gap-4">
          <SplitModeToggle
            value={mode}
            onChange={(m) => {
              setMode(m);
              trackCalculatorModeChange(m, placement, locale);
            }}
            groupLabel={t('modeLabel')}
            labels={{ proportional: t('modeProportional'), equal: t('modeEqual') }}
          />
          <MoneyInput
            id="calc-you"
            label={t('yourIncome')}
            value={you}
            onChange={handleChange(setYou)}
            currency="zł"
          />
          <MoneyInput
            id="calc-partner"
            label={t('partnerIncome')}
            value={partner}
            onChange={handleChange(setPartner)}
            currency="zł"
          />
          <MoneyInput
            id="calc-costs"
            label={t('sharedCosts')}
            value={costs}
            onChange={handleChange(setCosts)}
            currency="zł"
          />
        </div>

        {/* Wynik */}
        <div className="flex flex-col gap-6" aria-live="polite">
          {result ? (
            <div className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">{t('resultTitle')}</p>

              {/* Donut - ten sam obraz podzialu co w onboardingu aplikacji */}
              <div className="flex justify-center py-2">
                <SplitDonut
                  percentYou={result.percentYou}
                  percentPartner={result.percentPartner}
                  label={t('barLabel', {
                    you: result.percentYou,
                    partner: result.percentPartner,
                  })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <ResultCell
                  color="var(--color-accent)"
                  name={t('you')}
                  amount={money.format(result.payYou)}
                  share={
                    mode === 'equal'
                      ? t('halfOfCosts')
                      : t('shareOfIncome', { percent: result.percentYou })
                  }
                />
                <ResultCell
                  color="#3f3f46"
                  name={t('partner')}
                  amount={money.format(result.payPartner)}
                  share={
                    mode === 'equal'
                      ? t('halfOfCosts')
                      : t('shareOfIncome', { percent: result.percentPartner })
                  }
                />
              </div>

              {/* Ten sam procent, ale na konkretnych rachunkach */}
              <SplitBreakdown
                title={t('breakdownTitle')}
                note={t('breakdownNote')}
                youLabel={t('you')}
                partnerLabel={t('partner')}
                format={(v) => money.format(v)}
                rows={result.categories.map((c) => ({
                  label: t(c.key),
                  total: c.total,
                  you: c.you,
                  partner: c.partner,
                }))}
              />
            </div>
          ) : (
            <p className="text-sm text-white/50">{t('emptyState')}</p>
          )}
        </div>
      </div>

      {/* Najwazniejszy komunikat - pelna szerokosc pod obiema kolumnami */}
      {insight && (
        <p className="mt-8 rounded-panel bg-white/[0.06] p-4 text-center text-sm leading-relaxed text-white/80 md:text-base">
          {insight}
        </p>
      )}

      {/* Pomost do produktu: procent to latwa czesc, rozliczenie kto komu odda
          na koniec miesiaca jest tym, czego kalkulator nie zrobi za nich */}
      {result && (
        <div className="mt-4 rounded-panel border border-accent/20 bg-accent/[0.07] p-4 text-center">
          <p className="text-sm leading-relaxed text-white/80 md:text-base">
            {result.settlement === 0
              ? t('settlementEven')
              : t(result.settlement > 0 ? 'settlementPartnerOwes' : 'settlementYouOwe', {
                  amount: money.format(Math.abs(result.settlement)),
                })}
          </p>
          <p className="mt-2 text-xs text-white/50">{t('settlementApp')}</p>
        </div>
      )}

      <div className="mt-8 flex flex-col items-center gap-4 border-t border-white/10 pt-8">
        <InvertDotButton
          href={ctaHref}
          className="sheen inline-block rounded-full bg-accent px-8 py-4 text-sm font-semibold text-black"
          location="calculator"
          locale={locale}
        >
          {t('cta')}
        </InvertDotButton>
        <p className="text-center text-sm text-white/60">{t('ctaHint')}</p>
        <p className="text-center text-xs text-white/40">{t('trackingNote')}</p>
      </div>
    </div>
  );
}
