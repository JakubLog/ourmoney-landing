import Image from 'next/image';
import { TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { CountUpValue } from '@/components/ui/CountUpValue';
import { PriorityBadge } from '@/components/ui/PriorityBadge';

type Stat = { label: string; value: string };
type Insight = { title: string; description: string; type: 'positive' | 'warning' };
type Recommendation = { title: string; description: string; priority: string; impact: string };

type Props = {
  badge: string;
  reportTitle: string;
  summary: string;
  stats: Stat[];
  insightsTitle: string;
  insights: Insight[];
  recommendationsTitle: string;
  recommendation: Recommendation;
  priorityLabel: string;
  priorityScale: string[];
};

/**
 * Odwzorowanie raportu AI z aplikacji (AIInsightsCard: podsumowanie + kafle liczb,
 * kluczowe spostrzezenia z typem positive/warning, rekomendacja z priorytetem).
 * Struktura i nazwy sekcji 1:1 z produktem, kolory z systemu landingu.
 * Tresc jest przykladowa - oznaczona plakietka.
 */
export function AiReportCard({
  badge,
  reportTitle,
  summary,
  stats,
  insightsTitle,
  insights,
  recommendationsTitle,
  recommendation,
  priorityLabel,
  priorityScale,
}: Props) {
  // Biala plansza pojawia sie pierwsza i szybko, zeby nie przykrywac kaskady w srodku
  // (opacity rodzica mnozy sie z opacity dzieci - dlugi fade planszy zjadlby stagger).
  return (
    <ScrollReveal
      animation="fade-in"
      duration={300}
      className="rounded-hero bg-white p-6 text-dark md:p-8"
    >
      {/* Naglowek raportu */}
      {/* Na waskim ekranie plakietka schodzi pod tytul, zeby go nie sciskac */}
      <ScrollReveal
        delay={200}
        className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <Image
            src="/icon.svg"
            alt=""
            width={32}
            height={32}
            aria-hidden="true"
            className="h-8 w-8 shrink-0 rounded-full"
          />
          <h3 className="text-lg font-semibold">{reportTitle}</h3>
        </div>
        <span className="self-start rounded-full border border-dark/10 bg-surface px-3 py-1 text-xs text-dark/50 sm:shrink-0 sm:self-auto">
          {badge}
        </span>
      </ScrollReveal>

      <ScrollReveal delay={280}>
        <p className="text-base leading-relaxed text-dark/70">{summary}</p>
      </ScrollReveal>

      {/* Kafle liczb - jak w raporcie w aplikacji */}
      {/* Kazdy kafel doskakuje osobno, kaskadowo od lewej */}
      <dl className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <ScrollReveal
            key={stat.label}
            animation="scale"
            delay={380 + index * 90}
            className="rounded-card bg-surface p-4"
          >
            <dt className="text-xs text-dark/50">{stat.label}</dt>
            <dd className="mt-1 text-xl font-semibold tabular-nums">
              {/* Licznik startuje razem z wjazdem kafla */}
              <CountUpValue value={stat.value} delay={380 + index * 90} />
            </dd>
          </ScrollReveal>
        ))}
      </dl>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Kluczowe spostrzezenia */}
        <div>
          <ScrollReveal
            as="h4"
            delay={120}
            className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-dark/40"
          >
            {insightsTitle}
          </ScrollReveal>
          <ul className="flex flex-col gap-4 p-0">
            {insights.map((item, index) => (
              <ScrollReveal
                key={item.title}
                as="li"
                delay={220 + index * 130}
                className="flex gap-3 rounded-card bg-surface p-4"
              >
                <span className="mt-0.5 shrink-0" aria-hidden="true">
                  {item.type === 'positive' ? (
                    <TrendingUp size={18} className="text-dark" />
                  ) : (
                    <AlertCircle size={18} className="text-amber-600" />
                  )}
                </span>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-dark/60">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </ul>
        </div>

        {/* Rekomendacja - startuje rownolegle z lewa kolumna */}
        <div>
          <ScrollReveal
            as="h4"
            delay={120}
            className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-dark/40"
          >
            {recommendationsTitle}
          </ScrollReveal>
          <ScrollReveal
            animation="slide-right"
            delay={220}
            className="rounded-card bg-surface p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="font-semibold">{recommendation.title}</p>
              <PriorityBadge
                label={priorityLabel}
                steps={priorityScale}
                value={recommendation.priority}
              />
            </div>
            <p className="mt-1 text-sm leading-relaxed text-dark/60">{recommendation.description}</p>
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-dark">
              <Lightbulb size={16} className="shrink-0" aria-hidden="true" />
              {recommendation.impact}
            </p>
          </ScrollReveal>
        </div>
      </div>
    </ScrollReveal>
  );
}
